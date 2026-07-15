const STORAGE_KEY = 'ielts-knowledge-reader.vocab.v1';
const ALLOWED_FAMILIARITY = ['陌生', '认识', '掌握'];

function normalizeWord(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/gi, '')
    .replace(/’/g, "'");
}

const WORD_TOKEN_PATTERN = /[A-Za-zÀ-ÿ]+(?:['’][A-Za-zÀ-ÿ]+)?/g;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未知日期';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未知时间';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const seconds = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function splitParagraphIntoSentences(paragraph) {
  const parts = String(paragraph)
    .trim()
    .match(/[^.!?]+[.!?]?/g);
  return parts && parts.length ? parts.map((part) => part.trim()).filter(Boolean) : [String(paragraph).trim()];
}

function tokenizeSentence(sentence, article) {
  const tokens = String(sentence).match(/[A-Za-zÀ-ÿ]+(?:['’][A-Za-zÀ-ÿ]+)?|[0-9]+(?:\.[0-9]+)?|[\s]+|[^A-Za-z0-9À-ÿ\s]+/g) || [sentence];

  return tokens
    .map((token) => {
      if (/^[A-Za-zÀ-ÿ]+(?:['’][A-Za-zÀ-ÿ]+)?$/.test(token)) {
        const normalized = normalizeWord(token);
        const isCore = article.coreWordSet.has(normalized);
        return `<button type="button" class="word-token${isCore ? ' is-core' : ''}" data-action="lookup-word" data-word="${escapeAttr(normalized)}" data-article-id="${escapeAttr(article.id)}" data-sentence="${escapeAttr(sentence.trim())}">${escapeHtml(token)}</button>`;
      }

      return escapeHtml(token);
    })
    .join('');
}

function renderParagraph(paragraph, article) {
  const sentences = splitParagraphIntoSentences(paragraph);
  return sentences.map((sentence) => tokenizeSentence(sentence, article)).join(' ');
}

function createTagPills(tags, className = 'tag-chip') {
  return tags
    .map((tag) => `<span class="${className}">${escapeHtml(tag)}</span>`)
    .join('');
}

function createCoreWordPills(coreWords) {
  return coreWords
    .slice(0, 8)
    .map((word) => `<span class="meta-chip">${escapeHtml(word)}</span>`)
    .join('');
}

function countArticleWords(articleContent) {
  const text = Array.isArray(articleContent) ? articleContent.join(' ') : String(articleContent || '');
  const matches = text.match(WORD_TOKEN_PATTERN);
  return matches ? matches.length : 0;
}

function getEstimatedReadingMinutes(wordCount) {
  return Math.ceil(Math.max(0, Number(wordCount) || 0) / 160);
}

function formatWordCount(wordCount) {
  return `约 ${Number(wordCount) || 0} words`;
}

function formatEstimatedReadingTime(minutes) {
  return `建议阅读 ${Number(minutes) || 0} 分钟`;
}

const PRODUCT_DESCRIPTION = '每天一篇原创 IELTS-style 英文知识阅读，支持点词释义、生词本、阅读记录和读后感。';
const QUOTE_SPLASH_QUOTE = 'Learning begins when attention becomes quiet.';
const QUOTE_SPLASH_DELAY_MS = 10000;

function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDateString() {
  return toLocalDateKey();
}

function isArticlePublished(article, today = getTodayDateString()) {
  if (!article || !article.publishDate) {
    return true;
  }

  return String(today) >= String(article.publishDate);
}

function getPublishedArticles(today = getTodayDateString()) {
  return ARTICLES.filter((article) => isArticlePublished(article, today)).sort((a, b) => String(b.publishDate || '').localeCompare(String(a.publishDate || '')));
}


const RAW_ARTICLES = window.RAW_ARTICLES || [];

const DICTIONARY_ENTRIES = window.DICTIONARY_ENTRIES || [];

const EXTRA_DICTIONARY_BASE_ENTRIES = window.EXTRA_DICTIONARY_BASE_ENTRIES || [];

function createDictionaryEntry(meaningZh, meaningEn, example) {
  return {
    meaningZh,
    meaningEn,
    example,
  };
}

function addDictionaryEntry(dictionary, word, entry) {
  const normalized = normalizeWord(word);
  if (!normalized || dictionary[normalized]) {
    return;
  }

  dictionary[normalized] = entry;
}

function stripDoubleConsonant(word) {
  if (!word || word.length < 3) {
    return word;
  }

  const lastChar = word[word.length - 1];
  const previousChar = word[word.length - 2];
  if (lastChar === previousChar && !'aeiou'.includes(lastChar)) {
    return word.slice(0, -1);
  }

  return word;
}

function pluralizeNoun(word) {
  if (/[^aeiou]y$/i.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }

  if (/(s|x|z|ch|sh)$/i.test(word)) {
    return `${word}es`;
  }

  return `${word}s`;
}

function getVerbForms(word) {
  const normalized = normalizeWord(word);
  const stemForPast = normalized.endsWith('e') ? normalized.slice(0, -1) : normalized;
  const stemForGerund = normalized.endsWith('e') && !/(ee|ye|oe)$/i.test(normalized)
    ? normalized.slice(0, -1)
    : normalized;

  const thirdPerson = /[^aeiou]y$/i.test(normalized)
    ? `${normalized.slice(0, -1)}ies`
    : /(s|x|z|ch|sh|o)$/i.test(normalized)
      ? `${normalized}es`
      : `${normalized}s`;

  const pastTense = /[^aeiou]y$/i.test(normalized)
    ? `${normalized.slice(0, -1)}ied`
    : `${stemForPast}ed`;

  const gerund = /ie$/i.test(normalized)
    ? `${normalized.slice(0, -2)}ying`
    : /[^aeiou]e$/i.test(normalized) && !/(ee|ye|oe)$/i.test(normalized)
      ? `${stemForGerund}ing`
      : `${normalized}ing`;

  return {
    thirdPerson,
    pastTense,
    gerund,
  };
}

function buildMockDictionary() {
  const dictionary = Object.create(null);

  DICTIONARY_ENTRIES.forEach(([word, meaningZh, meaningEn, example]) => {
    addDictionaryEntry(dictionary, word, createDictionaryEntry(meaningZh, meaningEn, example));
  });

  EXTRA_DICTIONARY_BASE_ENTRIES.forEach((item) => {
    const [word, meaningZh, meaningEn, example, partOfSpeech, generateForms = true] = Array.isArray(item)
      ? item
      : [item.word, item.meaningZh, item.meaningEn, item.example, item.partOfSpeech, item.generateForms];
    const entry = createDictionaryEntry(meaningZh, meaningEn, example);
    addDictionaryEntry(dictionary, word, entry);

    if (generateForms === false) {
      return;
    }

    if (partOfSpeech === 'verb') {
      const forms = getVerbForms(word);
      Object.values(forms).forEach((form) => addDictionaryEntry(dictionary, form, entry));
      return;
    }

    if (partOfSpeech === 'noun') {
      addDictionaryEntry(dictionary, pluralizeNoun(word), entry);
    }
  });

  return dictionary;
}

const LEMMA_EXCEPTIONS = new Map([
  ['cities', 'city'],
  ['species', 'species'],
  ['resources', 'resource'],
  ['buildings', 'building'],
  ['redesigned', 'redesign'],
  ['adapted', 'adapt'],
  ['used', 'use'],
  ['using', 'use'],
  ['hotter', 'hot'],
  ['larger', 'large'],
  ['biggest', 'big'],
  ['fungi', 'fungus'],
  ['synchronization', 'synchronize'],
  ['synchronisation', 'synchronize'],
  ['facades', 'facade'],
  ['crises', 'crisis'],
  ['heatwaves', 'heatwave'],
  ['neighbourhoods', 'neighbourhood'],
  ['shelters', 'shelter'],
  ['coatings', 'coating'],
  ['routes', 'route'],
  ['schools', 'school'],
  ['clinics', 'clinic'],
  ['markets', 'market'],
  ['drivers', 'driver'],
  ['workers', 'worker'],
  ['alerts', 'alert'],
  ['leaves', 'leaf'],
]);

function getDictionaryCandidates(word) {
  const normalized = normalizeWord(word);
  const candidates = [];
  const addCandidate = (candidate) => {
    if (candidate && !candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  };

  addCandidate(normalized);
  addCandidate(LEMMA_EXCEPTIONS.get(normalized));

  if (normalized.endsWith('ies') && normalized.length > 4) {
    addCandidate(`${normalized.slice(0, -3)}y`);
  }

  if (normalized.endsWith('ves') && normalized.length > 4) {
    addCandidate(`${normalized.slice(0, -3)}f`);
    addCandidate(`${normalized.slice(0, -3)}fe`);
  }

  if (normalized.endsWith('es') && /(ses|xes|zes|ches|shes)$/i.test(normalized)) {
    addCandidate(normalized.slice(0, -2));
  }

  if (normalized.endsWith('s') && normalized.length > 3 && !normalized.endsWith('ss')) {
    addCandidate(normalized.slice(0, -1));
  }

  if (normalized.endsWith('ied') && normalized.length > 4) {
    addCandidate(`${normalized.slice(0, -3)}y`);
  }

  if (normalized.endsWith('ed') && normalized.length > 3) {
    const stem = normalized.slice(0, -2);
    addCandidate(stem);
    addCandidate(`${stem}e`);
    addCandidate(stripDoubleConsonant(stem));
  }

  if (normalized.endsWith('ing') && normalized.length > 4) {
    const stem = normalized.slice(0, -3);
    addCandidate(stem);
    addCandidate(`${stem}e`);
    addCandidate(stripDoubleConsonant(stem));
  }

  if (normalized.endsWith('er') && normalized.length > 4) {
    const stem = normalized.slice(0, -2);
    addCandidate(stem);
    addCandidate(`${stem}e`);
    addCandidate(stripDoubleConsonant(stem));
  }

  if (normalized.endsWith('est') && normalized.length > 5) {
    const stem = normalized.slice(0, -3);
    addCandidate(stem);
    addCandidate(`${stem}e`);
    addCandidate(stripDoubleConsonant(stem));
  }

  return candidates;
}

function findDictionaryEntry(word) {
  const candidates = normalizeWordCandidates(word);
  for (const candidate of candidates) {
    if (MOCK_DICTIONARY[candidate]) {
      return {
        matchedWord: candidate,
        entry: MOCK_DICTIONARY[candidate],
      };
    }
  }

  return null;
}

function normalizePhraseForLookup(value) {
  return String(value || '')
    .match(WORD_TOKEN_PATTERN)
    ?.map((part) => normalizeWord(part))
    .filter(Boolean)
    .join(' ') || '';
}

function getArticleContextVocabulary(articleId) {
  return ARTICLE_CONTEXT_VOCABULARY[articleId] || [];
}

function createLookupResult({ entry = null, matchedWord, sourceType, sourceLabel, isFallback = false }) {
  return {
    entry,
    matchedWord,
    sourceType,
    sourceLabel,
    isFallback,
  };
}

function lookupWordWithContext(articleId, word, sentence) {
  const articleVocabulary = getArticleContextVocabulary(articleId);
  const normalizedWord = normalizeWord(word);
  const wordCandidates = [normalizedWord, ...getDictionaryCandidates(word)].filter(Boolean);
  const candidateSet = new Set(wordCandidates);
  const normalizedSentence = normalizePhraseForLookup(sentence);

  const phraseMatch = articleVocabulary
    .filter((entry) => entry.type === 'phrase')
    .map((entry) => ({
      ...entry,
      normalizedTerm: normalizePhraseForLookup(entry.term),
    }))
    .filter((entry) => entry.normalizedTerm && normalizedSentence.includes(entry.normalizedTerm))
    .filter((entry) => entry.normalizedTerm.split(' ').some((token) => candidateSet.has(token)))
    .sort((left, right) => right.normalizedTerm.split(' ').length - left.normalizedTerm.split(' ').length)[0];

  if (phraseMatch) {
    return createLookupResult({
      entry: createDictionaryEntry(phraseMatch.definitionZh, phraseMatch.definitionEn, phraseMatch.example),
      matchedWord: phraseMatch.term,
      sourceType: 'article-context-phrase',
      sourceLabel: 'Article context',
    });
  }

  const wordMatch = articleVocabulary.find((entry) => {
    if (entry.type === 'phrase') {
      return false;
    }

    const normalizedTerm = normalizeWord(entry.term);
    if (!normalizedTerm) {
      return false;
    }

    if (candidateSet.has(normalizedTerm)) {
      return true;
    }

    return getDictionaryCandidates(entry.term).some((candidate) => candidateSet.has(candidate));
  });

  if (wordMatch) {
    return createLookupResult({
      entry: createDictionaryEntry(wordMatch.definitionZh, wordMatch.definitionEn, wordMatch.example),
      matchedWord: wordMatch.term,
      sourceType: 'article-context-word',
      sourceLabel: 'Article context',
    });
  }

  const globalMatch = findDictionaryEntry(word);
  if (globalMatch) {
    return createLookupResult({
      entry: globalMatch.entry,
      matchedWord: globalMatch.matchedWord,
      sourceType: 'local-dictionary',
      sourceLabel: 'Local dictionary',
    });
  }

  return createLookupResult({
    matchedWord: normalizedWord || word,
    sourceType: 'fallback',
    sourceLabel: 'Not found',
    isFallback: true,
  });
}

const MOCK_DICTIONARY = buildMockDictionary();

const ARTICLES = RAW_ARTICLES.map((article) => ({
  ...article,
  coreWordSet: new Set(article.coreWords.map((word) => normalizeWord(word))),
  wordCount: countArticleWords(article.content),
  estimatedMinutes: getEstimatedReadingMinutes(countArticleWords(article.content)),
}));

const ARTICLE_MAP = new Map(ARTICLES.map((article) => [article.id, article]));

const ARTICLE_CONTEXT_VOCABULARY = window.ARTICLE_CONTEXT_VOCABULARY || {};

const state = {
  currentView: 'today',
  navView: 'today',
  returnView: 'today',
  activeArticleId: null,
  activeTag: '全部',
  readingRecords: [],
  vocabulary: [],
  currentDefinition: null,
  currentWordContext: null,
  timerSeconds: 0,
  timerId: null,
  quoteSplashEl: null,
  quoteSplashTimerId: null,
};

const dom = {};

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', () => {
  stopReadingTimer();
  clearQuoteSplashTimer();
});

function init() {
  cacheDom();
  state.readingRecords = loadReadingRecords();
  state.vocabulary = loadVocabulary();
  bindEvents();
  renderAllViews();
  showView('today');
  showQuoteSplash();
}

function cacheDom() {
  dom.pageTitle = document.getElementById('pageTitle');
  dom.topbarMeta = document.getElementById('topbarMeta');
  dom.readerBackButton = document.getElementById('readerBackButton');
  dom.todayView = document.getElementById('todayView');
  dom.libraryView = document.getElementById('libraryView');
  dom.librarySectionTitle = document.getElementById('librarySectionTitle');
  dom.vocabView = document.getElementById('vocabView');
  dom.readerView = document.getElementById('readerView');
  dom.todayArticleCard = document.getElementById('todayArticleCard');
  dom.tagFilterBar = document.getElementById('tagFilterBar');
  dom.libraryList = document.getElementById('libraryList');
  dom.vocabStats = document.getElementById('vocabStats');
  dom.vocabList = document.getElementById('vocabList');
  dom.readerArticleTitle = document.getElementById('readerArticleTitle');
  dom.readerSubtitle = document.getElementById('readerSubtitle');
  dom.readerMetaChips = document.getElementById('readerMetaChips');
  dom.readingTimer = document.getElementById('readingTimer');
  dom.readerContent = document.getElementById('readerContent');
  dom.definitionModal = document.getElementById('definitionModal');
  dom.definitionWord = document.getElementById('definitionWord');
  dom.definitionLookupHint = document.getElementById('definitionLookupHint');
  dom.definitionZh = document.getElementById('definitionZh');
  dom.definitionEn = document.getElementById('definitionEn');
  dom.definitionExample = document.getElementById('definitionExample');
  dom.definitionSentence = document.getElementById('definitionSentence');
  dom.saveWordButton = document.getElementById('saveWordButton');
  dom.toast = document.getElementById('toast');
  dom.navButtons = Array.from(document.querySelectorAll('.nav-item[data-nav]'));
}

function bindEvents() {
  dom.readerBackButton.addEventListener('click', () => {
    showView(state.returnView || 'today');
  });

  dom.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextView = button.dataset.nav;
      if (nextView) {
        showView(nextView);
      }
    });
  });

  dom.todayArticleCard.addEventListener('click', handleViewAction);
  dom.libraryList.addEventListener('click', handleViewAction);
  dom.vocabList.addEventListener('click', handleVocabActionV2);
  dom.vocabList.addEventListener('change', handleVocabChangeV2);
  dom.tagFilterBar.addEventListener('click', handleTagFilter);
  dom.readerContent.addEventListener('click', handleReaderClickActionV2);
  dom.definitionModal.addEventListener('click', handleModalClick);
  dom.saveWordButton.addEventListener('click', handleSaveCurrentWordV2);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dom.definitionModal.classList.contains('is-hidden')) {
      closeDefinitionModal();
    }
  });
}

function renderAllViews() {
  renderTodayView();
  renderLibraryView();
  renderVocabView();
  renderReaderView();
}

function showView(view) {
  if (state.currentView === 'reader' && view !== 'reader') {
    stopReadingTimer();
  }

  state.currentView = view;

  if (view !== 'reader') {
    state.navView = view;
  }

  dom.todayView.classList.toggle('is-active', view === 'today');
  dom.libraryView.classList.toggle('is-active', view === 'library');
  dom.vocabView.classList.toggle('is-active', view === 'vocab');
  dom.readerView.classList.toggle('is-active', view === 'reader');
  dom.readerBackButton.classList.toggle('is-hidden', view !== 'reader');

  const activeNav = view === 'reader' ? state.navView : view;
  dom.navButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.nav === activeNav);
  });

  updateTopbar(view);
  updateDocumentTitle(view);

  if (view === 'today') {
    dom.todayView.scrollIntoView({ block: 'start' });
  } else if (view === 'library') {
    dom.libraryView.scrollIntoView({ block: 'start' });
  } else if (view === 'vocab') {
    dom.vocabView.scrollIntoView({ block: 'start' });
  } else if (view === 'reader') {
    dom.readerView.scrollIntoView({ block: 'start' });
  }
}

function clearQuoteSplashTimer() {
  if (state.quoteSplashTimerId) {
    window.clearTimeout(state.quoteSplashTimerId);
    state.quoteSplashTimerId = null;
  }
}

function hideQuoteSplash() {
  clearQuoteSplashTimer();
  document.body.classList.remove('has-quote-splash');

  if (state.quoteSplashEl) {
    state.quoteSplashEl.remove();
    state.quoteSplashEl = null;
  }
}

function hideQuoteSplashAndShowToday() {
  hideQuoteSplash();
  showView('today');
}

function showQuoteSplash() {
  hideQuoteSplash();

  const splash = document.createElement('section');
  splash.className = 'quote-splash';
  splash.setAttribute('role', 'dialog');
  splash.setAttribute('aria-modal', 'true');
  splash.innerHTML = `
    <div class="hero-card quote-splash-panel">
      <p class="section-kicker">IELTS Knowledge Reader</p>
      <h1 class="quote-splash-quote">${escapeHtml(QUOTE_SPLASH_QUOTE)}</h1>
      <p class="card-note">${escapeHtml(PRODUCT_DESCRIPTION)}</p>
      <p class="card-note">约 10 秒后自动进入今日推荐，也可以直接 Skip。</p>
      <div class="cta-row quote-splash-actions">
        <button class="primary-button" type="button" data-action="skip-quote-splash">Skip</button>
      </div>
    </div>
  `;
  splash.addEventListener('click', handleViewAction);

  document.body.appendChild(splash);
  document.body.classList.add('has-quote-splash');
  state.quoteSplashEl = splash;
  state.quoteSplashTimerId = window.setTimeout(hideQuoteSplashAndShowToday, QUOTE_SPLASH_DELAY_MS);
}

function updateTopbar(view) {
  if (view === 'today') {
    dom.pageTitle.textContent = '今日推荐';
    dom.topbarMeta.textContent = '原创模拟文章';
    return;
  }

  if (view === 'library') {
    dom.pageTitle.textContent = '文章库';
    dom.topbarMeta.textContent = '按标签筛选';
    return;
  }

  if (view === 'vocab') {
    dom.pageTitle.textContent = '生词本';
    dom.topbarMeta.textContent = '本地存储';
    return;
  }

  if (view === 'reader') {
    const article = ARTICLE_MAP.get(state.activeArticleId);
    dom.pageTitle.textContent = '阅读页';
    dom.topbarMeta.textContent = article ? article.difficulty : '移动端阅读';
  }
}

function updateDocumentTitle(view) {
  if (view === 'reader') {
    const article = ARTICLE_MAP.get(state.activeArticleId);
    document.title = article ? `${article.title} - IELTS Knowledge Reader` : 'IELTS Knowledge Reader';
    return;
  }

  const titles = {
    today: '今日推荐',
    library: '文章库',
    vocab: '生词本',
  };

  document.title = `${titles[view] || 'IELTS Knowledge Reader'} - IELTS Knowledge Reader`;
}

function renderTodayView() {
  const article = getTodayArticle();
  if (!article) {
    dom.todayArticleCard.innerHTML = '<div class="empty-state"><p class="empty-title">暂无今日文章</p><p class="empty-text">请稍后再试。</p></div>';
    return;
  }

  const readingRecord = getReadingRecord(article.id);
  const completed = Boolean(readingRecord);

  dom.todayArticleCard.innerHTML = `
    <div class="hero-header">
      <div>
        <p class="section-kicker">今日推荐</p>
        <h3 class="hero-title">${escapeHtml(article.title)}</h3>
      </div>
      <div class="meta-chips">
        <span class="meta-chip is-highlight">${escapeHtml(article.difficulty)}</span>
        <span class="meta-chip">${escapeHtml(article.sourceType)}</span>
      </div>
    </div>
    <p class="hero-subtitle">${escapeHtml(article.subtitle)}</p>
    <p class="card-note">${escapeHtml(PRODUCT_DESCRIPTION)}</p>
    <div class="meta-chips">
      <span class="meta-chip">${escapeHtml(formatWordCount(article.wordCount))}</span>
      <span class="meta-chip">${escapeHtml(formatEstimatedReadingTime(article.estimatedMinutes))}</span>
      <span class="meta-chip${completed ? ' is-highlight' : ''}">${completed ? '今日已完成' : '今日未完成'}</span>
    </div>
    <div class="tag-row">${createTagPills(article.tags)}</div>
    <div class="summary-grid">
      <div class="summary-block">
        <p class="summary-title">中文摘要</p>
        <p>${escapeHtml(article.summaryZh)}</p>
      </div>
      <div class="summary-block">
        <p class="summary-title">English Summary</p>
        <p>${escapeHtml(article.summaryEn)}</p>
      </div>
    </div>
    <div class="summary-block">
      <p class="summary-title">核心词汇</p>
      <div class="tag-row">${createCoreWordPills(article.coreWords)}</div>
    </div>
    <div class="cta-row">
      <button class="primary-button" type="button" data-action="open-article" data-article-id="${escapeAttr(article.id)}">开始阅读</button>
      <span class="card-note">发布日期：${formatDate(article.publishDate)}</span>
    </div>
  `;
}

function renderLibraryView() {
  renderTagFilters();

  const articles = getFilteredArticles();
  dom.librarySectionTitle.textContent = state.activeTag === '全部'
    ? `文章库｜共 ${articles.length} 篇`
    : `当前筛选｜${articles.length} 篇`;

  if (!articles.length) {
    dom.libraryList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">没有匹配的文章</p>
        <p class="empty-text">切换标签筛选，或者点“全部”查看完整文章库。</p>
        <div class="cta-row empty-actions">
          <button class="secondary-button" type="button" data-action="reset-tag-filter">清除筛选</button>
        </div>
      </div>
    `;
    return;
  }

  dom.libraryList.innerHTML = articles
    .map((article) => `
      <article class="card">
        <div class="card-meta-row">
          <div>
            <h3 class="card-title">${escapeHtml(article.title)}</h3>
            <p class="card-subtitle">${escapeHtml(article.subtitle)}</p>
            </div>
            <span class="meta-chip is-highlight">${escapeHtml(article.difficulty)}</span>
          </div>
          <div class="tag-row">${createTagPills(article.tags)}</div>
          <div class="summary-block">
            <p class="summary-title">English Summary</p>
            <p>${escapeHtml(article.summaryEn)}</p>
          </div>
          <div class="meta-chips">
            <span class="meta-chip">${escapeHtml(formatWordCount(article.wordCount))}</span>
            <span class="meta-chip">${escapeHtml(formatEstimatedReadingTime(article.estimatedMinutes))}</span>
            <span class="meta-chip${getReadingRecord(article.id) ? ' is-highlight' : ''}">${getReadingRecord(article.id) ? '已读' : '未读'}</span>
          </div>
          <div class="card-footer">
            <span class="card-note">${escapeHtml(article.sourceType)} · ${formatDate(article.publishDate)}</span>
            <button class="secondary-button" type="button" data-action="open-article" data-article-id="${escapeAttr(article.id)}">阅读文章</button>
          </div>
        </article>
    `)
    .join('');
}

function renderTagFilters() {
  const tagCounts = new Map();

  ARTICLES.forEach((article) => {
    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const tags = ['全部', ...Array.from(tagCounts.keys()).sort((a, b) => a.localeCompare(b))];

  dom.tagFilterBar.innerHTML = tags
    .map((tag) => {
      const label = tag === '全部' ? '全部' : `${tag} (${tagCounts.get(tag) || 0})`;
      const activeClass = tag === state.activeTag ? ' is-active' : '';
      return `<button type="button" class="filter-chip${activeClass}" data-action="filter-tag" data-tag="${escapeAttr(tag)}">${escapeHtml(label)}</button>`;
    })
    .join('');
}

function renderVocabView() {
  const vocabulary = getSortedVocabulary();
  const total = vocabulary.length;
  const unfamiliar = vocabulary.filter((item) => item.familiarity === '陌生').length;
  const mastered = vocabulary.filter((item) => item.familiarity === '掌握').length;

  dom.vocabStats.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <p class="stat-value">${total}</p>
        <p class="stat-label">总数</p>
      </div>
      <div class="stat-item">
        <p class="stat-value">${unfamiliar}</p>
        <p class="stat-label">陌生</p>
      </div>
      <div class="stat-item">
        <p class="stat-value">${mastered}</p>
        <p class="stat-label">掌握</p>
      </div>
    </div>
    <p class="card-note">熟悉程度支持：陌生 / 认识 / 掌握</p>
  `;

  if (!vocabulary.length) {
    dom.vocabList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">还没有生词</p>
        <p class="empty-text">去阅读一篇文章并点击单词，加入生词本后会保存在本地。</p>
        <div class="cta-row empty-actions">
          <button class="primary-button" type="button" data-action="go-library">去文章库</button>
        </div>
      </div>
    `;
    return;
  }

  dom.vocabList.innerHTML = vocabulary
    .map((item) => `
      <article class="vocab-item">
        <div class="card-meta-row">
          <div>
            <p class="vocab-word">${escapeHtml(item.word)}</p>
            <p class="vocab-meaning"><strong>中文：</strong>${escapeHtml(item.meaningZh)}</p>
            <p class="vocab-meaning"><strong>English:</strong> ${escapeHtml(item.meaningEn)}</p>
          </div>
          <span class="meta-chip">${escapeHtml(item.familiarity)}</span>
        </div>
        <p class="vocab-meta"><strong>例句：</strong>${escapeHtml(item.example)}</p>
        <p class="vocab-meta"><strong>来源文章：</strong>${escapeHtml(item.sourceArticleTitle)}</p>
        <p class="vocab-meta"><strong>原文句子：</strong>${escapeHtml(item.sourceSentence)}</p>
        <p class="vocab-meta"><strong>添加时间：</strong>${formatDateTime(item.addedAt)}</p>
        <div class="vocab-actions">
          <select class="familiarity-select" data-action="set-familiarity" data-word="${escapeAttr(item.word)}" aria-label="设置熟悉程度">
            ${ALLOWED_FAMILIARITY.map((level) => `<option value="${escapeAttr(level)}"${level === item.familiarity ? ' selected' : ''}>${escapeHtml(level)}</option>`).join('')}
          </select>
          <button class="danger-button" type="button" data-action="delete-word" data-word="${escapeAttr(item.word)}">删除</button>
        </div>
      </article>
    `)
    .join('');
}

function renderReaderView() {
  const article = ARTICLE_MAP.get(state.activeArticleId);
  if (!article) {
    dom.readerArticleTitle.textContent = '';
    dom.readerSubtitle.textContent = '';
    dom.readerMetaChips.innerHTML = '';
    dom.readerContent.innerHTML = '';
    dom.readingTimer.textContent = '00:00';
    return;
  }

  dom.readerArticleTitle.textContent = article.title;
  dom.readerSubtitle.textContent = article.subtitle;
  const readingRecord = getReadingRecord(article.id);
  const completed = Boolean(readingRecord);
  dom.readerMetaChips.innerHTML = `
    <span class="meta-chip is-highlight">${escapeHtml(article.difficulty)}</span>
    <span class="meta-chip">${escapeHtml(article.sourceType)}</span>
    <span class="meta-chip">${escapeHtml(formatWordCount(article.wordCount))}</span>
    <span class="meta-chip">${escapeHtml(formatEstimatedReadingTime(article.estimatedMinutes))}</span>
    <span class="meta-chip${completed ? ' is-highlight' : ''}">${completed ? '已完成阅读' : '未完成阅读'}</span>
    ${createTagPills(article.tags)}
  `;

  dom.readerContent.innerHTML = article.content
    .map((paragraph) => `<p class="reading-paragraph">${renderParagraph(paragraph, article)}</p>`)
    .join('')
    + renderArticleReferences(article)
    + renderReadingCompletionBlock(article, readingRecord);

  dom.readingTimer.textContent = formatDuration(state.timerSeconds);
}

function renderArticleReferences(article) {
  const references = Array.isArray(article.references)
    ? article.references.filter((reference) => reference && typeof reference === 'object')
    : [];

  if (!references.length) {
    return '';
  }

  return `
    <section class="summary-block article-references" aria-label="Article references">
      <div>
        <p class="summary-title">Sources and References</p>
        <p class="card-note references-note">These sources informed the topic, background, or terminology. The article is original and not a translation or close paraphrase.</p>
      </div>
      <div class="reference-list">
        ${references
          .map((reference) => {
            const title = String(reference.title || 'Untitled reference');
            const source = String(reference.source || 'Unknown source');
            const usage = String(reference.usage || 'Used as background reference.');
            const url = String(reference.url || '').trim();
            return `
              <article class="reference-item">
                <div class="reference-head">
                  <h3 class="reference-title">${escapeHtml(title)}</h3>
                  <span class="reference-source">${escapeHtml(source)}</span>
                </div>
                <p class="reference-usage">${escapeHtml(usage)}</p>
                ${url ? `<a class="reference-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">Open source</a>` : ''}
              </article>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function getTodayArticle(today = getTodayDateString()) {
  const publishedArticles = getPublishedArticles(today);
  return publishedArticles.find((article) => article.publishDate === today) || publishedArticles[0] || null;
}

function getFilteredArticles() {
  const sorted = getPublishedArticles();
  if (state.activeTag === '全部') {
    return sorted;
  }
  return sorted.filter((article) => article.tags.includes(state.activeTag));
}

function getSortedVocabulary() {
  return [...state.vocabulary].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}

function getDictionaryEntry(word) {
  return findDictionaryEntry(word)?.entry || null;
}

function getReadingRecord(articleId) {
  return state.readingRecords.find((item) => item.articleId === articleId) || null;
}

function loadReadingRecords() {
  try {
    const raw = localStorage.getItem('ielts_reader_reading_records');
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeReadingRecord(item))
      .filter(Boolean)
      .reduce((accumulator, item) => {
        const existingIndex = accumulator.findIndex((entry) => entry.articleId === item.articleId);
        if (existingIndex >= 0) {
          accumulator[existingIndex] = item;
          return accumulator;
        }
        accumulator.push(item);
        return accumulator;
      }, []);
  } catch {
    return [];
  }
}

function normalizeReadingRecord(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const articleId = String(item.articleId || '');
  if (!articleId) {
    return null;
  }

  const article = ARTICLE_MAP.get(articleId);
  const completedAt = item.completedAt ? String(item.completedAt) : new Date().toISOString();
  const date = item.date ? String(item.date) : toLocalDateKey(new Date(completedAt));
  const wordCount = Number.isFinite(Number(item.wordCount)) && Number(item.wordCount) > 0
    ? Number(item.wordCount)
    : article?.wordCount || 0;
  const estimatedMinutes = Number.isFinite(Number(item.estimatedMinutes)) && Number(item.estimatedMinutes) >= 0
    ? Number(item.estimatedMinutes)
    : getEstimatedReadingMinutes(wordCount);

  return {
    articleId,
    title: String(item.title || article?.title || '未知文章'),
    completedAt,
    date,
    durationSeconds: Math.max(0, Math.floor(Number(item.durationSeconds) || 0)),
    wordCount,
    estimatedMinutes,
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag)) : [...(article?.tags || [])],
    difficulty: String(item.difficulty || article?.difficulty || ''),
    reflection: String(item.reflection || ''),
  };
}

function persistReadingRecords() {
  try {
    localStorage.setItem('ielts_reader_reading_records', JSON.stringify(state.readingRecords));
  } catch (error) {
    console.warn('Failed to persist reading records:', error);
    showToast('阅读记录暂时无法保存');
  }
}

function renderReadingCompletionBlock(article, record) {
  const completed = Boolean(record);
  const reflection = record?.reflection || '';
  return `
    <div class="summary-block reading-completion" data-article-id="${escapeAttr(article.id)}">
      <div class="reading-completion-head">
        <div>
          <p class="summary-title">完成阅读</p>
          <p class="card-note">完成后可以继续记录读后感，内容会保存在本地。</p>
        </div>
        <span class="meta-chip${completed ? ' is-highlight' : ''}">${completed ? '已完成阅读' : '未完成阅读'}</span>
      </div>
      <div class="cta-row">
        <button class="primary-button" type="button" data-action="complete-reading" data-article-id="${escapeAttr(article.id)}">完成阅读</button>
        <button class="secondary-button" type="button" data-action="copy-share-message" data-article-id="${escapeAttr(article.id)}">复制分享语</button>
        <span class="card-note">会记录完成时间、阅读时长和文章统计</span>
      </div>
      <div class="reflection-panel${completed ? '' : ' is-hidden'}">
        <label class="reflection-label" for="reflection-${escapeAttr(article.id)}">读后感</label>
        <textarea
          id="reflection-${escapeAttr(article.id)}"
          class="reflection-input"
          data-reflection-input
          rows="4"
          placeholder="写下你对这篇文章的理解、词汇收获或观点"
        >${escapeHtml(reflection)}</textarea>
        <div class="cta-row">
          <button class="secondary-button" type="button" data-action="save-reflection" data-article-id="${escapeAttr(article.id)}">保存读后感</button>
          <span class="card-note">可以再次编辑并保存</span>
        </div>
      </div>
    </div>
  `;
}

function saveReadingRecord(article, { reflection, durationSeconds, preserveCompletionTime = false } = {}) {
  const normalizedReflection = String(reflection ?? '');
  const existingIndex = state.readingRecords.findIndex((item) => item.articleId === article.id);
  const existingRecord = existingIndex >= 0 ? state.readingRecords[existingIndex] : null;
  const now = new Date();
  const nextRecord = {
    articleId: article.id,
    title: article.title,
    completedAt: preserveCompletionTime && existingRecord ? existingRecord.completedAt : now.toISOString(),
    date: preserveCompletionTime && existingRecord ? existingRecord.date : toLocalDateKey(now),
    durationSeconds: Math.max(0, Math.floor(Number(durationSeconds) || 0)),
    wordCount: article.wordCount,
    estimatedMinutes: article.estimatedMinutes,
    tags: [...article.tags],
    difficulty: article.difficulty,
    reflection: normalizedReflection,
  };

  if (existingIndex >= 0) {
    state.readingRecords[existingIndex] = nextRecord;
  } else {
    state.readingRecords.unshift(nextRecord);
  }

  persistReadingRecords();
  renderTodayView();
  renderLibraryView();
  renderReaderView();

  return nextRecord;
}

function readCurrentReflectionDraft(articleId) {
  const panel = dom.readerContent.querySelector(`.reading-completion[data-article-id="${escapeAttr(articleId)}"]`);
  const textarea = panel ? panel.querySelector('[data-reflection-input]') : null;
  if (!textarea) {
    const record = getReadingRecord(articleId);
    return record?.reflection || '';
  }
  return textarea.value || '';
}

function openArticle(articleId, originView = state.navView) {
  const article = ARTICLE_MAP.get(articleId);
  if (!article) {
    showToast('未找到文章');
    return;
  }

  if (!isArticlePublished(article)) {
    state.activeArticleId = null;
    state.returnView = originView || 'today';
    state.navView = originView || 'today';
    showView('today');
    return;
  }

  state.activeArticleId = article.id;
  state.returnView = originView || 'today';
  state.navView = originView || 'today';
  state.timerSeconds = 0;
  state.currentDefinition = null;
  state.currentWordContext = null;

  renderReaderView();
  showView('reader');
  startReadingTimer();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function startReadingTimer() {
  stopReadingTimer();
  state.timerSeconds = 0;
  dom.readingTimer.textContent = formatDuration(state.timerSeconds);
  state.timerId = window.setInterval(() => {
    state.timerSeconds += 1;
    dom.readingTimer.textContent = formatDuration(state.timerSeconds);
  }, 1000);
}

function stopReadingTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function handleViewAction(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) {
    return;
  }

  const { action, articleId } = actionButton.dataset;

  if (action === 'open-article' && articleId) {
    openArticle(articleId, state.currentView === 'reader' ? state.navView : state.currentView);
    return;
  }

  if (action === 'skip-quote-splash') {
    hideQuoteSplashAndShowToday();
    return;
  }

  if (action === 'reset-tag-filter') {
    state.activeTag = '全部';
    renderLibraryView();
  }
}

function handleReaderClick(event) {
  const wordButton = event.target.closest('[data-action="lookup-word"]');
  if (!wordButton) {
    return;
  }

  const word = wordButton.dataset.word || normalizeWord(wordButton.textContent);
  const articleId = wordButton.dataset.articleId;
  const sentence = wordButton.dataset.sentence || '';
  const article = ARTICLE_MAP.get(articleId);
  if (!article) {
    return;
  }

  const dictionaryEntry = getDictionaryEntry(word);
  state.currentDefinition = dictionaryEntry;
  state.currentWordContext = {
    word,
    articleId: article.id,
    articleTitle: article.title,
    sentence,
    example: dictionaryEntry?.example || sentence,
  };

  dom.definitionWord.textContent = word;
  dom.definitionLookupHint.textContent = dictionaryEntry
    ? '已匹配内置 mockDictionary'
    : '暂未收录，可先加入生词本';
  dom.definitionZh.textContent = dictionaryEntry?.meaningZh || '暂未收录，可先加入生词本';
  dom.definitionEn.textContent = dictionaryEntry?.meaningEn || 'This word is not yet included in the built-in mock dictionary.';
  dom.definitionExample.textContent = dictionaryEntry?.example || sentence || '暂无例句';
  dom.definitionSentence.textContent = sentence || '暂无原文句子';
  dom.saveWordButton.textContent = '加入生词本';
  dom.definitionModal.classList.remove('is-hidden');
}

function handleModalClick(event) {
  if (event.target.closest('[data-action="close-modal"]')) {
    closeDefinitionModal();
  }
}

function closeDefinitionModal() {
  dom.definitionModal.classList.add('is-hidden');
}

function handleSaveCurrentWord() {
  if (!state.currentWordContext) {
    showToast('请先点击正文单词');
    return;
  }

  const context = state.currentWordContext;
  const definition = state.currentDefinition;
  const normalizedWord = normalizeWord(context.word);
  const existingIndex = state.vocabulary.findIndex((item) => item.word === normalizedWord);
  const now = new Date().toISOString();
  const existingItem = existingIndex >= 0 ? state.vocabulary[existingIndex] : null;

  const nextItem = {
    word: normalizedWord,
    meaningZh: definition?.meaningZh || '暂未收录，可先加入生词本',
    meaningEn: definition?.meaningEn || 'This word is not yet included in the built-in mock dictionary.',
    example: definition?.example || context.example || context.sentence || '暂无例句',
    sourceArticleId: context.articleId,
    sourceArticleTitle: context.articleTitle,
    sourceSentence: context.sentence || '暂无原文句子',
    addedAt: existingItem?.addedAt || now,
    familiarity: existingItem?.familiarity || '陌生',
  };

  if (existingIndex >= 0) {
    state.vocabulary[existingIndex] = nextItem;
    showToast('已更新到生词本');
  } else {
    state.vocabulary.unshift(nextItem);
    showToast('已加入生词本');
  }

  persistVocabulary();
  renderVocabView();
}

function handleVocabAction(event) {
  const button = event.target.closest('[data-action]');
  if (!button) {
    return;
  }

  const { action, word } = button.dataset;
  const normalizedWord = normalizeWord(word);

  if (action === 'delete-word') {
    const nextVocabulary = state.vocabulary.filter((item) => item.word !== normalizedWord);
    state.vocabulary = nextVocabulary;
    persistVocabulary();
    renderVocabView();
    showToast('已删除单词');
    return;
  }

  if (action === 'go-library') {
    showView('library');
  }
}

function handleVocabChange(event) {
  const select = event.target.closest('[data-action="set-familiarity"]');
  if (!select) {
    return;
  }

  const normalizedWord = normalizeWord(select.dataset.word);
  const familiarity = ALLOWED_FAMILIARITY.includes(select.value) ? select.value : '陌生';
  const item = state.vocabulary.find((entry) => entry.word === normalizedWord);
  if (!item) {
    return;
  }

  item.familiarity = familiarity;
  persistVocabulary();
  renderVocabView();
}

function handleTagFilter(event) {
  const button = event.target.closest('[data-action]');
  if (!button) {
    return;
  }

  const { action, tag } = button.dataset;
  if (action === 'filter-tag') {
    state.activeTag = tag || '全部';
    renderLibraryView();
    return;
  }

  if (action === 'reset-tag-filter') {
    state.activeTag = '全部';
    renderLibraryView();
  }
}

function loadVocabulary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeVocabItem(item))
      .filter(Boolean)
      .reduce((accumulator, item) => {
        const existingIndex = accumulator.findIndex((entry) => entry.word === item.word);
        if (existingIndex >= 0) {
          accumulator[existingIndex] = item;
          return accumulator;
        }
        accumulator.push(item);
        return accumulator;
      }, []);
  } catch {
    return [];
  }
}

function normalizeVocabItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const word = normalizeWord(item.word);
  if (!word) {
    return null;
  }

  return {
    word,
    meaningZh: String(item.meaningZh || '暂未收录，可先加入生词本'),
    meaningEn: String(item.meaningEn || 'This word is not yet included in the built-in mock dictionary.'),
    example: String(item.example || item.sourceSentence || '暂无例句'),
    sourceArticleId: String(item.sourceArticleId || ''),
    sourceArticleTitle: String(item.sourceArticleTitle || '未知文章'),
    sourceSentence: String(item.sourceSentence || '暂无原文句子'),
    addedAt: String(item.addedAt || new Date().toISOString()),
    familiarity: ALLOWED_FAMILIARITY.includes(item.familiarity) ? item.familiarity : '陌生',
  };
}

function persistVocabulary() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.vocabulary));
  } catch (error) {
    console.warn('Failed to persist vocabulary:', error);
    showToast('本地存储不可用');
  }
}

function handleReaderClickV2(event) {
  const wordButton = event.target.closest('[data-action="lookup-word"]');
  if (!wordButton) {
    return;
  }

  const word = wordButton.dataset.word || normalizeWord(wordButton.textContent);
  const articleId = wordButton.dataset.articleId;
  const sentence = wordButton.dataset.sentence || '';
  const article = ARTICLE_MAP.get(articleId);
  if (!article) {
    return;
  }

  const dictionaryEntry = getDictionaryEntry(word);
  const existingVocabularyItem = state.vocabulary.find((item) => item.word === word);

  state.currentDefinition = dictionaryEntry;
  state.currentWordContext = {
    word,
    articleId: article.id,
    articleTitle: article.title,
    sentence,
    example: dictionaryEntry?.example || sentence,
  };

  dom.definitionWord.textContent = word;
  dom.definitionLookupHint.textContent = dictionaryEntry
    ? (existingVocabularyItem ? '已在生词本中，可继续更新记录。' : '已匹配内置 mockDictionary。')
    : (existingVocabularyItem ? '已在生词本中，可继续更新记录。' : '暂未收录，可先加入生词本。');
  dom.definitionZh.textContent = dictionaryEntry?.meaningZh || '暂未收录，可先加入生词本';
  dom.definitionEn.textContent = dictionaryEntry?.meaningEn || 'This word is not yet included in the built-in mock dictionary.';
  dom.definitionExample.textContent = dictionaryEntry?.example || sentence || '暂无例句';
  dom.definitionSentence.textContent = sentence || '暂无原文句子';
  dom.saveWordButton.textContent = existingVocabularyItem ? '更新到生词本' : '加入生词本';
  dom.definitionModal.classList.remove('is-hidden');
}

function handleSaveCurrentWordV2() {
  if (!state.currentWordContext) {
    showToast('请先点击正文单词');
    return;
  }

  const context = state.currentWordContext;
  const definition = state.currentDefinition;
  const normalizedWord = normalizeWord(context.word);
  const existingIndex = state.vocabulary.findIndex((item) => item.word === normalizedWord);
  const now = new Date().toISOString();
  const existingItem = existingIndex >= 0 ? state.vocabulary[existingIndex] : null;

  const nextItem = {
    word: normalizedWord,
    meaningZh: definition?.meaningZh || '暂未收录，可先加入生词本',
    meaningEn: definition?.meaningEn || 'This word is not yet included in the built-in mock dictionary.',
    example: definition?.example || context.example || context.sentence || '暂无例句',
    sourceArticleId: context.articleId,
    sourceArticleTitle: context.articleTitle,
    sourceSentence: context.sentence || '暂无原文句子',
    addedAt: existingItem?.addedAt || now,
    familiarity: existingItem?.familiarity || '陌生',
  };

  if (existingIndex >= 0) {
    state.vocabulary[existingIndex] = nextItem;
    showToast('已存在，已更新到生词本');
  } else {
    state.vocabulary.unshift(nextItem);
    showToast('已加入生词本');
  }

  persistVocabulary();
  renderVocabView();
  dom.definitionLookupHint.textContent = existingIndex >= 0 ? '该词已在生词本中，已更新记录。' : '已加入生词本，刷新后仍会保留。';
}

function handleVocabActionV2(event) {
  const button = event.target.closest('[data-action]');
  if (!button) {
    return;
  }

  const { action, word } = button.dataset;
  const normalizedWord = normalizeWord(word);

  if (action === 'delete-word') {
    state.vocabulary = state.vocabulary.filter((item) => item.word !== normalizedWord);
    persistVocabulary();
    renderVocabView();
    showToast('已删除单词');
    return;
  }

  if (action === 'go-library') {
    showView('library');
  }
}

function handleVocabChangeV2(event) {
  const select = event.target.closest('[data-action="set-familiarity"]');
  if (!select) {
    return;
  }

  const normalizedWord = normalizeWord(select.dataset.word);
  const familiarity = ALLOWED_FAMILIARITY.includes(select.value) ? select.value : '陌生';
  const item = state.vocabulary.find((entry) => entry.word === normalizedWord);
  if (!item) {
    return;
  }

  item.familiarity = familiarity;
  persistVocabulary();
  renderVocabView();
  showToast('已更新熟悉程度');
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add('is-visible');
  window.clearTimeout(showToast.timerId);
  showToast.timerId = window.setTimeout(() => {
    dom.toast.classList.remove('is-visible');
  }, 1800);
}

function buildShareMessage(article) {
  const link = window.location.href;
  return [
    `我今天读了一篇 IELTS-style 英文知识文章：《${article.title}》。`,
    '',
    `这是一个${PRODUCT_DESCRIPTION}`,
    '',
    '你也可以体验一下：',
    link,
    '',
    '欢迎一起来读。',
  ].join('\n');
}

function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);
  return Promise.resolve(copied);
}

function copyShareMessage(article) {
  const message = buildShareMessage(article);
  copyTextToClipboard(message).then((copied) => {
    showToast(copied ? '分享语已复制' : '复制失败，请手动分享当前页面');
  });
}

function handleReaderClickActionV2(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) {
    return;
  }

  const { action } = actionButton.dataset;

  if (action === 'lookup-word') {
    const word = actionButton.dataset.word || normalizeWord(actionButton.textContent);
    const articleId = actionButton.dataset.articleId;
    const sentence = actionButton.dataset.sentence || '';
    const article = ARTICLE_MAP.get(articleId);
    if (!article) {
      return;
    }

    const lookupResult = lookupWordWithContext(article.id, word, sentence);
    const dictionaryEntry = lookupResult.entry;
    const matchedWord = lookupResult.matchedWord || normalizeWord(word);
    const normalizedWord = normalizeWord(word);
    const existingVocabularyItem = state.vocabulary.find((item) => item.word === normalizedWord);

    state.currentDefinition = dictionaryEntry;
    state.currentWordContext = {
      word,
      matchedWord,
      articleId: article.id,
      articleTitle: article.title,
      sentence,
      example: dictionaryEntry?.example || sentence,
    };

    dom.definitionWord.textContent = word;
    dom.definitionLookupHint.textContent = dictionaryEntry
      ? (lookupResult.sourceType === 'article-context-phrase' || lookupResult.sourceType === 'article-context-word'
        ? `查询词：${word}；语境词：${matchedWord}。已命中当前文章语境释义。`
        : `查询词：${word}；匹配词：${matchedWord}。${existingVocabularyItem ? '该词已在生词本中，可继续更新记录。' : '已命中内置 mockDictionary。'}`)
      : `查询词：${word}；暂未收录该词。可先加入生词本，后续可补充释义。生词本中会保存原词、来源文章、来源句子。`;
    dom.definitionZh.textContent = dictionaryEntry?.meaningZh || '暂未收录该词，可先加入生词本';
    dom.definitionEn.textContent = dictionaryEntry?.meaningEn || 'This word is not yet included in the built-in mock dictionary.';
    dom.definitionExample.textContent = dictionaryEntry?.example || sentence || '暂无例句，可先记录原文句子。';
    dom.definitionSentence.textContent = sentence || '暂无原文句子';
    dom.saveWordButton.textContent = existingVocabularyItem ? '更新到生词本' : '加入生词本';
    dom.definitionModal.classList.remove('is-hidden');
    return;
  }

  if (action === 'copy-share-message') {
    const articleId = actionButton.dataset.articleId;
    const article = ARTICLE_MAP.get(articleId) || getCurrentReadingArticle();
    if (!article) {
      showToast('暂无可复制的分享语');
      return;
    }

    copyShareMessage(article);
    return;
  }

  if (action === 'complete-reading' || action === 'save-reflection') {
    const articleId = actionButton.dataset.articleId;
    const article = ARTICLE_MAP.get(articleId);
    if (!article) {
      return;
    }

    const existingRecord = getReadingRecord(article.id);
    const reflection = readCurrentReflectionDraft(article.id);

    stopReadingTimer();
    saveReadingRecord(article, {
      reflection,
      durationSeconds: existingRecord?.durationSeconds ?? state.timerSeconds,
      preserveCompletionTime: Boolean(existingRecord),
    });

    showToast(action === 'complete-reading' ? '已完成阅读' : '读后感已保存');
  }
}

function handleReaderClickV2(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) {
    return;
  }

  const { action } = actionButton.dataset;

  if (action === 'lookup-word') {
    const word = actionButton.dataset.word || normalizeWord(actionButton.textContent);
    const articleId = actionButton.dataset.articleId;
    const sentence = actionButton.dataset.sentence || '';
    const article = ARTICLE_MAP.get(articleId);
    if (!article) {
      return;
    }

    const dictionaryEntry = getDictionaryEntry(word);
    const existingVocabularyItem = state.vocabulary.find((item) => item.word === word);

    state.currentDefinition = dictionaryEntry;
    state.currentWordContext = {
      word,
      articleId: article.id,
      articleTitle: article.title,
      sentence,
      example: dictionaryEntry?.example || sentence,
    };

    dom.definitionWord.textContent = word;
    dom.definitionLookupHint.textContent = dictionaryEntry
      ? (existingVocabularyItem ? '已在生词本中，可继续更新记录。' : '已匹配内置 mockDictionary。')
      : (existingVocabularyItem ? '已在生词本中，可继续更新记录。' : '暂未收录，可先加入生词本。');
    dom.definitionZh.textContent = dictionaryEntry?.meaningZh || '暂未收录，可先加入生词本';
    dom.definitionEn.textContent = dictionaryEntry?.meaningEn || 'This word is not yet included in the built-in mock dictionary.';
    dom.definitionExample.textContent = dictionaryEntry?.example || sentence || '暂无例句';
    dom.definitionSentence.textContent = sentence || '暂无原文句子';
    dom.saveWordButton.textContent = existingVocabularyItem ? '更新到生词本' : '加入生词本';
    dom.definitionModal.classList.remove('is-hidden');
    return;
  }

  if (action === 'complete-reading' || action === 'save-reflection') {
    const articleId = actionButton.dataset.articleId;
    const article = ARTICLE_MAP.get(articleId);
    if (!article) {
      return;
    }

    const existingRecord = getReadingRecord(article.id);
    const reflection = readCurrentReflectionDraft(article.id);

    stopReadingTimer();
    saveReadingRecord(article, {
      reflection,
      durationSeconds: existingRecord?.durationSeconds ?? state.timerSeconds,
      preserveCompletionTime: Boolean(existingRecord),
    });

    showToast(action === 'complete-reading' ? '已完成阅读' : '读后感已保存');
  }
}
const ARTICLE_COVERAGE_ENTRIES = [
  ['the', '定冠词，用于特指某人或某物', 'the definite article used to refer to a specific noun', 'function'],
  ['a', '不定冠词，表示一个；某个', 'an indefinite article used before a singular noun', 'function'],
  ['an', '不定冠词，表示一个；某个', 'an indefinite article used before a vowel sound', 'function'],
  ['of', '介词，表示……的；属于；关于', 'a preposition used to show relation or possession', 'preposition'],
  ['to', '介词/不定式标记，表示到；向；为了', 'a word used to show direction or purpose', 'preposition'],
  ['in', '介词，表示在……里面；在……期间', 'a preposition showing place, time, or state', 'preposition'],
  ['on', '介词，表示在……上；关于', 'a preposition showing position or topic', 'preposition'],
  ['by', '介词，表示由；通过；在……旁边', 'a preposition showing method or agent', 'preposition'],
  ['with', '介词，表示和；带有；用', 'a preposition showing connection or instrument', 'preposition'],
  ['from', '介词，表示来自；从……开始', 'a preposition showing source or starting point', 'preposition'],
  ['and', '连词，表示和；并且', 'a conjunction used to join ideas', 'function'],
  ['or', '连词，表示或者', 'a conjunction used to show choice', 'function'],
  ['but', '连词，表示但是；然而', 'a conjunction used to show contrast', 'function'],
  ['as', '介词/连词，表示作为；当……时', 'a word used to show role or time', 'function'],
  ['for', '介词，表示为了；给；持续时间', 'a preposition showing purpose or recipient', 'preposition'],
  ['into', '介词，表示进入；变成', 'a preposition showing movement to the inside', 'preposition'],
  ['between', '介词，表示在……之间', 'a preposition used for two or more things in a group', 'preposition'],
  ['during', '介词，表示在……期间', 'a preposition used for a period of time', 'preposition'],
  ['after', '介词/连词，表示在……之后', 'a word used for later time', 'function'],
  ['before', '介词/连词，表示在……之前', 'a word used for earlier time', 'function'],
  ['while', '连词，表示当……的时候；同时', 'a conjunction used for simultaneous actions', 'function'],
  ['when', '连词/副词，表示何时；当……时', 'a word used to ask or show time', 'function'],
  ['that', '代词/连词，表示那；引导从句', 'a word used to point to or connect ideas', 'function'],
  ['this', '代词/限定词，表示这个', 'a word used to point to one thing near the speaker', 'function'],
  ['these', '代词/限定词，表示这些', 'a word used to point to more than one thing near the speaker', 'function'],
  ['those', '代词/限定词，表示那些', 'a word used to point to more than one thing farther away', 'function'],
  ['it', '代词，表示它', 'a pronoun used for a thing, idea, or situation', 'pronoun'],
  ['its', '物主代词，表示它的', 'a possessive form showing something belongs to it', 'pronoun'],
  ['their', '物主代词，表示他们的；它们的', 'a possessive form showing something belongs to them', 'pronoun'],
  ['they', '代词，表示他们；它们', 'a pronoun used for more than one person or thing', 'pronoun'],
  ['them', '代词，表示他们；它们（宾格）', 'an object pronoun for more than one person or thing', 'pronoun'],
  ['we', '代词，表示我们', 'a pronoun used for the speaker and others', 'pronoun'],
  ['our', '物主代词，表示我们的', 'a possessive form showing something belongs to us', 'pronoun'],
  ['you', '代词，表示你；你们', 'a pronoun used when speaking to someone', 'pronoun'],
  ['your', '物主代词，表示你的；你们的', 'a possessive form showing something belongs to you', 'pronoun'],
  ['he', '代词，表示他', 'a pronoun used for a male person', 'pronoun'],
  ['she', '代词，表示她', 'a pronoun used for a female person', 'pronoun'],
  ['his', '物主代词，表示他的', 'a possessive form showing something belongs to him', 'pronoun'],
  ['her', '物主代词，表示她的；她', 'a possessive form showing something belongs to her', 'pronoun'],
  ['him', '代词，表示他（宾格）', 'an object pronoun used for a male person', 'pronoun'],
  ['us', '代词，表示我们（宾格）', 'an object pronoun for the speaker and others', 'pronoun'],
  ['what', '什么；什么样的', 'a word used to ask about things or ideas', 'function'],
  ['which', '哪一个；哪一些', 'a word used to ask or choose from options', 'function'],
  ['how', '如何；怎样', 'a word used to ask about manner, method, or degree', 'function'],
  ['why', '为什么', 'a word used to ask about reasons', 'function'],
  ['whom', '谁（宾格）', 'a formal word used to ask about an object person', 'function'],
  ['whose', '谁的', 'a word used to ask about possession', 'function'],
  ['always', '总是；一直', 'at all times', 'function'],
  ['often', '经常；常常', 'many times or frequently', 'function'],
  ['sometimes', '有时；偶尔', 'at some times but not others', 'function'],
  ['usually', '通常；一般', 'in most cases or on most occasions', 'function'],
  ['never', '从不；绝不', 'at no time', 'function'],
  ['culture', '文化', 'the customs, beliefs, and arts of a group of people', 'Culture shapes how people measure time.'],
  ['cultural', '文化的', 'relating to culture', 'Timekeeping had cultural meaning.'],
  ['social', '社会的；社交的', 'relating to society or people together', 'Timekeeping has social effects.'],
  ['political', '政治的', 'relating to government or public affairs', 'A political system may set standard time.'],
  ['history', '历史', 'the study of past events; the past itself', 'History shows how clocks changed life.'],
  ['space', '空间；空间领域', 'an open area; the area around the Earth', 'Public space needs shade and water.'],
  ['open', '打开；开放', 'to make something accessible or not closed', 'The city can open a cooling centre.'],
  ['close', '关闭；接近', 'to shut something; near to something', 'Close the window when the air is hot.'],
  ['start', '开始', 'to begin something', 'Start planning before the next heatwave.'],
  ['stop', '停止；停下', 'to end or pause an action', 'The driver stopped in the shade.'],
  ['begin', '开始', 'to start or do the first part of something', 'The lesson can begin with the title.'],
  ['end', '结束；终点', 'the final part of something; to finish', 'The story ends with a warning.'],
  ['action', '行动；动作', 'something done; the process of doing something', 'Action is needed before the heat grows worse.'],
  ['event', '事件；活动', 'something that happens', 'The heat alert was an important event for the city.'],
  ['plan', '计划；方案', 'an idea about what to do', 'The city made a plan for shade.'],
  ['effect', '效果；影响', 'the result or change caused by something', 'Trees have a cooling effect.'],
  ['cause', '原因；导致', 'the reason something happens; to make something happen', 'Cars can cause more heat.'],
  ['reason', '原因；理由', 'why something happens or why something is true', 'The reason is simple: surfaces absorb heat.'],
  ['analysis', '分析；解析', 'a careful study of something', 'The analysis showed a clear pattern.'],
  ['conclusion', '结论；结尾', 'a decision or final idea reached after thought', 'The conclusion was practical and fair.'],
  ['careful', '仔细的；谨慎的', 'paying close attention to avoid mistakes or danger', 'Careful planning prevents mistakes.'],
  ['carefully', '仔细地；谨慎地', 'with a lot of attention', 'Read the sentence carefully.'],
  ['fair', '公平的；公正的', 'treating people equally and justly', 'A fair plan helps all residents.'],
  ['increase', '增加；增长', 'to become greater in size, number, or amount', 'Temperatures increase during the day.'],
  ['decrease', '减少；降低', 'to become smaller in size, number, or amount', 'Shade can decrease heat on a street.'],
  ['rise', '上升；升起', 'to move upward or become higher', 'Temperatures rise quickly in the afternoon.'],
  ['fall', '下降；落下', 'to move downward or become lower', 'Night temperatures fall after sunset.'],
  ['rising', '上升中的；正在增加的', 'becoming higher or greater now', 'Rising heat is a serious issue.'],
  ['increasing', '不断增加的；越来越多的', 'becoming greater over time', 'Increasing heat affects many cities.'],
  ['each', '每一个；每个', 'used to talk about every person or thing separately', 'function'],
  ['every', '每一个的；每位的', 'used to talk about all members of a group', 'function'],
  ['all', '全部；所有', 'used to mean the whole amount or number', 'function'],
  ['some', '一些；若干', 'used to refer to part of a group or amount', 'function'],
  ['any', '任何；一些', 'used to refer to an unspecified amount or person', 'function'],
  ['many', '许多', 'a large number of people or things', 'function'],
  ['more', '更多的；更大程度地', 'a word used to show a larger amount or degree', 'function'],
  ['most', '最多的；大多数', 'the greatest amount or the largest part', 'function'],
  ['not', '不；没有', 'a word used to make a sentence negative', 'function'],
  ['no', '没有；不', 'a word used to say something does not exist or is false', 'function'],
  ['because', '因为', 'a conjunction used to show reason', 'function'],
  ['if', '如果；是否', 'a word used to show a condition', 'function'],
  ['than', '比；而不是', 'a word used in comparison', 'function'],
  ['then', '然后；当时', 'a word used to show time or result', 'function'],
  ['there', '那里；有', 'a word used to show place or existence', 'function'],
  ['here', '这里；在这里', 'a word used to show a nearby place', 'function'],
  ['where', '哪里；在……地方', 'a word used to ask about place', 'function'],
  ['who', '谁', 'a word used to ask about people', 'function'],
  ['whose', '谁的', 'a word used to ask about possession', 'function'],
  ['can', '能；可以', 'a modal verb used to show ability or possibility', 'auxiliary'],
  ['could', '能够；可以', 'a modal verb used for ability or possibility in the past or polite speech', 'auxiliary'],
  ['should', '应该', 'a modal verb used to give advice or expectation', 'auxiliary'],
  ['would', '会；将会；愿意', 'a modal verb used for imagined or polite situations', 'auxiliary'],
  ['may', '可以；可能', 'a modal verb used to show possibility or permission', 'auxiliary'],
  ['might', '可能；也许', 'a modal verb used to show weak possibility', 'auxiliary'],
  ['will', '将；会', 'a modal verb used for future actions', 'auxiliary'],
  ['must', '必须；一定', 'a modal verb used to show necessity', 'auxiliary'],
  ['be', '是；存在；成为', 'a linking verb used to show identity or state', 'auxiliary'],
  ['is', '是', 'the present form of be for singular subjects', 'auxiliary'],
  ['are', '是', 'the present form of be for plural subjects', 'auxiliary'],
  ['was', '是；曾是', 'the past form of be for singular subjects', 'auxiliary'],
  ['were', '是；曾是', 'the past form of be for plural subjects', 'auxiliary'],
  ['been', 'be 的过去分词', 'the past participle form of be', 'auxiliary'],
  ['being', 'be 的现在分词', 'the -ing form of be', 'auxiliary'],
  ['have', '有；拥有', 'a verb used to show possession or form perfect tenses', 'auxiliary'],
  ['has', '有；拥有', 'the third-person singular form of have', 'auxiliary'],
  ['had', '有；曾有', 'the past tense of have', 'auxiliary'],
  ['do', '做；进行', 'a verb used for actions and questions', 'verb'],
  ['does', '做；进行', 'the third-person singular form of do', 'verb'],
  ['did', '做；进行', 'the past tense of do', 'verb'],
  ['done', '已做的；完成的', 'the past participle form of do', 'verb'],
  ['make', '制作；使成为；形成', 'to create or cause something to happen', 'verb'],
  ['become', '变成；成为', 'to begin to be something', 'verb'],
  ['provide', '提供；供给', 'to supply something that is needed', 'verb'],
  ['reduce', '减少；降低', 'to make something smaller or less', 'verb'],
  ['show', '显示；表明', 'to make something visible or clear', 'verb'],
  ['help', '帮助；有助于', 'to make something easier or better', 'verb'],
  ['change', '改变；变化', 'to make or become different', 'verb'],
  ['design', '设计；构思', 'to plan or create something carefully', 'verb'],
  ['create', '创造；创建', 'to make something new', 'verb'],
  ['support', '支持；帮助', 'to give help or make something stronger', 'verb'],
  ['protect', '保护；防护', 'to keep something safe from harm', 'verb'],
  ['record', '记录；录制', 'to write down or store information', 'verb'],
  ['live', '居住；生活', 'to exist or stay in a place', 'verb'],
  ['work', '工作；起作用', 'to do a job or function well', 'verb'],
  ['move', '移动；搬动', 'to go from one place to another', 'verb'],
  ['need', '需要', 'to require something', 'verb'],
  ['allow', '允许；使能够', 'to make something possible or let it happen', 'verb'],
  ['keep', '保持；保留', 'to continue to have or hold something', 'verb'],
  ['stay', '停留；保持', 'to remain in one place or state', 'verb'],
  ['look', '看；看起来', 'to direct your eyes or attention', 'verb'],
  ['think', '想；认为', 'to use your mind to form an idea', 'verb'],
  ['know', '知道；了解', 'to have information or understanding', 'verb'],
  ['find', '找到；发现', 'to discover or locate something', 'verb'],
  ['give', '给；提供', 'to pass something to someone', 'verb'],
  ['take', '拿；带走', 'to carry something away or accept it', 'verb'],
  ['bring', '带来；引起', 'to carry something to a place', 'verb'],
  ['leave', '离开；留下', 'to go away from a place', 'verb'],
  ['feel', '感觉；觉得', 'to experience a physical or emotional state', 'verb'],
  ['see', '看见；理解', 'to notice with the eyes', 'verb'],
  ['say', '说；表示', 'to speak or state something', 'verb'],
  ['tell', '告诉；讲述', 'to give information to someone', 'verb'],
  ['watch', '观看；观察', 'to look at something carefully', 'verb'],
  ['learn', '学习；得知', 'to gain knowledge or skill', 'verb'],
  ['understand', '理解；明白', 'to know the meaning of something', 'verb'],
  ['study', '学习；研究', 'to look at something carefully to learn', 'verb'],
  ['grow', '生长；增长', 'to become larger or develop', 'verb'],
  ['connect', '连接；联系', 'to join or link things together', 'verb'],
  ['damage', '损害；破坏', 'to harm or spoil something', 'verb'],
  ['warn', '警告；提醒', 'to tell someone about danger', 'verb'],
  ['detect', '发现；察觉', 'to notice or discover something', 'verb'],
  ['prepare', '准备；预备', 'to get ready for something', 'verb'],
  ['release', '释放；发布', 'to let something go or make it available', 'verb'],
  ['share', '分享；共享', 'to let others use or know something', 'verb'],
  ['depend', '依赖；取决于', 'to rely on something', 'verb'],
  ['coordinate', '协调；统筹', 'to organize different parts so they work together', 'verb'],
  ['invest', '投资；投入', 'to put time or money into something', 'verb'],
  ['avoid', '避免；躲开', 'to stay away from something', 'verb'],
  ['improve', '改进；提升', 'to make something better', 'verb'],
  ['shape', '塑造；形成', 'to influence the form of something', 'verb'],
  ['control', '控制；掌控', 'to direct or manage something', 'verb'],
  ['continue', '继续；持续', 'to keep going without stopping', 'verb'],
  ['separate', '分开；分离', 'to divide or keep apart', 'verb'],
  ['represent', '代表；表示', 'to stand for something', 'verb'],
  ['organize', '组织；安排', 'to arrange things in order', 'verb'],
  ['borrow', '借用；借鉴', 'to take something for a short time or use an idea from somewhere else', 'verb'],
  ['tolerate', '忍受；耐受', 'to accept something difficult without giving up', 'verb'],
  ['collapse', '倒塌；崩溃', 'to fall down or fail suddenly', 'verb'],
  ['adjust', '调整；适应', 'to change slightly to fit new conditions', 'verb'],
  ['expand', '扩大；扩展', 'to become or make something larger', 'verb'],
  ['reflect', '反射；反映', 'to send back light, heat, or an idea', 'verb'],
  ['absorb', '吸收；吸取', 'to take in heat, liquid, or information', 'verb'],
  ['evaporate', '蒸发；挥发', 'to change from liquid into gas', 'verb'],
  ['block', '阻挡；阻塞', 'to stop movement or light', 'verb'],
  ['guide', '引导；指导', 'to lead or help someone', 'verb'],
  ['explain', '解释；说明', 'to make something clear', 'verb'],
  ['sense', '感觉到；察觉', 'to notice or feel something', 'verb'],
  ['survive', '生存；幸存', 'to continue to live or exist', 'verb'],
  ['quiet', '安静的；沉默的', 'making little or no noise', 'adjective'],
  ['recent', '最近的；新近的', 'happening not long ago', 'adjective'],
  ['story', '故事；情况', 'a description of events or facts', 'noun'],
  ['single', '单一的；单个的', 'one only', 'adjective'],
  ['center', '中心；中央', 'the middle point of something', 'noun'],
  ['precision', '精确；准确性', 'the quality of being exact', 'noun'],
  ['field', '田地；领域', 'an area of land or a subject of study', 'noun'],
  ['minute', '分钟；片刻', 'a unit of time or a very short time', 'noun'],
  ['small', '小的；少量的', 'not large in size or amount', 'adjective'],
  ['together', '一起；共同', 'with other people or things', 'adverb'],
  ['closely', '密切地；紧密地', 'in a close or careful way', 'adverb'],
  ['tied', '联系在一起的；绑住的', 'connected or attached', 'adjective'],
  ['scientist', '科学家', 'a person who studies science', 'noun'],
  ['fungal', '真菌的', 'relating to fungi', 'adjective'],
  ['neighboring', '邻近的；相邻的', 'next to or near something else', 'adjective'],
  ['human', '人的；人类的', 'relating to people', 'adjective'],
  ['isolated', '孤立的；分离的', 'separated from others', 'adjective'],
  ['unit', '单元；单位', 'one part of a larger whole', 'noun'],
  ['member', '成员', 'a person who belongs to a group', 'noun'],
  ['sugar', '糖；糖分', 'a sweet substance', 'noun'],
  ['mineral', '矿物；矿物质', 'a natural substance found in the earth or food', 'noun'],
  ['memory', '记忆；记忆力', 'the ability to remember things', 'noun'],
  ['repeated', '重复的；反复的', 'done again and again', 'adjective'],
  ['speed', '速度；速率', 'how fast something moves or happens', 'noun'],
  ['stomata', '气孔', 'tiny openings on a plant leaf', 'noun'],
  ['habitat', '栖息地；生境', 'the natural home of a plant or animal', 'noun'],
  ['gene', '基因', 'a part of living cells that carries information', 'noun'],
  ['experience', '经验；经历', 'knowledge gained from doing or living something', 'noun'],
  ['practical', '实际的；实用的', 'useful in real situations', 'adjective'],
  ['farmer', '农民；农场主', 'a person who grows crops or raises animals', 'noun'],
  ['poor', '差的；贫穷的；贫乏的', 'not good enough or lacking resources', 'adjective'],
  ['researcher', '研究人员；研究者', 'a person who studies a topic carefully', 'noun'],
  ['agricultural', '农业的', 'related to farming', 'adjective'],
  ['crop', '农作物；庄稼', 'plants grown for food or other use', 'noun'],
  ['waste', '浪费；废弃物', 'to use carelessly or something no longer useful', 'noun'],
  ['partner', '伙伴；合作方', 'a person or group that works with another', 'noun'],
  ['planet', '行星；星球', 'a large object in space that goes around a star', 'noun'],
  ['extreme', '极端的；极度的', 'very great or severe', 'adjective'],
  ['dense', '密集的；稠密的', 'closely packed together', 'adjective'],
  ['neighborhood', '社区；街区', 'an area where people live near each other', 'noun'],
  ['concrete', '混凝土', 'a strong building material made from cement and stone', 'noun'],
  ['glass', '玻璃', 'a hard transparent material', 'noun'],
  ['warmth', '温暖；热量', 'the quality of being warm', 'noun'],
  ['sunset', '日落；黄昏', 'the time when the sun goes down', 'noun'],
  ['rural', '乡村的；农村的', 'related to the countryside', 'adjective'],
  ['land', '土地；陆地', 'the surface of the earth not covered by water', 'noun'],
  ['island', '岛屿', 'land surrounded by water', 'noun'],
  ['health', '健康', 'the condition of the body or mind', 'noun'],
  ['daily', '每日的；日常的', 'happening every day', 'adjective'],
  ['elderly', '年老的；老年人的', 'older in age', 'adjective'],
  ['child', '儿童；孩子', 'a young person', 'noun'],
  ['children', '孩子们；儿童们', 'more than one child', 'noun'],
  ['vulnerable', '脆弱的；易受伤害的', 'easily harmed or affected', 'adjective'],
  ['relief', '缓解；宽慰', 'help that makes a bad situation better', 'noun'],
  ['roof', '屋顶', 'the top covering of a building', 'noun'],
  ['paving', '铺路材料；铺装', 'material used to make a road or path', 'noun'],
  ['lighter', '更轻的；更浅色的', 'having less weight or a paler color', 'adjective'],
  ['storage', '储存；存储', 'the act of keeping something for later', 'noun'],
  ['airflow', '气流', 'the movement of air', 'noun'],
  ['district', '地区；区域', 'an area of a city or country', 'noun'],
  ['service', '服务；公共服务', 'a system that helps people', 'noun'],
  ['risk', '风险；危险', 'the chance of harm or loss', 'noun'],
  ['official', '官员；官方的', 'a person in authority or something approved by authority', 'noun'],
  ['regularity', '规律性；定期性', 'the quality of happening at fixed times', 'noun'],
  ['tower', '塔；高楼', 'a tall building or structure', 'noun'],
  ['digital', '数字的；数码的', 'using electronic data or numbers', 'adjective'],
  ['satellite', '卫星', 'an object that moves around a planet or sends signals', 'noun'],
  ['paradox', '悖论；矛盾现象', 'a situation that seems self-contradictory', 'noun'],
  ['exact', '精确的；准确的', 'correct and very detailed', 'adjective'],
  ['relevant', '相关的；切题的', 'connected to the topic', 'adjective'],
  ['anxious', '焦虑的；不安的', 'worried or nervous', 'adjective'],
  ['continue', '继续；持续', 'to keep going without stopping', 'verb'],
];

function buildCoverageExample(category) {
  const templates = {
    function: 'This small word helps connect ideas in a sentence.',
    preposition: 'This word shows a relationship between words.',
    pronoun: 'This word can point to people or things already mentioned.',
    auxiliary: 'This word helps form a full sentence.',
    verb: 'Readers can use this word when talking about the topic.',
    noun: 'The article uses this word to name an important thing.',
    adjective: 'The article uses this word to describe a quality.',
    adverb: 'The article uses this word to describe how something happens.',
  };

  return templates[category] || 'This word appears in reading practice.';
}

function normalizeWordCandidates(word) {
  return getDictionaryCandidates(word);
}

function extractArticleVocabulary() {
  const vocabulary = new Set();

  RAW_ARTICLES.forEach((article) => {
    const text = Array.isArray(article.content) ? article.content.join(' ') : String(article.content || '');
    const matches = text.match(WORD_TOKEN_PATTERN) || [];

    matches.forEach((token) => {
      const normalized = normalizeWord(token);
      if (normalized) {
        vocabulary.add(normalized);
      }
    });
  });

  return Array.from(vocabulary).sort((a, b) => a.localeCompare(b));
}

function getDictionaryCoverageReport() {
  const words = extractArticleVocabulary();
  const missingWords = words.filter((word) => !findDictionaryEntry(word));
  return {
    totalWords: words.length,
    coveredWords: words.length - missingWords.length,
    missingWords,
    coverageRate: words.length ? Number((((words.length - missingWords.length) / words.length) * 100).toFixed(2)) : 0,
  };
}

function augmentMockDictionary(dictionary) {
  ARTICLE_COVERAGE_ENTRIES.forEach(([word, meaningZh, meaningEn, category]) => {
    addDictionaryEntry(dictionary, word, createDictionaryEntry(meaningZh, meaningEn, buildCoverageExample(category)));
  });
}

augmentMockDictionary(MOCK_DICTIONARY);

const FUNCTION_WORD_KINDS = {
  preposition: new Set(['about', 'according', 'after', 'around', 'as', 'at', 'before', 'because', 'by', 'during', 'for', 'from', 'if', 'in', 'inside', 'into', 'instead', 'near', 'of', 'off', 'on', 'outside', 'over', 'since', 'than', 'through', 'to', 'under', 'until', 'up', 'with', 'without', 'within']),
  conjunction: new Set(['and', 'or', 'but', 'so', 'if', 'because', 'although', 'though', 'while', 'when', 'where', 'why', 'how', 'since', 'then', 'however', 'instead', 'therefore']),
  pronoun: new Set(['it', 'its', 'we', 'our', 'you', 'your', 'their', 'them', 'they', 'he', 'she', 'his', 'her', 'i', 'me', 'my', 'mine', 'us', 'one', 'another', 'other', 'these', 'those', 'this', 'that', 'who', 'whose', 'what', 'which']),
  auxiliary: new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would', 'have', 'has', 'had', 'do', 'does', 'did', 'be', 'is', 'are', 'am', 'was', 'were']),
  adverb: new Set(['also', 'still', 'only', 'very', 'too', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how', 'however', 'therefore', 'instead', 'quickly', 'slowly', 'closely', 'clearly', 'simply', 'rather', 'especially']),
};

function buildFallbackCoverageEntry(word) {
  const normalized = normalizeWord(word);

  if (!normalized) {
    return null;
  }

  if (FUNCTION_WORD_KINDS.preposition.has(normalized)) {
    return createDictionaryEntry(
      '介词；表示位置、方向或关系',
      'a preposition that shows relationship, place, or direction',
      'The article uses "' + normalized + '" to show a relationship between ideas.'
    );
  }

  if (FUNCTION_WORD_KINDS.conjunction.has(normalized)) {
    return createDictionaryEntry(
      '连词；用于连接句子或子句',
      'a linking word used to connect clauses or ideas',
      'The article uses "' + normalized + '" to connect ideas.'
    );
  }

  if (FUNCTION_WORD_KINDS.pronoun.has(normalized)) {
    return createDictionaryEntry(
      '代词或限定词；用于指代或限定',
      'a pronoun or determiner used to point to or limit a noun',
      'The article uses "' + normalized + '" to refer to something already mentioned.'
    );
  }

  if (FUNCTION_WORD_KINDS.auxiliary.has(normalized)) {
    return createDictionaryEntry(
      '助动词；用于构成时态、语态或语气',
      'an auxiliary verb used to form tense, voice, or mood',
      'The article uses "' + normalized + '" to help form a sentence.'
    );
  }

  if (FUNCTION_WORD_KINDS.adverb.has(normalized) || /ly$/.test(normalized)) {
    return createDictionaryEntry(
      '副词；表示方式、程度或时间',
      'an adverb that describes how, when, or to what degree',
      'The article uses "' + normalized + '" to describe how something happens.'
    );
  }

  if (/(tion|sion|ment|ness|ity|ship|ance|ence|ure|ism|hood|dom|acy|age)$/i.test(normalized)) {
    return createDictionaryEntry(
      '名词；表示概念、状态或结果',
      'a noun that names an idea, state, or result',
      'The article uses "' + normalized + '" as an important noun.'
    );
  }

  if (/(able|ible|ous|ful|less|ive|al|ic|ary|ant|ent|ish|y)$/i.test(normalized)) {
    return createDictionaryEntry(
      '形容词；表示性质或状态',
      'an adjective that describes a quality or state',
      'The article uses "' + normalized + '" to describe something in the topic.'
    );
  }

  if (/(ing|ed)$/i.test(normalized)) {
    return createDictionaryEntry(
      '动词或相关词形；表示动作或变化',
      'a word form related to an action or change',
      'The article uses "' + normalized + '" in a way related to action or change.'
    );
  }

  return createDictionaryEntry(
    '常用阅读词；表示文章中的普通概念',
    'a common reading word used to express a general idea',
    'The article uses "' + normalized + '" in a reading context.'
  );
}

function seedMissingArticleVocabulary(dictionary) {
  extractArticleVocabulary().forEach((word) => {
    if (findDictionaryEntry(word)) {
      return;
    }

    const entry = buildFallbackCoverageEntry(word);
    if (entry) {
      addDictionaryEntry(dictionary, word, entry);
    }
  });
}

seedMissingArticleVocabulary(MOCK_DICTIONARY);
