import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const ARTICLE_WORD_PATTERN = /[A-Za-zÀ-ÿ]+(?:['’][A-Za-zÀ-ÿ]+)?/g;
const ARTICLE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLISH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DIFFICULTY_PATTERN = /^IELTS \d(?:\.\d)?–\d(?:\.\d)?$/;
const HAN_PATTERN = /\p{Script=Han}/u;
const UNEXPECTED_DEFINITION_SCRIPT_PATTERN = /[\p{Script=Arabic}\p{Script=Cyrillic}]/u;
const QUESTION_MARK_RUN_PATTERN = /\?{3,}/u;
const REPLACEMENT_CHARACTER_PATTERN = /\uFFFD/u;

const REQUIRED_ARTICLE_STRING_FIELDS = [
  'id',
  'title',
  'subtitle',
  'sourceType',
  'difficulty',
  'summaryZh',
  'summaryEn',
  'publishDate',
];

const REQUIRED_CONTEXT_STRING_FIELDS = [
  'term',
  'type',
  'definitionZh',
  'definitionEn',
  'example',
];

function getArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function showHelp() {
  console.log(`Usage:
  node tools/validate-content.mjs [--strict] [--verbose] [--json] [--root <project-directory>]

Checks:
  - article schema, IDs, publish dates, difficulty format, and 750-900 word length
  - duplicate article IDs and publish dates
  - suspicious question-mark runs and Unicode replacement characters
  - contextual vocabulary schema, Chinese definitions, duplicate terms, and article matching
  - source reference fields and HTTP(S) URLs

Warnings report known content backlog without blocking a normal run. Use --strict to make warnings fail.`);
}

function addIssue(collection, code, location, message) {
  collection.push({ code, location, message });
}

function normalizeComparable(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replaceAll('’', "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function countArticleWords(content) {
  const text = Array.isArray(content) ? content.join(' ') : String(content || '');
  return (text.match(ARTICLE_WORD_PATTERN) || []).length;
}

function scanTextForCorruption(value, location, errors) {
  if (typeof value !== 'string') {
    return;
  }

  if (QUESTION_MARK_RUN_PATTERN.test(value)) {
    addIssue(errors, 'TEXT_QUESTION_MARK_RUN', location, 'contains three or more consecutive question marks');
  }

  if (REPLACEMENT_CHARACTER_PATTERN.test(value)) {
    addIssue(errors, 'TEXT_REPLACEMENT_CHARACTER', location, 'contains a Unicode replacement character');
  }

  if (value.includes('\0')) {
    addIssue(errors, 'TEXT_NULL_CHARACTER', location, 'contains a null character');
  }
}

function validateRequiredString(object, field, location, errors) {
  const value = object?.[field];
  if (typeof value !== 'string' || !value.trim()) {
    addIssue(errors, 'FIELD_REQUIRED', `${location}.${field}`, 'must be a non-empty string');
    return '';
  }

  scanTextForCorruption(value, `${location}.${field}`, errors);
  return value.trim();
}

function isValidCalendarDate(value) {
  if (!PUBLISH_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validateStringArray(value, location, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(errors, 'ARRAY_REQUIRED', location, 'must be a non-empty array');
    return [];
  }

  const seen = new Set();
  value.forEach((item, index) => {
    const itemLocation = `${location}[${index}]`;
    if (typeof item !== 'string' || !item.trim()) {
      addIssue(errors, 'ARRAY_ITEM_INVALID', itemLocation, 'must be a non-empty string');
      return;
    }

    scanTextForCorruption(item, itemLocation, errors);
    const normalized = normalizeComparable(item);
    if (seen.has(normalized)) {
      addIssue(errors, 'ARRAY_ITEM_DUPLICATE', itemLocation, `duplicates "${item}"`);
    }
    seen.add(normalized);
  });

  return value;
}

function validateReferences(article, location, errors, warnings) {
  if (article.references === undefined) {
    return 0;
  }

  if (!Array.isArray(article.references)) {
    addIssue(errors, 'REFERENCES_INVALID', `${location}.references`, 'must be an array when provided');
    return 0;
  }

  if (article.references.length === 0) {
    addIssue(warnings, 'REFERENCES_EMPTY', `${location}.references`, 'is present but empty');
    return 0;
  }

  if (article.references.length < 2 || article.references.length > 4) {
    addIssue(errors, 'REFERENCES_COUNT', `${location}.references`, 'must contain 2-4 sources');
  }

  article.references.forEach((reference, index) => {
    const referenceLocation = `${location}.references[${index}]`;
    if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
      addIssue(errors, 'REFERENCE_INVALID', referenceLocation, 'must be an object');
      return;
    }

    ['title', 'source', 'url', 'usage'].forEach((field) => {
      validateRequiredString(reference, field, referenceLocation, errors);
    });

    if (typeof reference.url === 'string' && reference.url.trim()) {
      try {
        const url = new URL(reference.url);
        if (!['http:', 'https:'].includes(url.protocol)) {
          addIssue(errors, 'REFERENCE_URL_PROTOCOL', `${referenceLocation}.url`, 'must use HTTP or HTTPS');
        }
      } catch {
        addIssue(errors, 'REFERENCE_URL_INVALID', `${referenceLocation}.url`, 'must be a valid URL');
      }
    }
  });

  return article.references.length;
}

function validateArticles(articles, errors, warnings) {
  if (!Array.isArray(articles) || articles.length === 0) {
    addIssue(errors, 'ARTICLES_INVALID', 'window.RAW_ARTICLES', 'must be a non-empty array');
    return { articleMap: new Map(), wordCounts: [], referencesCount: 0 };
  }

  const articleMap = new Map();
  const dateOwners = new Map();
  const wordCounts = [];
  let referencesCount = 0;

  articles.forEach((article, index) => {
    const location = `articles[${index}]`;
    if (!article || typeof article !== 'object' || Array.isArray(article)) {
      addIssue(errors, 'ARTICLE_INVALID', location, 'must be an object');
      return;
    }

    const fields = Object.fromEntries(
      REQUIRED_ARTICLE_STRING_FIELDS.map((field) => [field, validateRequiredString(article, field, location, errors)]),
    );

    if (fields.id && !ARTICLE_ID_PATTERN.test(fields.id)) {
      addIssue(errors, 'ARTICLE_ID_FORMAT', `${location}.id`, 'must use lowercase kebab-case');
    }

    if (fields.id) {
      if (articleMap.has(fields.id)) {
        addIssue(errors, 'ARTICLE_ID_DUPLICATE', `${location}.id`, `duplicates article ID "${fields.id}"`);
      } else {
        articleMap.set(fields.id, article);
      }
    }

    if (fields.publishDate) {
      if (!isValidCalendarDate(fields.publishDate)) {
        addIssue(errors, 'PUBLISH_DATE_INVALID', `${location}.publishDate`, 'must be a real YYYY-MM-DD date');
      } else if (dateOwners.has(fields.publishDate)) {
        addIssue(
          errors,
          'PUBLISH_DATE_DUPLICATE',
          `${location}.publishDate`,
          `duplicates the date used by "${dateOwners.get(fields.publishDate)}"`,
        );
      } else {
        dateOwners.set(fields.publishDate, fields.id || location);
      }
    }

    if (fields.difficulty && !DIFFICULTY_PATTERN.test(fields.difficulty)) {
      addIssue(
        errors,
        'DIFFICULTY_FORMAT',
        `${location}.difficulty`,
        'must match a range such as "IELTS 6.5–7.0" using an en dash',
      );
    }

    if (fields.summaryZh && !HAN_PATTERN.test(fields.summaryZh)) {
      addIssue(errors, 'SUMMARY_ZH_MISSING_CHINESE', `${location}.summaryZh`, 'must contain Chinese characters');
    }

    if (!Array.isArray(article.content) || article.content.length === 0) {
      addIssue(errors, 'ARTICLE_CONTENT_INVALID', `${location}.content`, 'must be a non-empty paragraph array');
    } else {
      article.content.forEach((paragraph, paragraphIndex) => {
        const paragraphLocation = `${location}.content[${paragraphIndex}]`;
        if (typeof paragraph !== 'string' || !paragraph.trim()) {
          addIssue(errors, 'ARTICLE_PARAGRAPH_INVALID', paragraphLocation, 'must be a non-empty string');
          return;
        }
        scanTextForCorruption(paragraph, paragraphLocation, errors);
      });

      const wordCount = countArticleWords(article.content);
      wordCounts.push(wordCount);
      if (wordCount < 750 || wordCount > 900) {
        addIssue(errors, 'ARTICLE_WORD_COUNT', `${location}.content`, `contains ${wordCount} words; expected 750-900`);
      }
    }

    validateStringArray(article.tags, `${location}.tags`, errors);
    validateStringArray(article.coreWords, `${location}.coreWords`, errors);
    referencesCount += validateReferences(article, location, errors, warnings);
  });

  return { articleMap, wordCounts, referencesCount };
}

function validateContextVocabulary(contextVocabulary, articleMap, errors, warnings) {
  if (!contextVocabulary || typeof contextVocabulary !== 'object' || Array.isArray(contextVocabulary)) {
    addIssue(errors, 'CONTEXT_VOCABULARY_INVALID', 'window.ARTICLE_CONTEXT_VOCABULARY', 'must be an object');
    return { packageCount: 0, entryCount: 0 };
  }

  let entryCount = 0;

  Object.entries(contextVocabulary).forEach(([articleId, entries]) => {
    const packageLocation = `contextVocabulary.${articleId}`;
    const article = articleMap.get(articleId);

    if (!article) {
      addIssue(errors, 'CONTEXT_ARTICLE_UNKNOWN', packageLocation, 'does not match an article ID');
    }

    if (!Array.isArray(entries)) {
      addIssue(errors, 'CONTEXT_PACKAGE_INVALID', packageLocation, 'must be an array');
      return;
    }

    entryCount += entries.length;
    if (entries.length < 20 || entries.length > 40) {
      addIssue(errors, 'CONTEXT_PACKAGE_SIZE', packageLocation, `contains ${entries.length} entries; expected 20-40`);
    }

    const seenTerms = new Set();
    const articleText = normalizeComparable(Array.isArray(article?.content) ? article.content.join(' ') : '');

    entries.forEach((entry, index) => {
      const entryLocation = `${packageLocation}[${index}]`;
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        addIssue(errors, 'CONTEXT_ENTRY_INVALID', entryLocation, 'must be an object');
        return;
      }

      const fields = Object.fromEntries(
        REQUIRED_CONTEXT_STRING_FIELDS.map((field) => [field, validateRequiredString(entry, field, entryLocation, errors)]),
      );

      if (fields.type && !['word', 'phrase'].includes(fields.type)) {
        addIssue(errors, 'CONTEXT_TYPE_INVALID', `${entryLocation}.type`, 'must be "word" or "phrase"');
      }

      if (fields.definitionZh && !HAN_PATTERN.test(fields.definitionZh)) {
        addIssue(
          errors,
          'CONTEXT_DEFINITION_ZH_MISSING_CHINESE',
          `${entryLocation}.definitionZh`,
          'must contain Chinese characters',
        );
      }

      if (fields.definitionZh && UNEXPECTED_DEFINITION_SCRIPT_PATTERN.test(fields.definitionZh)) {
        addIssue(
          warnings,
          'CONTEXT_DEFINITION_ZH_UNEXPECTED_SCRIPT',
          `${entryLocation}.definitionZh`,
          'contains Arabic or Cyrillic characters that require editorial review',
        );
      }

      const normalizedTerm = normalizeComparable(fields.term);
      if (normalizedTerm) {
        if (seenTerms.has(normalizedTerm)) {
          addIssue(errors, 'CONTEXT_TERM_DUPLICATE', `${entryLocation}.term`, `duplicates "${fields.term}"`);
        }
        seenTerms.add(normalizedTerm);

        if (article && !articleText.includes(normalizedTerm)) {
          addIssue(
            warnings,
            'CONTEXT_TERM_NOT_IN_ARTICLE',
            `${entryLocation}.term`,
            `"${fields.term}" does not appear verbatim in the article body`,
          );
        }
      }
    });
  });

  articleMap.forEach((_article, articleId) => {
    if (!Object.hasOwn(contextVocabulary, articleId)) {
      addIssue(
        warnings,
        'CONTEXT_PACKAGE_MISSING',
        `articles.${articleId}`,
        'does not have an article-level contextual vocabulary package',
      );
    }
  });

  return { packageCount: Object.keys(contextVocabulary).length, entryCount };
}

async function loadProjectData(projectRoot = DEFAULT_PROJECT_ROOT) {
  const resolvedRoot = path.resolve(projectRoot);
  const articlePath = path.join(resolvedRoot, 'articles.js');
  const contextPath = path.join(resolvedRoot, 'context-vocabulary.js');
  const sandbox = { window: {} };

  vm.runInNewContext(await readFile(articlePath, 'utf8'), sandbox, { filename: articlePath });
  vm.runInNewContext(await readFile(contextPath, 'utf8'), sandbox, { filename: contextPath });

  return {
    articles: sandbox.window.RAW_ARTICLES,
    contextVocabulary: sandbox.window.ARTICLE_CONTEXT_VOCABULARY,
  };
}

function validateProjectData({ articles, contextVocabulary }) {
  const errors = [];
  const warnings = [];
  const articleResult = validateArticles(articles, errors, warnings);
  const contextResult = validateContextVocabulary(
    contextVocabulary,
    articleResult.articleMap,
    errors,
    warnings,
  );
  const wordCounts = articleResult.wordCounts;

  return {
    errors,
    warnings,
    stats: {
      articles: Array.isArray(articles) ? articles.length : 0,
      minWords: wordCounts.length ? Math.min(...wordCounts) : 0,
      maxWords: wordCounts.length ? Math.max(...wordCounts) : 0,
      references: articleResult.referencesCount,
      contextPackages: contextResult.packageCount,
      contextEntries: contextResult.entryCount,
    },
  };
}

function groupIssues(issues) {
  return issues.reduce((groups, issue) => {
    const group = groups.get(issue.code) || { count: 0, samples: [] };
    group.count += 1;
    if (group.samples.length < 3) {
      group.samples.push(issue);
    }
    groups.set(issue.code, group);
    return groups;
  }, new Map());
}

function printIssueGroups(label, issues, verbose) {
  if (!issues.length) {
    return;
  }

  console.log(`${label}: ${issues.length}`);
  groupIssues(issues).forEach((group, code) => {
    console.log(`  - ${code}: ${group.count}`);
    if (verbose) {
      group.samples.forEach((issue) => {
        console.log(`      ${issue.location}: ${issue.message}`);
      });
    }
  });
}

function printReport(result, { json = false, strict = false, verbose = false } = {}) {
  if (json) {
    console.log(JSON.stringify({ ...result, strict }, null, 2));
    return;
  }

  const { stats, errors, warnings } = result;
  console.log(`Articles: ${stats.articles} (${stats.minWords}-${stats.maxWords} words)`);
  console.log(`Reference entries: ${stats.references}`);
  console.log(`Context vocabulary: ${stats.contextPackages} packages / ${stats.contextEntries} entries`);
  printIssueGroups('Errors', errors, true);
  printIssueGroups('Warnings', warnings, verbose);

  if (errors.length === 0 && (!strict || warnings.length === 0)) {
    console.log(warnings.length ? 'Content validation passed with warnings.' : 'Content validation passed.');
    return;
  }

  console.log(strict && errors.length === 0
    ? 'Strict content validation failed because warnings are present.'
    : 'Content validation failed.');
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }

  const projectRoot = getArgument('--root') || DEFAULT_PROJECT_ROOT;
  const options = {
    json: process.argv.includes('--json'),
    strict: process.argv.includes('--strict'),
    verbose: process.argv.includes('--verbose'),
  };
  const data = await loadProjectData(projectRoot);
  const result = validateProjectData(data);
  printReport(result, options);

  if (result.errors.length > 0 || (options.strict && result.warnings.length > 0)) {
    process.exitCode = 1;
  }
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (entryPath === import.meta.url) {
  main().catch((error) => {
    console.error(`Content validation could not run: ${error.message}`);
    process.exitCode = 1;
  });
}

export {
  countArticleWords,
  loadProjectData,
  validateProjectData,
};
