[CmdletBinding()]
param(
    [ValidateSet('Test', 'Generate')]
    [string]$Mode = 'Test',

    [string]$ArticleId = 'how-public-libraries-are-changing-in-the-digital-age',

    [string]$BaseUrl = 'https://api.minimax.com/v1',

    [string]$Model = 'MiniMax-M3'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$generatorPath = Join-Path $PSScriptRoot 'generate-context-vocabulary.mjs'
$keyPointer = [IntPtr]::Zero
$plainKey = $null
$previousKey = $env:MINIMAX_API_KEY
$previousBaseUrl = $env:MINIMAX_BASE_URL
$previousModel = $env:MINIMAX_MODEL

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
    $secureKey = Read-Host 'Paste a newly created MiniMax API key' -AsSecureString
    $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)

    if ([string]::IsNullOrWhiteSpace($plainKey)) {
        throw 'The MiniMax API key cannot be empty.'
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
