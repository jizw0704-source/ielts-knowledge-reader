const STORAGE_KEY = 'ielts-knowledge-reader.vocab.v1';
const ALLOWED_FAMILIARITY = ['陌生', '认识', '掌握'];

function normalizeWord(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/gi, '')
    .replace(/’/g, "'");
}

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
  const tokens = String(sentence).match(/[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+(?:\.[0-9]+)?|[\s]+|[^A-Za-z0-9\s]+/g) || [sentence];

  return tokens
    .map((token) => {
      if (/^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(token)) {
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
  const matches = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g);
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

function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const RAW_ARTICLES = [
  {
    id: 'the-hidden-intelligence-of-plants',
    title: 'The Hidden Intelligence of Plants',
    subtitle: 'How roots, signals, and memory-like responses help plants survive in unstable environments.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.5–7.0',
    tags: ['Biology', 'Environment'],
    summaryZh: '植物并不是被动生长的静态生命体。它们会感知环境、传递信号、调整资源分配，并通过多层机制应对干旱、虫害和温度变化。',
    summaryEn: 'Plants are often treated as silent objects, yet they constantly sense conditions, send signals, and change their growth patterns in response to stress.',
    content: [
      `For many years, plants were described as quiet organisms, almost as if they lived in a slow and unresponsive world. Recent evidence tells a different story. Roots observe moisture, leaves measure light, and tissues react to pressure, temperature, and chemical change. The mechanism is not a single brain-like center but a distributed system of signals. That system allows many species to adapt with surprising precision. In a dry field, one plant may close its leaf surface within minutes, while another slows growth in order to save energy. These responses are small, but together they reveal a form of intelligence that is closely tied to survival.`,
      `Scientists studying plant communication have discovered that signals travel through the air, through the soil, and sometimes through fungal networks that connect neighboring roots. When an insect damages a leaf, the plant may release chemical messages that warn other parts of the same organism. Nearby plants can also detect those messages and prepare defensive compounds before the threat becomes severe. This is not communication in the human sense, yet it shows a complex mechanism for sharing information. Instead of acting as isolated units, plants often behave like members of a resource network, moving sugars, water, and minerals according to changing needs.`,
      `Another important area of research involves memory and variation. A seed exposed to stress may grow differently from one that develops in a mild environment. Some plants can remember repeated drought, adjusting the speed of their stomata and roots so that water loss declines over time. Such variation does not make every plant identical; rather, it shows how biodiversity increases resilience. In a habitat where climate shifts quickly, the ability to adjust matters as much as raw strength. Evidence from greenhouses, deserts, and mountain slopes suggests that adaptation is a layered process shaped by both genes and experience.`,
      `The practical value of this knowledge is becoming clearer. Farmers looking for sustainable strategies now study plants that tolerate heat, salt, and poor soil. Researchers also design new agricultural innovations that borrow from natural mechanisms, such as targeted watering systems and sensors that predict stress before crops collapse. By understanding how plants sense their environment, humans can reduce waste and protect resources. The hidden intelligence of plants therefore has a wider meaning: it encourages us to see living systems as active partners in the struggle to survive a changing planet.`,
    ],
    coreWords: ['adaptation', 'mechanism', 'evidence', 'species', 'communication', 'environment', 'sustainable', 'predict', 'resource', 'variation', 'biodiversity', 'resilience', 'strategy', 'innovation', 'climate'],
    publishDate: '2026-06-15',
  },
  {
    id: 'how-cities-adapt-to-extreme-heat',
    title: 'How Cities Adapt to Extreme Heat',
    subtitle: 'Urban planners are redesigning streets, buildings, and public services to survive hotter summers.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.5–7.0',
    tags: ['Environment', 'Society', 'Technology'],
    summaryZh: '面对更频繁的极端高温，城市不再只靠空调和临时应急，而是通过建筑材料、绿化、交通网络和公共服务系统重新设计生活空间。',
    summaryEn: 'As heat waves become more common, cities are using design, data, and community planning to protect residents and reduce the urban heat island effect.',
    content: [
      `Extreme heat has become one of the clearest signs of climate change, and cities are feeling the pressure first. Dense neighborhoods built from concrete and glass can trap warmth long after sunset, pushing temperatures above those of nearby rural land. The result is an urban heat island, a phenomenon that affects health, energy use, and daily routines. Elderly residents, outdoor workers, and children are often the most vulnerable. To respond, city leaders must look beyond temporary relief and understand the mechanism that turns built spaces into heat traps.`,
      `One practical strategy is to redesign infrastructure. Cool roofs reflect sunlight instead of absorbing it, while tree-lined streets provide shade and lower surface temperatures. Some cities replace dark paving with lighter materials that reduce heat storage. Others use water features or green walls to support evaporation and improve the local environment. Architecture also matters: narrow streets can block airflow, whereas better spacing allows wind to move through a district. These design choices may seem small, but together they create a more sustainable system for living in warmer climates.`,
      `Technology adds another layer of adaptation. Sensors placed across neighborhoods can measure temperature in real time and show which streets are becoming dangerous. Public communication tools can then send alerts, guide people to cooling centers, and explain where drinking water is available. In some places, city networks coordinate buses, schools, and health services so that vulnerable groups are not left behind. The response is not only technical. It is also social, because resilience depends on whether a community can share information quickly and act before the heat becomes a crisis.`,
      `The future of urban life will depend on innovation as well as planning. Cities that invest early can protect resources, lower medical costs, and reduce power demand during heat waves. They can also build a stronger sense of shared responsibility, because adaptation works best when residents, designers, and officials understand the same climate risks. Extreme heat will not disappear, but its effects can be limited through careful strategy. The question is no longer whether cities should adapt. It is how fast they can do so, and whether they can do it in a way that is fair, practical, and sustainable.`,
    ],
    coreWords: ['urban', 'infrastructure', 'temperature', 'measure', 'environment', 'sustainable', 'predict', 'resource', 'resilience', 'phenomenon', 'strategy', 'innovation', 'climate', 'architecture', 'network', 'communication'],
    publishDate: '2026-06-10',
  },
  {
    id: 'the-history-of-timekeeping',
    title: 'The History of Timekeeping',
    subtitle: 'From shadows and water clocks to digital devices, humans have always tried to measure time more precisely.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.0–6.5',
    tags: ['History', 'Technology', 'Culture'],
    summaryZh: '计时方式的演变反映了人类社会的变化：从观测天象、依赖日影，到使用机械钟、标准时间和数字设备，时间测量越来越精确。',
    summaryEn: 'The history of timekeeping shows how humans moved from observing the sky to building devices that organize modern life by the minute.',
    content: [
      `The desire to measure time is ancient. Long before modern devices existed, early civilizations observed the movement of the sun, the moon, and the stars. A shadow on the ground could tell a person when to plant crops, begin a journey, or pause for rest. The first timekeeping systems were closely tied to the environment, because survival depended on the ability to predict light, heat, and seasonal variation. In this early stage, time was not a number on a screen; it was a pattern in nature that people learned to read.`,
      `As societies became more complex, people created devices that could measure time in more controlled ways. Water clocks used a steady flow of liquid, while sandglasses marked short intervals for speech, prayer, or work. These instruments were not perfect, but they represented an important innovation because they separated time from direct observation of the sky. The mechanism of each device reflected a clever attempt to make movement visible and repeatable. In many cultures, the design of such instruments was also a sign of status, because precise timekeeping supported government, trade, and ritual life.`,
      `The invention of mechanical clocks changed urban life dramatically. Bells could now regulate work, markets, and public events with far greater regularity. Over time, clock towers became part of civic architecture, standing at the center of a town or city. As transport networks expanded, society needed common standards so that trains and communication systems could function together. The result was a shift from local time to national and even global time zones. This change shows that timekeeping was never only about science. It was also about coordination, power, and the ability of civilization to organize large groups of people.`,
      `Today, digital devices make timekeeping almost invisible. Phones, computers, and satellites synchronize themselves with signals that are far more exact than the first mechanical clocks. Yet the old questions remain relevant. People still need to measure time because time shapes work, health, memory, and culture. A society that understands time can regulate its routines more effectively, but it can also become anxious about every lost minute. The history of timekeeping therefore reveals a human paradox: we invent devices to control time, yet each new invention also reminds us that time continues to move beyond our control.`,
    ],
    coreWords: ['ancient', 'observe', 'measure', 'device', 'civilization', 'innovation', 'mechanism', 'urban', 'network', 'communication', 'architecture', 'predict', 'variation', 'complex', 'climate'],
    publishDate: '2026-05-28',
  },
];

const DICTIONARY_ENTRIES = [
  ['adaptation', '适应；调整', 'the process of changing to fit new conditions', 'Adaptation helps species survive in a changing climate.'],
  ['mechanism', '机制；运作方式', 'a system or process that makes something happen', 'The mechanism of plant signaling is more complex than it first appears.'],
  ['evidence', '证据；依据', 'facts or information that show something is true', 'The researchers found evidence of communication between roots.'],
  ['significant', '显著的；重要的', 'large or important enough to have an effect', 'The heat island effect has a significant impact on cities.'],
  ['decline', '下降；减少', 'to become smaller, weaker, or lower', 'Water loss declines when the plant closes its leaves.'],
  ['species', '物种', 'a group of living things that are similar and can produce young', 'Different species respond to heat in different ways.'],
  ['urban', '城市的；都市的', 'relating to a city or town', 'Urban neighborhoods often store more heat than rural land.'],
  ['infrastructure', '基础设施', 'the basic systems and structures a society needs', 'Good infrastructure supports safer transport and cooling.'],
  ['temperature', '温度', 'the degree of heat in a place or object', 'Temperature can rise sharply after sunset in some districts.'],
  ['ancient', '古代的；古老的', 'from a very long time ago', 'Ancient civilizations watched the sky to measure time.'],
  ['observe', '观察；观测', 'to watch carefully in order to learn something', 'Scientists observe how leaves react to pressure.'],
  ['measure', '测量；衡量', 'to find the size, amount, or degree of something', 'Sensors measure temperature across the city.'],
  ['network', '网络；关系网', 'a connected system of people or things', 'A fungal network can connect plant roots underground.'],
  ['communication', '交流；传递', 'the act of giving or sharing information', 'Communication between plants may happen through chemicals.'],
  ['environment', '环境', 'the air, water, and land around us', 'The environment changes quickly during a heat wave.'],
  ['sustainable', '可持续的', 'able to continue without causing serious damage', 'Cities need sustainable cooling strategies.'],
  ['predict', '预测；预料', 'to say what is likely to happen in the future', 'Better models can predict heat stress more accurately.'],
  ['complex', '复杂的', 'made of many connected parts', 'The social response to heat is often complex.'],
  ['resource', '资源', 'a supply of something useful', 'Water is a limited resource in dry regions.'],
  ['variation', '变化；差异', 'a difference or change in form or amount', 'There is large variation in timekeeping methods across history.'],
  ['biodiversity', '生物多样性', 'the variety of different living things in a place', 'High biodiversity can improve ecosystem resilience.'],
  ['resilience', '韧性；恢复力', 'the ability to recover and remain strong', 'Community resilience improves when information moves quickly.'],
  ['phenomenon', '现象', 'something that can be observed or experienced', 'The urban heat island effect is a familiar phenomenon.'],
  ['strategy', '策略；方法', 'a careful plan to achieve a goal', 'Plant breeders use strategy to improve drought tolerance.'],
  ['innovation', '创新', 'a new idea, method, or device', 'Innovation can make cities more comfortable in summer.'],
  ['climate', '气候', 'the usual weather conditions in a place', 'Climate change is increasing the frequency of heat waves.'],
  ['density', '密度', 'the amount of something in a space', 'High population density can make urban heat worse.'],
  ['architecture', '建筑学；建筑风格', 'the design of buildings', 'Architecture can affect how air moves through a street.'],
  ['device', '装置；设备', 'a machine or tool made for a purpose', 'A sandglass is a simple measuring device.'],
  ['civilization', '文明', 'an advanced society with organized culture and institutions', 'Civilization depends on shared systems of time.'],
  ['signal', '信号；讯号', 'a sign that conveys information', 'Roots send a chemical signal when they are under stress.'],
  ['respond', '回应；反应', 'to react to something', 'Leaves respond quickly to changes in light.'],
  ['distribute', '分配；分布', 'to give out or spread over an area', 'Plants distribute water and sugars through their tissues.'],
  ['regulate', '调节；控制', 'to control by rules or by a system', 'Clocks help regulate work and transport schedules.'],
  ['monitor', '监测；观察', 'to watch and check something over time', 'Cities monitor heat levels with sensors.'],
  ['exposure', '暴露；接触', 'the state of being in contact with something', 'Long exposure to heat can be dangerous.'],
  ['drought', '干旱', 'a long period with little or no rain', 'Repeated drought can change how a plant grows.'],
  ['shadow', '影子', 'a dark shape made when light is blocked', 'A shadow can act like an early clock.'],
  ['harvest', '收获', 'to gather crops', 'Farmers harvest when the season is right.'],
  ['compound', '化合物；混合物', 'a substance made from two or more parts', 'Some plants release defensive compounds.'],
  ['sensor', '传感器', 'a device that detects changes', 'Sensors can warn people before a heat wave becomes severe.'],
  ['maintain', '维持；保持', 'to keep something in good condition', 'Shade trees help maintain lower street temperatures.'],
  ['transform', '改变；转变', 'to change greatly in form or appearance', 'Digital systems transformed timekeeping in the modern era.'],
  ['pressure', '压力', 'the force exerted on something', 'Roots react to pressure from the surrounding soil.'],
  ['cycle', '循环；周期', 'a series of events that repeats', 'The day-night cycle shaped early timekeeping.'],
  ['system', '系统', 'a set of connected parts that work together', 'Timekeeping is part of a broader social system.'],
  ['moisture', '水分；湿气', 'a small amount of water in the air or soil', 'Roots observe moisture in the soil.'],
  ['defense', '防御；保护', 'protection from attack or harm', 'Plants prepare defense compounds after damage.'],
  ['threshold', '阈值；临界点', 'a level or point at which something starts to happen', 'Heat becomes dangerous after a certain threshold.'],
];

const ARTICLES = RAW_ARTICLES.map((article) => ({
  ...article,
  coreWordSet: new Set(article.coreWords.map((word) => normalizeWord(word))),
  wordCount: countArticleWords(article.content),
  estimatedMinutes: getEstimatedReadingMinutes(countArticleWords(article.content)),
}));

const MOCK_DICTIONARY = Object.fromEntries(
  DICTIONARY_ENTRIES.map(([word, meaningZh, meaningEn, example]) => [
    normalizeWord(word),
    { meaningZh, meaningEn, example },
  ]),
);

const ARTICLE_MAP = new Map(ARTICLES.map((article) => [article.id, article]));

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
};

const dom = {};

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', stopReadingTimer);

function init() {
  cacheDom();
  state.readingRecords = loadReadingRecords();
  state.vocabulary = loadVocabulary();
  bindEvents();
  renderAllViews();
  showView('today');
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
  dom.readerContent.addEventListener('click', handleReaderClickV2);
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
    + renderReadingCompletionBlock(article, readingRecord);

  dom.readingTimer.textContent = formatDuration(state.timerSeconds);
}

function getTodayArticle() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  return ARTICLES[dayOfYear % ARTICLES.length];
}

function getFilteredArticles() {
  const sorted = [...ARTICLES].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  if (state.activeTag === '全部') {
    return sorted;
  }
  return sorted.filter((article) => article.tags.includes(state.activeTag));
}

function getSortedVocabulary() {
  return [...state.vocabulary].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}

function getDictionaryEntry(word) {
  return MOCK_DICTIONARY[normalizeWord(word)] || null;
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
