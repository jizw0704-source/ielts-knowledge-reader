[CmdletBinding()]
param(
    [ValidateSet('Test', 'Generate')]
    [string]$Mode = 'Test',

    [string]$ArticleId = 'how-public-libraries-are-changing-in-the-digital-age',

    [string]$BaseUrl = 'https://api.minimaxi.com/v1',

    [string]$Model = 'MiniMax-M3'
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$projectRoot = Split-Path -Parent $PSScriptRoot
$generatorPath = Join-Path $PSScriptRoot 'generate-context-vocabulary.mjs'
$localEnvPath = Join-Path $projectRoot '.env.local'
$keyPointer = [IntPtr]::Zero
$plainKey = $null
$secureKey = $null
$previousKey = $env:MINIMAX_API_KEY
$previousBaseUrl = $env:MINIMAX_BASE_URL
$previousModel = $env:MINIMAX_MODEL

function Read-LocalEnvConfig {
    param([string]$Path)

    $config = @{}
    if (-not (Test-Path -LiteralPath $Path)) {
        return $config
    }

    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmedLine = $line.Trim()
        if (-not $trimmedLine -or $trimmedLine.StartsWith('#')) {
            continue
        }

        $parts = $trimmedLine.Split('=', 2)
        if ($parts.Count -ne 2) {
            continue
        }

        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        if ($value.Length -ge 2) {
            $hasDoubleQuotes = $value.StartsWith('"') -and $value.EndsWith('"')
            $hasSingleQuotes = $value.StartsWith("'") -and $value.EndsWith("'")
            if ($hasDoubleQuotes -or $hasSingleQuotes) {
                $value = $value.Substring(1, $value.Length - 2)
            }
        }

        $config[$name] = $value
    }

    return $config
}

function Restore-ProcessEnvironmentVariable {
    param(
        [string]$Name,
        [AllowNull()]
        [string]$Value
    )

    if ($null -eq $Value) {
        Remove-Item "Env:$Name" -ErrorAction SilentlyContinue
        return
    }

    Set-Item "Env:$Name" $Value
}

try {
    $localConfig = Read-LocalEnvConfig -Path $localEnvPath

    if (-not $PSBoundParameters.ContainsKey('BaseUrl')) {
        if (-not [string]::IsNullOrWhiteSpace($localConfig['MINIMAX_BASE_URL'])) {
            $BaseUrl = $localConfig['MINIMAX_BASE_URL']
        }
        elseif (-not [string]::IsNullOrWhiteSpace($previousBaseUrl)) {
            $BaseUrl = $previousBaseUrl
        }
    }

    if (-not $PSBoundParameters.ContainsKey('Model')) {
        if (-not [string]::IsNullOrWhiteSpace($localConfig['MINIMAX_MODEL'])) {
            $Model = $localConfig['MINIMAX_MODEL']
        }
        elseif (-not [string]::IsNullOrWhiteSpace($previousModel)) {
            $Model = $previousModel
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($localConfig['MINIMAX_API_KEY'])) {
        $plainKey = $localConfig['MINIMAX_API_KEY']
        Write-Host 'Using MiniMax API key from .env.local.'
    }
    elseif (-not [string]::IsNullOrWhiteSpace($previousKey)) {
        $plainKey = $previousKey
        Write-Host 'Using MiniMax API key from the current process environment.'
    }
    else {
        $secureKey = Read-Host 'Paste a newly created MiniMax API key' -AsSecureString
        $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
        $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
    }

    if ([string]::IsNullOrWhiteSpace($plainKey)) {
        throw 'The MiniMax API key cannot be empty. Add it to .env.local or enter it when prompted.'
    }

    if (($plainKey -match '\s') -or ($plainKey -match 'SetEnvironmentVariable')) {
        throw 'The MiniMax API key appears malformed. Paste only the newly created key.'
    }

    $env:MINIMAX_API_KEY = $plainKey
    $env:MINIMAX_BASE_URL = $BaseUrl.TrimEnd('/')
    $env:MINIMAX_MODEL = $Model

    if ($Mode -eq 'Test') {
        $endpoint = "$($env:MINIMAX_BASE_URL)/chat/completions"
        $headers = @{
            Authorization = "Bearer $plainKey"
            'Content-Type' = 'application/json'
        }
        $body = @{
            model = $Model
            messages = @(
                @{ role = 'user'; content = 'Reply with exactly OK.' }
            )
            thinking = @{ type = 'disabled' }
            stream = $false
            max_completion_tokens = 16
            temperature = 0
        } | ConvertTo-Json -Depth 6

        $requestParameters = @{
            Method = 'Post'
            Uri = $endpoint
            Headers = $headers
            Body = $body
            TimeoutSec = 45
        }
        $response = Invoke-RestMethod @requestParameters

        if ([string]::IsNullOrWhiteSpace($response.choices[0].message.content)) {
            throw 'MiniMax responded without message content.'
        }

        Write-Host "Connection passed: $Model at $endpoint"
        return
    }

    Push-Location $projectRoot
    try {
        & node $generatorPath --article-id $ArticleId
        if ($LASTEXITCODE -ne 0) {
            throw "Vocabulary generation failed with exit code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}
finally {
    Restore-ProcessEnvironmentVariable -Name 'MINIMAX_API_KEY' -Value $previousKey
    Restore-ProcessEnvironmentVariable -Name 'MINIMAX_BASE_URL' -Value $previousBaseUrl
    Restore-ProcessEnvironmentVariable -Name 'MINIMAX_MODEL' -Value $previousModel

    if ($keyPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
    }

    $plainKey = $null
}
