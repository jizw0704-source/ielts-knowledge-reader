import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_BASE_URL = 'https://api.minimaxi.com/v1';
const DEFAULT_MODEL = 'MiniMax-M3';

function getApiUrl() {
  if (process.env.MINIMAX_API_URL) {
    return process.env.MINIMAX_API_URL;
  }

  const baseUrl = process.env.MINIMAX_BASE_URL || DEFAULT_BASE_URL;
  return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
}

function getArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function showHelp() {
  console.log(`Usage:
  node tools/generate-context-vocabulary.mjs --article-id <article-id> [--dry-run] [--output <generated/path.json>]

Environment variables:
  MINIMAX_API_KEY   Required for a real API call. Never commit this value.
  MINIMAX_MODEL     Optional. Defaults to ${DEFAULT_MODEL}.
  MINIMAX_BASE_URL  Optional OpenAI-compatible base URL. Defaults to ${DEFAULT_BASE_URL}.
  MINIMAX_API_URL   Optional full chat-completions URL. Overrides MINIMAX_BASE_URL.

Examples:
  node tools/generate-context-vocabulary.mjs --article-id how-public-libraries-are-changing-in-the-digital-age --dry-run
  node tools/generate-context-vocabulary.mjs --article-id how-public-libraries-are-changing-in-the-digital-age

The output path must stay inside generated/. Drafts are ignored by Git and never overwrite context-vocabulary.js.`);
}

async function loadArticles() {
  const sourcePath = path.join(PROJECT_ROOT, 'articles.js');
  const source = await readFile(sourcePath, 'utf8');
  const sandbox = { window: {} };

  vm.runInNewContext(source, sandbox, { filename: sourcePath });

  if (!Array.isArray(sandbox.window.RAW_ARTICLES)) {
    throw new Error('articles.js did not expose window.RAW_ARTICLES.');
  }

  return sandbox.window.RAW_ARTICLES;
}

function formatSummary(article) {
  return [article.summaryEn, article.summaryZh].filter(Boolean).join('\n');
}

function formatArticleText(article) {
  return Array.isArray(article.content) ? article.content.join('\n\n') : String(article.content || '');
}

async function buildPrompt(article) {
  const templatePath = path.join(PROJECT_ROOT, 'prompts', 'context-vocabulary-generation.md');
  const template = await readFile(templatePath, 'utf8');
  const replacements = {
    '{{ARTICLE_ID}}': article.id,
    '{{TITLE}}': article.title,
    '{{SUMMARY}}': formatSummary(article),
    '{{CORE_WORDS}}': JSON.stringify(article.coreWords || [], null, 2),
    '{{ARTICLE_TEXT}}': formatArticleText(article),
    '{{REFERENCES}}': JSON.stringify(article.references || [], null, 2),
  };

  return Object.entries(replacements).reduce(
    (result, [placeholder, value]) => result.replaceAll(placeholder, value),
    template,
  );
}

function extractJsonArray(rawContent) {
  const withoutThinking = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const withoutFence = withoutThinking
    .replace(/^```(?:json|javascript|js)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const start = withoutFence.indexOf('[');
  const end = withoutFence.lastIndexOf(']');

  if (start < 0 || end <= start) {
    throw new Error('MiniMax response did not contain a JSON array.');
  }

  return JSON.parse(withoutFence.slice(start, end + 1));
}

function validateEntries(entries) {
  if (!Array.isArray(entries)) {
    throw new Error('Generated vocabulary must be an array.');
  }

  if (entries.length < 20 || entries.length > 40) {
    throw new Error(`Expected 20-40 vocabulary entries, received ${entries.length}.`);
  }

  const requiredFields = ['term', 'type', 'definitionZh', 'definitionEn', 'example'];
  const seenTerms = new Set();

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`Entry ${index + 1} must be an object.`);
    }

    requiredFields.forEach((field) => {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        throw new Error(`Entry ${index + 1} has an invalid ${field}.`);
      }
    });

    if (!['word', 'phrase'].includes(entry.type)) {
      throw new Error(`Entry ${index + 1} has unsupported type: ${entry.type}.`);
    }

    const normalizedTerm = entry.term.trim().toLowerCase();
    if (seenTerms.has(normalizedTerm)) {
      throw new Error(`Duplicate generated term: ${entry.term}.`);
    }
    seenTerms.add(normalizedTerm);
  });
}

function findContextWarnings(entries, article) {
  const articleText = [article.title, formatSummary(article), formatArticleText(article)]
    .join('\n')
    .toLowerCase();

  return entries
    .filter((entry) => !articleText.includes(entry.term.toLowerCase()))
    .map((entry) => entry.term);
}

async function requestVocabulary(prompt) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || DEFAULT_MODEL;
  const apiUrl = getApiUrl();

  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY is not set. Set it in the current shell and do not save it in the repository.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Generate only the strict JSON array requested by the user. Do not include reasoning or Markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
      stream: false,
      max_completion_tokens: 8192,
      temperature: 0.3,
      top_p: 0.9,
    }),
    signal: AbortSignal.timeout(120000),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`MiniMax request failed with HTTP ${response.status}: ${responseText.slice(0, 500)}`);
  }

  const data = JSON.parse(responseText);
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('MiniMax response did not include message content.');
  }

  return { content, model: data.model || model, usage: data.usage || null };
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }

  const articleId = getArgument('--article-id');
  if (!articleId) {
    showHelp();
    throw new Error('--article-id is required.');
  }

  const articles = await loadArticles();
  const article = articles.find((item) => item.id === articleId);
  if (!article) {
    throw new Error(`Article not found: ${articleId}`);
  }

  const prompt = await buildPrompt(article);
  const requestedOutput = getArgument('--output');
  const outputPath = path.resolve(
    PROJECT_ROOT,
    requestedOutput || path.join('generated', 'context-vocabulary', `${articleId}.json`),
  );
  const generatedRoot = path.join(PROJECT_ROOT, 'generated');

  if (!outputPath.startsWith(`${generatedRoot}${path.sep}`)) {
    throw new Error('Draft output must stay inside the generated/ directory.');
  }

  if (process.argv.includes('--dry-run')) {
    console.log(`Dry run passed for ${article.id}.`);
    console.log(`Model: ${process.env.MINIMAX_MODEL || DEFAULT_MODEL}`);
    console.log(`API URL: ${getApiUrl()}`);
    console.log(`Prompt characters: ${prompt.length}`);
    console.log(`Draft output: ${outputPath}`);
    console.log('No API request was sent.');
    return;
  }

  const result = await requestVocabulary(prompt);
  const entries = extractJsonArray(result.content);
  validateEntries(entries);
  const warnings = findContextWarnings(entries, article);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');

  console.log(`Generated ${entries.length} entries with ${result.model}.`);
  console.log(`Draft saved to: ${outputPath}`);
  if (result.usage) {
    console.log(`Token usage: ${JSON.stringify(result.usage)}`);
  }
  if (warnings.length) {
    console.warn(`Human review required: these terms were not found verbatim in the article: ${warnings.join(', ')}`);
  }
  console.log('Review the draft manually before editing context-vocabulary.js.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
