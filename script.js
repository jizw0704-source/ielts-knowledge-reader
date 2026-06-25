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


const RAW_ARTICLES = [
  {
    id: 'the-hidden-intelligence-of-plants',
    title: 'The Hidden Intelligence of Plants',
    subtitle: 'How roots, signals, and memory-like responses help plants survive in unstable environments.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.5–7.0',
    tags: ['Biology', 'Environment'],
    summaryZh: '关于植物是否具有“智能”的争论，核心不在于它们有没有大脑，而在于它们如何感知环境、传递信号、调整资源并在压力下做出适应性反应。',
    summaryEn: 'This article explores how plants sense light, water, touch, gravity, and chemical signals, and why scientists describe their behavior as sophisticated rather than human-like intelligence.',
    content: [
      `The idea that plants may be intelligent has long divided scientists. For centuries, plants were treated as passive organisms that simply grew where they were placed, while intelligence was reserved for animals with brains and nervous systems. Yet modern research has made that view harder to defend. A plant does not think in the human sense, but it can sense light, water, gravity, touch, and chemical change with remarkable precision. Roots observe moisture in the soil, leaves measure sunlight, and tissues react to temperature and pressure. Because these responses are coordinated and often adaptive, some researchers argue that plants display a limited but real form of biological intelligence.`,
      `The most obvious evidence comes from the way plants grow toward useful conditions and away from harmful ones. When a seedling leans toward a window, it is responding to light. When roots bend downward, they are responding to gravity. When a stem touches a support and begins to wrap around it, the plant has detected physical contact and altered its growth pattern. None of these actions requires a central brain. Instead, signals move through the plant’s cells, changing hormone levels and instructing different parts of the organism to behave in different ways. This distributed system allows a plant to react quickly even though it lacks muscles or nerves.`,
      `Water search is one of the clearest examples of this flexibility. In dry soil, roots do not grow in a random manner. They explore, compare, and adjust their direction as conditions change. If one section of the ground is too dry, a root may slow its growth there and invest more energy in a wetter layer nearby. This ability is important because roots are not only anchors; they are sensors and decision-makers. They record variation in the environment and guide the rest of the plant toward better access to resources.`,
      `Plants also communicate with one another, although their language is chemical rather than verbal. When a leaf is attacked by insects, the plant can release volatile compounds into the air. Those compounds may warn nearby plants that a threat is present, giving them time to prepare defensive responses before the damage spreads. Some plants respond by making bitter or toxic chemicals that reduce the chance of further feeding. Others strengthen their tissues or change the taste of their leaves. This kind of warning system is difficult to see, which is one reason the hidden life of plants was ignored for so long. Nevertheless, the evidence suggests that a forest is not simply a group of separate individuals standing side by side.`,
      `The underground world is even more surprising. Many plants are connected by mycorrhizal networks, which are partnerships between fungi and roots. Through these networks, plants can exchange sugars, water, minerals, and signals. The arrangement is not always equal, and scientists still disagree about how much plants control the exchange, but the network clearly allows information and resources to move across a larger system. In a stressed environment, this can improve resilience. A tree that has access to more light may share carbon with a younger plant nearby, while a plant under attack may send warning signals through the same network. The result is a living community rather than a collection of isolated organisms.`,
      `Researchers are careful, however, about using the word intelligence. The term is attractive because it suggests purpose, learning, and problem-solving, but it can also mislead readers into imagining plant behavior as animal-like thought. Most scientists prefer to speak of sensitivity, signaling, plasticity, or adaptive response. That caution matters because plants do not have consciousness in the human sense, and their decisions are produced by chemistry, evolution, and local conditions rather than by a thinking mind. Even so, the behavior remains impressive. A plant can remember repeated stress in the form of altered growth, and some studies show that previous exposure to drought or touch affects later reactions. This is not memory in the usual sense, but it is a useful scientific analogy.`,
      `The practical value of this research extends far beyond biology textbooks. In agriculture, farmers and plant scientists are studying crops that can tolerate heat, salt, insects, and poor soil. Better understanding of root behavior and chemical signaling may help them design irrigation systems that waste less water and improve yields in difficult climates. In ecology, the idea of plant communication changes how we think about forests, grasslands, and restoration projects. Rebuilding a damaged habitat may require more than planting seedlings; it may require protecting the hidden fungal and root networks that help those seedlings survive. In a warmer world, such knowledge could make ecosystem recovery faster and more reliable.`,
      `For that reason, the hidden intelligence of plants is not merely a poetic phrase. It is a reminder that life can solve problems in more than one way. Humans rely on brains and language, but plants rely on distributed sensing, chemical exchange, and slow yet effective adaptation. Their responses may be invisible at first, yet they shape survival on every scale, from the life of a single seed to the stability of an entire landscape. The more carefully scientists study those responses, the more clearly they see that intelligence is not always loud, fast, or human. Sometimes it is rooted in silence, spread through soil, and expressed in the patience of growth.`,
    ],
    coreWords: ['adaptation', 'mechanism', 'evidence', 'species', 'communication', 'environment', 'sustainable', 'predict', 'resource', 'variation', 'biodiversity', 'resilience', 'strategy', 'innovation', 'climate'],
    publishDate: '2026-06-24',
  },
  {
    id: 'how-cities-adapt-to-extreme-heat',
    title: 'How Cities Adapt to Extreme Heat',
    subtitle: 'Urban planners are redesigning streets, buildings, and public services to survive hotter summers.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.5–7.0',
    tags: ['Environment', 'Society', 'Technology'],
    summaryZh: '极端高温正在迫使城市重新思考街道、建筑、绿化和公共服务的组织方式。文章讨论热岛效应、建筑材料、蓝绿基础设施、交通规划、预警系统以及适应策略中的公平与维护问题。',
    summaryEn: 'Cities are responding to rising heat with a mix of reflective materials, shade, green infrastructure, transport planning, and data-driven warnings. The article shows that adaptation is as much about design and fairness as it is about technology.',
    content: [
      `Extreme heat is now one of the most visible pressures on urban life. When a heat wave lasts for several days, streets can remain warm after sunset because buildings, roads, and parked vehicles store energy during the day and release it slowly at night. Dense districts made of concrete and glass often stay hotter than surrounding rural land, creating an urban heat island. This phenomenon is not only uncomfortable. It affects sleep, work, transport, and public health. Elderly residents, outdoor workers, and people without reliable cooling are often the first to suffer. Cities are beginning to treat heat as a planning problem rather than an emergency.`,
      `One reason urban areas heat up so quickly is the material they are built from. Concrete, asphalt, and dark roofing absorb large amounts of sunlight, while narrow streets and tall walls can restrict airflow and trap warm air near the ground. Urban designers now pay attention to the colour, shape, and spacing of buildings because those details influence how a district cools after dark. A street lined with reflective façades and lighter pavements behaves very differently from one covered in black asphalt. The mechanism is straightforward: the less heat a surface stores, the lower the night-time temperature and the smaller the strain on local health services.`,
      `A common response is to change the surfaces that collect heat. Cool roofs use reflective materials or light coatings so that more solar energy is sent back into the atmosphere instead of being absorbed by the building. Similar ideas are being used on roads, bus shelters, and public squares. In some cities, planners replace conventional roofing with materials that are easier to maintain and that stay cooler under direct sunlight. These choices are technical and economic. If a building remains cooler, it needs less air conditioning, which can reduce electricity demand during heat waves. However, the value of such measures depends on local climate, the age of the building stock, and the money available to pay for change.`,
      `Trees and water are another important part of the response. Shade from mature trees can lower surface temperatures and make walking more tolerable, while parks and planted corridors help cooler air move through dense neighbourhoods. Some planners describe these systems as blue-green infrastructure because they combine vegetation with canals, ponds, rain gardens, and other water-sensitive features. The goal is to make a city look greener. It is to create living surfaces that absorb less heat, support evaporation, and make public spaces more usable during the hottest months. Yet planting trees alone is not enough. Without irrigation, soil care, and protection from traffic damage, young trees may die before they provide relief.`,
      `Street design also shapes how people experience heat. Wide roads with little shade can become dangerous corridors for pedestrians and cyclists, while badly planned public transport stops expose commuters to direct sunlight for long periods. Cities that want to adapt often redesign bus shelters, add canopies, and create cooler routes to schools, clinics, and markets. Some places also rethink traffic patterns so that fewer vehicles idle in the hottest parts of the city, because engines and exhaust add to local warmth. These decisions do more than improve comfort. They affect mobility and decide whether residents can move around safely during a heat emergency. In this sense, adaptation is not only about temperature; it is also about access.`,
      `The social cost of heat is uneven. Higher-income households may cool their homes, travel by car, and avoid the hottest hours of the day, but low-income families often live in older buildings with weaker insulation and fewer shaded public spaces nearby. Outdoor labourers, delivery drivers, and market sellers cannot simply stay indoors when the temperature rises. For them, heat is a problem of income, housing, and working conditions as much as weather. City leaders therefore face a fairness question: should scarce funds go first to business districts that must keep moving, or to the neighbourhoods where people are most exposed? An adaptation plan has to answer technical and moral questions at the same time.`,
      `Recent advances in data collection have made city responses more precise. Sensors placed on roofs, lamp posts, and transport corridors can track temperature variation across a district and show which streets become most dangerous in the afternoon. When that information is combined with weather forecasts and health data, officials can send warnings before a crisis. Some cities open cooling centres, extend public transport hours, or adjust school schedules when a heat alert is issued. The usefulness of these systems depends on communication: an alert that reaches officials but not residents saves little. For that reason, the most successful programmes combine technology with public education and trusted local networks.`,
      `In the end, adapting to extreme heat is not a single project but a long-term process of design and governance. No city can solve the problem with one material, one law, or one device. A sustainable response usually mixes reflective surfaces, shade, transport planning, emergency alerts, and maintenance budgets that can support the system year after year. Just as importantly, adaptation must remain flexible, because future heat waves may be longer, sharper, and more unpredictable than the last. Cities that begin early can reduce medical costs and protect vulnerable residents, but only if they treat heat as a permanent urban condition rather than a seasonal inconvenience.`,
    ],
    coreWords: ['urban', 'infrastructure', 'temperature', 'measure', 'environment', 'sustainable', 'predict', 'resource', 'resilience', 'phenomenon', 'strategy', 'innovation', 'climate', 'architecture', 'network', 'communication'],
    publishDate: '2026-06-23',
  },
  {
    id: 'the-history-of-timekeeping',
    title: 'The History of Timekeeping',
    subtitle: 'From shadows and water clocks to digital devices, humans have always tried to measure time more precisely.',
    sourceType: 'Original IELTS-style Article',
    difficulty: 'IELTS 6.0–6.5',
    tags: ['History', 'Technology', 'Culture'],
    summaryZh: '计时技术的演变不仅是精度的提升，也反映了社会组织方式的变化：从日影和天象到机械钟、铁路时刻表、原子钟和全球同步系统，时间测量一直在塑造人类生活。',
    summaryEn: 'The history of timekeeping shows how humans turned shadows, celestial observation, clocks, and atomic signals into tools for organizing labor, transport, trade, and science.',
    content: [
      `Humans have always needed time because daily life depends on order. People work, travel, eat, meet, worship, and rest according to patterns that are easier to manage when they can be measured. Long before modern devices existed, early civilizations watched the sun, moon, and stars to judge the passage of the day and the season. A shadow on the ground could help a farmer decide when to plant, a traveller decide when to leave, or a community decide when to stop work. At this stage, time was not yet abstract. It was a practical pattern in nature that people learned to read.`,
      `The earliest tools for measuring time were simple but effective. Sundials used the movement of a shadow, water clocks relied on a steady flow of liquid, and sandglasses measured short periods for speech, prayer, or labour. None of these devices was perfectly accurate, especially when weather, light, or temperature changed. Even so, each one marked an important step because it separated time from direct observation of the sky. The mechanism was basic, but the idea behind it was powerful: if movement could be controlled or observed more carefully, life could become more predictable. In many societies, such tools were also symbols of knowledge and status.`,
      `Astronomical observation played a crucial role in early calendars. Civilizations that studied the sky were able to divide the year into seasons, months, and festivals linked to farming or religious practice. This mattered because agriculture depended on regular cycles of light, heat, rainfall, and harvest. A calendar was therefore more than a record of dates. It was a system for predicting when to prepare fields, when to celebrate, and when to store food. By connecting time measurement with astronomy, societies turned the sky into a guide for collective life. The result was a stronger relationship between science, ritual, and survival.`,
      `Mechanical clocks later changed the meaning of time in towns and cities. Once a clock tower could strike the hour, a bell could organize work, prayer, and commerce with far greater regularity than a sundial ever could. Urban life became easier to coordinate because markets could open at known times, church services could begin together, and public administration could follow a shared schedule. This shift also affected social behaviour. Time was no longer only natural; it became public and disciplined. People who lived near a clock began to think in terms of hours, deadlines, and punctuality, which made city life more efficient but also more controlled.`,
      `Navigation added another layer of difficulty. At sea, sailors needed to know not only the time but also their position. The problem of longitude showed why accurate clocks mattered so much. If a ship could compare local noon with the time at a reference point, it could estimate its distance east or west. That insight encouraged the development of more precise marine chronometers, which allowed long voyages to become safer and more reliable. Better timekeeping therefore helped trade, exploration, and imperial expansion. It also showed that a clock could be a scientific instrument with direct economic value.`,
      `Industrialization made precision even more important. Factories depended on shifts, railways depended on timetables, and cities depended on transport systems that had to work together. Local time could not serve this world for long because each town might keep its own clock according to the sun. Standard time zones were created so that trains would not arrive before they were supposed to leave and so that businesses could coordinate across wider regions. In this sense, timekeeping became a form of social organization. It shaped labour, travel, and communication, and it helped modern states manage large populations with shared schedules.`,
      `Modern timekeeping has become so accurate that most people rarely notice it. Quartz clocks keep time with a vibrating crystal, atomic clocks measure tiny changes in atoms, and satellites distribute signals that synchronize devices around the world. These systems matter because modern life depends on exact timing. Financial markets rely on timestamps, phone networks need synchronization, GPS depends on nanosecond-level correction, and scientific research often requires measurements that are almost impossibly precise. A small error in time can create a large error in distance, communication, or data. The modern clock is therefore not just a household object; it is an invisible infrastructure for global systems.`,
      `The history of timekeeping shows that measuring time has always served two purposes at once. It is a scientific activity because it asks how nature can be observed and controlled more precisely. It is also a social activity because time organizes labour, religion, transport, trade, and public life. Every new device, from the sundial to the atomic clock, has made time more exact, but it has also made society more dependent on shared schedules. That is why timekeeping remains one of the most important technologies humans have created. It tells us when to act, but it also tells us how modern life is connected.`,
    ],
    coreWords: ['ancient', 'observe', 'measure', 'device', 'civilization', 'innovation', 'mechanism', 'urban', 'network', 'communication', 'architecture', 'predict', 'variation', 'complex', 'climate'],
    publishDate: '2026-06-25',
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
  ['time', '时间', 'the measure of moments and periods', 'Time helps people organize daily life.'],
  ['clock', '时钟；钟表', 'a device that shows or measures time', 'The clock on the wall struck six.'],
  ['calendar', '日历；历法', 'a system for showing days, months, and years', 'She marked the exam date on her calendar.'],
  ['astronomy', '天文学', 'the study of stars, planets, and space', 'Astronomy helped early societies read the sky.'],
  ['sundial', '日晷', 'a device that tells time by a shadow', 'A sundial works when sunlight is strong.'],
  ['hourglass', '沙漏', 'a device that measures time with sand', 'An hourglass can time a short speech.'],
  ['liquid', '液体', 'a substance that flows and is not solid', 'Water is the most familiar liquid.'],
  ['weather', '天气', 'the state of the atmosphere at a place and time', 'The weather changed before sunset.'],
  ['order', '秩序；顺序', 'a state in which things are arranged or controlled', 'Order helps a city function well.'],
  ['sun', '太阳', 'the star that gives Earth light and heat', 'The sun rises in the east.'],
  ['moon', '月亮；月球', 'the object that circles the Earth', 'The moon was bright that night.'],
  ['star', '星星；恒星', 'a shining object in the night sky', 'A star can guide a traveller.'],
  ['sky', '天空', 'the space above the Earth where clouds and stars appear', 'The sky was clear after the rain.'],
  ['date', '日期', 'a particular day or point in time', 'Please write the date at the top of the page.'],
  ['festival', '节日；庆典', 'a special public event or celebration', 'The festival marks the start of spring.'],
  ['prayer', '祈祷；祷告', 'words spoken to ask for help or thanks', 'The prayer lasted only a minute.'],
  ['labour', '劳动；劳作', 'work, especially physical work', 'Farm labour was important in the past.'],
  ['travel', '旅行；出行', 'to go from one place to another', 'Many people travel by train.'],
  ['meet', '会见；见面', 'to come together or see someone', 'We meet in the library after class.'],
  ['worship', '崇拜；敬拜', 'to show respect or devotion to a god', 'Many people worship in different ways.'],
  ['rest', '休息；静止', 'to stop working or moving to recover energy', 'The driver rested for ten minutes.'],
  ['accurate', '准确的；精确的', 'correct and without mistakes', 'The new clock is very accurate.'],
  ['predictable', '可预测的；可预见的', 'easy to guess because it follows a pattern', 'The result became more predictable.'],
  ['observation', '观察；观测', 'the act of watching carefully', 'Careful observation improves science.'],
  ['scientific', '科学的', 'connected with science', 'Scientific methods depend on evidence.'],
  ['development', '发展；开发', 'the process of growing or becoming more advanced', 'The development of the city changed the district.'],
  ['collective', '集体的；共同的', 'shared by a group of people or things', 'The team made a collective decision.'],
  ['ritual', '仪式；例行程序', 'a set of actions done in a fixed way', 'The ritual began at sunrise.'],
  ['survival', '生存；存活', 'the act of continuing to live or exist', 'Water is essential for survival.'],
  ['navigation', '导航；航行', 'the act of finding a route or position', 'Navigation at sea required accurate clocks.'],
  ['sailor', '水手；海员', 'a person who works on a ship', 'The sailor checked the map.'],
  ['position', '位置；姿势', 'the place something is in', 'The ship used the stars to find its position.'],
  ['longitude', '经度', 'distance east or west of a reference line', 'Longitude was hard to measure at sea.'],
  ['reference', '参照；参考', 'something used for comparison or guidance', 'The clock used a reference time.'],
  ['chronometer', '精密计时器；航海钟', 'a very accurate timekeeping device', 'The chronometer helped the voyage succeed.'],
  ['voyage', '航程；航行', 'a long journey by sea or in space', 'The voyage took several months.'],
  ['factory', '工厂', 'a building where goods are made', 'The factory ran on a fixed schedule.'],
  ['railway', '铁路', 'a system of tracks for trains', 'The railway connected the towns.'],
  ['timetable', '时刻表', 'a plan showing when trains or buses arrive and leave', 'The timetable was updated daily.'],
  ['timezone', '时区', 'a region that uses the same standard time', 'Different timezones make global work harder.'],
  ['quartz', '石英', 'a hard mineral used in clocks and electronics', 'Quartz helps a clock keep time.'],
  ['atomic', '原子的', 'relating to atoms', 'Atomic clocks are very precise.'],
  ['synchronize', '同步；使同步', 'to make things happen at the same time', 'Phones synchronize their time automatically.'],
  ['synchronization', '同步', 'the act of making things happen together', 'Synchronization keeps the network accurate.'],
  ['timestamp', '时间戳', 'a mark showing when something happened', 'Each file had a timestamp.'],
  ['satellite', '卫星', 'an object that moves around a planet or sends signals', 'A satellite can send time signals.'],
  ['correction', '修正；纠正', 'a change made to fix an error', 'The correction improved the result.'],
  ['household', '家庭；家用的', 'a home or the people living in one', 'Each household received the notice.'],
  ['invisible', '看不见的；无形的', 'not able to be seen', 'The network is invisible underground.'],
  ['global', '全球的；世界的', 'relating to the whole world', 'Global time systems need coordination.'],
  ['economic', '经济的', 'relating to money, business, and trade', 'The change had an economic effect.'],
  ['imperial', '帝国的；帝王的', 'relating to an empire', 'Imperial trade depended on fast ships.'],
  ['expansion', '扩张；扩大', 'the process of becoming larger or wider', 'Expansion brought new towns and roads.'],
  ['instrument', '仪器；工具', 'a tool or device used for a purpose', 'The clock became a scientific instrument.'],
  ['data', '数据', 'facts or figures used for analysis', 'The data showed a clear trend.'],
  ['information', '信息；资料', 'facts or knowledge about something', 'The report gives useful information.'],
  ['root', '根；根系', 'the part of a plant that grows underground', 'The root absorbs water from the soil.'],
  ['organism', '生物体', 'a living thing such as a plant, animal, or microbe', 'Each organism reacts to its environment.'],
  ['passive', '被动的；静止的', 'not active or not doing much', 'The old model treated plants as passive.'],
  ['nervous', '神经的；紧张的', 'connected with nerves or feeling worried', 'The nervous system is important in animals.'],
  ['brain', '大脑；脑', 'the organ in the head used for thinking', 'Humans rely on the brain.'],
  ['cell', '细胞', 'the smallest unit of a living thing', 'A plant cell has a strong wall.'],
  ['hormone', '激素；荷尔蒙', 'a chemical in the body that affects growth or activity', 'The hormone controls growth patterns.'],
  ['seedling', '幼苗', 'a young plant that has just started to grow', 'The seedling needed more water.'],
  ['fungus', '真菌', 'a living thing such as a mold or mushroom', 'A fungus can live in moist soil.'],
  ['mycorrhizal', '菌根的', 'relating to fungi and plant roots working together', 'Mycorrhizal links can help roots share resources.'],
  ['ecology', '生态学；生态', 'the study of living things and their environment', 'Ecology explains how forests stay balanced.'],
  ['restoration', '修复；恢复', 'the process of bringing something back to a better state', 'Restoration can rebuild damaged land.'],
  ['irrigation', '灌溉', 'the supply of water to land or crops', 'Irrigation helps crops survive dry months.'],
  ['yield', '产量；收益', 'the amount produced', 'Better soil can increase crop yield.'],
  ['ecosystem', '生态系统', 'living things and the environment they depend on', 'The river ecosystem needs protection.'],
  ['recovery', '恢复；复苏', 'the process of becoming healthy or strong again', 'Recovery after drought can take years.'],
  ['stress', '压力；应激', 'mental or physical pressure', 'Stress can change how a plant grows.'],
  ['consciousness', '意识', 'awareness of oneself and the world', 'Scientists debate the meaning of consciousness.'],
  ['volatile', '挥发性的；易变的', 'changing quickly or easily evaporated', 'Volatile compounds spread through the air.'],
  ['attack', '攻击；袭击', 'to try to harm or hurt', 'Insects attack the leaves at night.'],
  ['insect', '昆虫', 'a small animal with six legs', 'An insect landed on the leaf.'],
  ['defense', '防御；保护', 'protection from attack or harm', 'The plant used defense chemicals.'],
  ['soil', '土壤', 'the top layer of earth where plants grow', 'The soil was dry after the heat wave.'],
  ['growth', '生长；增长', 'the process of becoming larger', 'Growth slowed in the cold season.'],
  ['touch', '触碰；接触', 'to make contact with something', 'The plant reacted to touch.'],
  ['gravity', '重力', 'the force that pulls things toward the Earth', 'Gravity pulls roots downward.'],
  ['direction', '方向', 'the way something moves or faces', 'The roots changed direction.'],
  ['random', '随机的；无规律的', 'not planned or ordered', 'The choices did not seem random.'],
  ['manner', '方式；方法', 'the way something is done', 'The answer was given in a calm manner.'],
  ['forest', '森林', 'a large area covered with trees', 'A forest stores a lot of carbon.'],
  ['agriculture', '农业', 'the practice of farming', 'Agriculture depends on water and soil.'],
  ['exchange', '交换；交流', 'to give one thing and receive another', 'The two plants exchange signals underground.'],
  ['response', '反应；回应', 'something done in answer to another thing', 'The body showed a quick response.'],
  ['chemical', '化学的；化学物质', 'relating to chemicals or substances', 'Chemical changes can happen underground.'],
  ['green', '绿色的；环保的', 'having the color of grass or plants', 'The park looked green after the rain.'],
  ['blue', '蓝色的', 'having the color of the sky or sea', 'The cover of the book is blue.'],
  ['light', '光；浅色的', 'energy that makes things visible', 'Light entered the room through the window.'],
  ['cool', '凉快的；冷却', 'having a low temperature or making something less hot', 'A cool room is easier to study in.'],
  ['reflective', '反光的；反射的', 'able to reflect light, heat, or ideas', 'Reflective glass can reduce heat.'],
  ['facade', '立面；外观', 'the outer front or face of a building', 'The facade looked brighter after renovation.'],
  ['asphalt', '沥青', 'a black material used to make roads', 'Asphalt can store a lot of heat.'],
  ['pavement', '路面；人行道', 'a hard surface for walking or driving', 'The pavement was still warm at night.'],
  ['insulation', '隔热；绝缘', 'material or action that reduces heat or sound flow', 'Good insulation keeps rooms cooler.'],
  ['canopy', '遮篷；树冠', 'a covering that gives shade', 'A canopy can protect people from sun.'],
  ['corridor', '走廊；通道', 'a long narrow passage or route', 'The corridor stayed crowded at noon.'],
  ['commuter', '通勤者', 'a person who travels regularly to work or school', 'A commuter waited at the bus stop.'],
  ['mobility', '流动性；移动能力', 'the ability to move or travel easily', 'Good sidewalks improve mobility.'],
  ['fairness', '公平；公正', 'the quality of treating people equally and justly', 'Fairness matters in public planning.'],
  ['governance', '治理；管理', 'the way a place or group is managed', 'Good governance helps cities adapt.'],
  ['warning', '警告；预警', 'something that tells people about danger', 'The warning arrived before the storm.'],
  ['forecast', '预测；预报', 'a statement about what is likely to happen', 'The forecast predicted heavy rain.'],
  ['maintenance', '维护；保养', 'the work needed to keep something in good condition', 'Road maintenance is expensive.'],
  ['budget', '预算', 'the amount of money planned for a purpose', 'The budget covered new cooling shelters.'],
  ['electricity', '电力；电', 'a form of energy used for power', 'Electricity demand rose during the heat wave.'],
  ['energy', '能量；能源', 'power used for work or heat', 'The roof stores energy during the day.'],
  ['housing', '住房；住房问题', 'homes or the act of providing homes', 'Housing costs are rising quickly.'],
  ['income', '收入', 'money that a person or group receives', 'Income affects how people handle heat.'],
  ['traffic', '交通；车流', 'the movement of vehicles on roads', 'Traffic slowed near the school.'],
  ['pedestrian', '行人', 'a person who is walking', 'Pedestrian routes should stay shaded.'],
  ['cyclist', '骑自行车的人', 'a person who rides a bicycle', 'The cyclist stopped for water.'],
  ['vehicle', '车辆', 'a machine used for transport', 'The vehicle waited at the light.'],
  ['emergency', '紧急情况；突发事件', 'a serious situation that needs quick action', 'The city opened a cooling centre in an emergency.'],
  ['public', '公共的；公众的', 'for everyone to use or know', 'Public space needs shade.'],
  ['solar', '太阳的；太阳能的', 'relating to the sun', 'Solar energy can power some systems.'],
  ['atmosphere', '大气；氛围', 'the layer of gases around the Earth', 'Heat is released into the atmosphere.'],
  ['surface', '表面', 'the outer layer of something', 'The surface of the road was hot.'],
  ['water', '水', 'a clear liquid that people, animals, and plants need', 'Water helps plants survive heat.'],
  ['plant', '植物；种植', 'a living thing that grows in soil and usually has roots and leaves', 'Each plant needs light and water.'],
  ['leaf', '叶子；叶片', 'a flat green part of a plant', 'A leaf can signal stress very quickly.'],
  ['seed', '种子', 'a small part of a plant that can grow into a new plant', 'A seed needs water and warmth.'],
  ['stem', '茎；干', 'the main part of a plant that supports leaves and flowers', 'The stem moves water upward.'],
  ['branch', '树枝；分支', 'a part that grows from the trunk or stem', 'A branch can shade the ground.'],
  ['tree', '树', 'a tall plant with a trunk and branches', 'A tree can make a street cooler.'],
  ['park', '公园；停放', 'a public green space; to leave a vehicle in one place', 'People rested in the park at noon.'],
  ['sunlight', '阳光', 'light from the sun', 'Sunlight can make a road surface very hot.'],
  ['street', '街道', 'a road in a town or city', 'The street needs more shade.'],
  ['route', '路线', 'a way from one place to another', 'A shaded route helps pedestrians.'],
  ['shelter', '遮蔽物；避难所', 'a place or object that protects people from weather', 'A shelter protects people from direct sun.'],
  ['coating', '涂层', 'a thin layer put on a surface', 'A light coating can reflect heat.'],
  ['alert', '警报；提醒', 'a warning that something may happen', 'The alert reached residents quickly.'],
  ['crisis', '危机', 'a dangerous or difficult time', 'A heat crisis can overwhelm hospitals.'],
  ['school', '学校', 'a place where children learn', 'Schools may change hours during heat waves.'],
  ['clinic', '诊所', 'a small medical centre', 'A clinic treated people after the heat alert.'],
  ['market', '市场', 'a place where goods are bought and sold', 'The market opened earlier on hot days.'],
  ['delivery', '送货；递送', 'the act of bringing something to a place', 'Delivery workers faced the worst heat.'],
  ['driver', '司机', 'a person who drives a vehicle', 'The driver took breaks in the shade.'],
  ['worker', '工人；工作人员', 'a person who does a job', 'Outdoor workers need more protection.'],
  ['heatwave', '热浪', 'a period of unusually hot weather', 'A heatwave lasted for many days.'],
  ['combined', '结合的；合并的', 'joined together to make one result', 'Combined action can make cities safer.'],
  ['trusted', '可信的；受信任的', 'believed to be reliable', 'Trusted local voices improve communication.'],
  ['education', '教育；宣传', 'the process of teaching and learning', 'Public education helps people prepare.'],
  ['equity', '公平；公正', 'fairness in the way resources are shared', 'Equity matters in heat planning.'],
  ['cooler', '更凉爽的；更冷的', 'less hot than something else', 'Shaded streets feel cooler in the afternoon.'],
  ['roofing', '屋面材料；屋顶覆盖', 'material used to cover a roof', 'Better roofing can reduce indoor heat.'],
  ['bus', '公交车', 'a large vehicle that carries passengers', 'The bus arrived after the heat alert.'],
  ['neighbourhood', '街区；社区', 'an area where people live near each other', 'A shaded neighbourhood feels cooler.'],
  ['science', '科学', 'the study of the natural world through observation and experiment', 'Science helps explain plant responses.'],
  ['combine', '结合；合并', 'to join two or more things together', 'Planners combine shade and water.'],
  ['trust', '信任；信赖', 'belief that someone or something is reliable', 'Residents must trust the warning system.'],
  ['mature', '成熟的；发育良好的', 'fully developed; fully grown', 'Mature trees provide more shade.'],
  ['discipline', '纪律；自律', 'control of behaviour or training through rules', 'Timekeeping encouraged discipline.'],
  ['punctuality', '守时；准时', 'the quality of arriving or doing things on time', 'Punctuality became important in cities.'],
  ['precise', '精确的；准确的', 'exact and clear', 'A precise clock changed navigation.'],
  ['people', '人们；人们群体', 'humans in general or a group of humans', 'People need better warnings in heat waves.'],
  ['person', '人；个人', 'a human being', 'Each person needs enough water.'],
  ['place', '地方；位置', 'a particular area or location', 'The right place can stay cooler.'],
  ['day', '一天；白天', 'a period of twenty-four hours', 'The day felt much hotter than the night.'],
  ['life', '生活；生命', 'the state of being alive; the experience of living', 'City life changes when heat rises.'],
  ['group', '群体；小组', 'a number of people or things together', 'One group studied plant roots.'],
  ['thing', '东西；事情', 'an object, idea, or matter', 'Time is a difficult thing to measure.'],
  ['develop', '发展；开发', 'to grow or make something grow or more advanced', 'Cities develop new ways to adapt.'],
  ['adapt', '适应；调整', 'to change in order to fit new conditions', 'Plants adapt to light and water.'],
  ['sustain', '维持；支撑', 'to keep something going over time', 'Trees sustain cooler streets.'],
  ['influence', '影响', 'to affect something or the effect itself', 'Heat can influence health and work.'],
  ['area', '区域；地区', 'a part of a place', 'This area becomes hotter in the afternoon.'],
  ['country', '国家；乡村', 'a nation or rural land', 'The country needs better transport systems.'],
  ['year', '年；一年', 'a period of twelve months', 'Each year brings new weather challenges.'],
  ['hour', '小时', 'a period of sixty minutes', 'The heat alert lasted for many hours.'],
  ['second', '秒；第二的', 'a very short unit of time; coming after the first', 'A second can matter in an emergency.'],
  ['world', '世界', 'the earth and all the people and things on it', 'Cities around the world face heat.'],
  ['nature', '自然', 'the natural world', 'Nature can help cool a city.'],
  ['state', '状态；州', 'the condition of something; a political area in some countries', 'The state of the roads affects heat.'],
  ['part', '部分；角色', 'a piece of something or the role something plays', 'Trees play a part in cooling.'],
  ['way', '方式；道路', 'a method or direction', 'There is more than one way to adapt.'],
  ['air', '空气', 'the mixture of gases around us', 'Hot air stayed near the ground.'],
  ['road', '道路；马路', 'a hard surface for vehicles or walking', 'The road was coated in reflective material.'],
  ['car', '汽车', 'a road vehicle with four wheels', 'A car offers shade and air conditioning.'],
  ['warm', '温暖的；热的', 'having a fairly high temperature', 'Warm air stayed in the street at night.'],
  ['cold', '冷的；寒冷的', 'having a low temperature', 'Cold water helped the plants recover.'],
  ['dark', '黑暗的；深色的', 'with little light; deep in colour', 'Dark roofs absorb more heat.'],
  ['new', '新的', 'not old or not used before', 'The city tried a new planning method.'],
  ['old', '旧的；年老的', 'not new; having lived for many years', 'Old buildings often need more cooling.'],
  ['near', '靠近；附近的', 'close in space or time', 'A tree near the road gives shade.'],
  ['far', '远的；很远', 'at a great distance', 'The station was far from the market.'],
  ['long', '长的；长期的', 'having great length or lasting a long time', 'A long heatwave is hard to manage.'],
  ['month', '月份；一个月', 'a period of about four weeks', 'The month was marked by heat alerts.'],
  ['season', '季节', 'a division of the year with similar weather', 'Each season changes the length of the day.'],
  ['farming', '农业；耕作', 'the work of growing crops or raising animals', 'Farming depended on reliable calendars.'],
  ['religion', '宗教', 'a system of beliefs and worship', 'Religion and timekeeping often worked together.'],
  ['field', '田地；领域', 'an open area of land used for farming; a subject or area of work', 'The field was ready for planting.'],
  ['food', '食物', 'something people or animals eat', 'Food had to be stored before winter.'],
  ['practice', '实践；做法', 'the actual use of an idea or method; a repeated activity', 'Religious practice often followed the calendar.'],
  ['belief', '信仰；信念', 'something that a person accepts as true', 'A shared belief shaped the ritual.'],
  ['winter', '冬天；冬季', 'the coldest season of the year', 'Winter made food storage essential.'],
  ['spring', '春天', 'the season after winter', 'Spring brought new planting.'],
  ['summer', '夏天；夏季', 'the warmest season of the year', 'Summer days were long and bright.'],
  ['autumn', '秋天；秋季', 'the season after summer and before winter', 'Autumn was the harvest season.'],
  ['major', '主要的；重大的', 'more important or larger than others', 'A major change improved the city.'],
  ['minor', '较小的；次要的', 'less important or smaller than others', 'A minor delay did not stop the plan.'],
  ['rapid', '迅速的', 'happening very fast', 'Rapid change can be hard to manage.'],
  ['gradual', '逐渐的；渐进的', 'happening slowly over time', 'A gradual shift is easier to plan for.'],
  ['essential', '必要的；基本的', 'very important and needed', 'Shade is essential in hot districts.'],
  ['simple', '简单的', 'easy to understand or do', 'The simple idea helps readers remember it.'],
  ['different', '不同的', 'not the same', 'Different cities choose different methods.'],
  ['same', '相同的', 'not different', 'The same problem appears in many places.'],
  ['short', '短的；简短的', 'not long', 'A short delay can matter in a heat alert.'],
  ['first', '第一的；首先的', 'coming before all others', 'The first step is to notice the risk.'],
  ['last', '最后的；持续', 'coming after all others; to continue for a period', 'The last heatwave lasted for days.'],
  ['early', '早的；提早的', 'happening before the usual time', 'Early planning saves money later.'],
  ['late', '晚的；迟到的', 'happening after the usual time', 'Late action can be expensive.'],
  ['clear', '清楚的；明亮的', 'easy to see, hear, or understand', 'The warning was clear and direct.'],
  ['whole', '整个的；全部的', 'complete; all of something', 'The whole city felt the heat.'],
  ['important', '重要的', 'having a lot of value or effect', 'Shade is an important part of heat planning.'],
  ['useful', '有用的；有益的', 'helpful or able to do a job well', 'A useful warning reaches people early.'],
  ['similar', '相似的；类似的', 'almost the same', 'Similar cities face similar heat problems.'],
  ['necessary', '必要的', 'needed for a particular purpose', 'Water is necessary during hot weather.'],
  ['able', '能够的', 'having the power or skill to do something', 'The city is able to respond faster now.'],
  ['ability', '能力', 'the power or skill to do something', 'The ability to adapt can save lives.'],
  ['possible', '可能的', 'able to happen or be done', 'It is possible to cool streets with shade.'],
  ['possibility', '可能性', 'the chance that something may happen', 'There is a possibility of stronger heat waves.'],
  ['permission', '允许；许可', 'approval to do something', 'The workers had permission to change the roof.'],
  ['good', '好的；良好的', 'having the desired quality', 'Good planning makes adaptation easier.'],
  ['bad', '坏的；不好的', 'of low quality or harmful', 'Bad heat can harm health quickly.'],
  ['better', '更好的；更好地', 'more good or improved', 'Better roofs can lower indoor heat.'],
  ['best', '最好的', 'better than all others', 'The best plan combines shade and water.'],
  ['worse', '更糟的；更差的', 'more bad or less good', 'The weather became worse in the afternoon.'],
  ['easy', '容易的', 'not difficult', 'It is easy to overlook heat risk.'],
  ['hard', '困难的；努力的', 'not easy; firm or solid', 'Hard surfaces store heat.'],
  ['safe', '安全的；放心的', 'not likely to cause harm', 'Safe routes help children walk to school.'],
  ['safety', '安全；平安', 'the condition of being safe', 'Safety matters during a heat alert.'],
  ['danger', '危险', 'the possibility of harm or injury', 'Heat can create danger for older people.'],
  ['dangerous', '危险的', 'likely to cause harm', 'A dangerous street needs more shade.'],
  ['age', '年龄；时代', 'how old someone or something is; a period in history', 'Age affects how people feel heat.'],
  ['older', '较年长的；更老的', 'having more age', 'Older residents need more support.'],
  ['young', '年轻的；幼小的', 'having lived only a short time; not old', 'Young trees need water and care.'],
  ['care', '照料；关心', 'the act of looking after something or someone', 'Young trees need careful care.'],
  ['improvement', '改进；提升', 'the act or result of making something better', 'Shaded streets showed clear improvement.'],
  ['problem', '问题；难题', 'something difficult that needs a solution', 'Heat is a serious problem in cities.'],
  ['solution', '解决办法；答案', 'something that solves a problem', 'Shade is part of the solution.'],
  ['issue', '问题；议题', 'an important topic or problem', 'Heat is a public issue.'],
  ['question', '问题；疑问', 'something that is asked or not yet decided', 'The question is how to adapt fairly.'],
  ['cost', '花费；成本', 'the amount of money or effort needed', 'The cost of cooling can be high.'],
  ['money', '钱；金钱', 'coins and banknotes used to buy things', 'Cities spend money on shade and water.'],
  ['effort', '努力；功夫', 'physical or mental energy used to do something', 'Effort is needed to keep trees alive.'],
  ['value', '价值；意义', 'the worth of something', 'The value of shade is easy to see.'],
  ['price', '价格；代价', 'the amount of money needed to buy something', 'The price of energy keeps rising.'],
  ['high', '高的；高度', 'above the usual level or far up', 'High temperatures can be dangerous.'],
  ['low', '低的；少的', 'below the usual level', 'Low-income families need support.'],
  ['higher', '更高的；更大的', 'more high than something else', 'Higher buildings can cast longer shadows.'],
  ['lower', '更低的；更小的', 'more low than something else', 'Lower costs help more residents.'],
  ['another', '另一个；再一个', 'one more; a different one', 'Another method can also work.'],
  ['other', '其他的；别的', 'different or additional', 'Other cities used a similar plan.'],
  ['through', '穿过；通过', 'from one side to the other or by means of something', 'Water moved through the soil.'],
  ['under', '在……下面', 'below or beneath something', 'Roots grow under the ground.'],
  ['over', '在……上方；超过', 'above or across something', 'Trees spread over the street.'],
  ['around', '围绕；大约', 'surrounding; approximately', 'Trees around the park give shade.'],
  ['across', '穿过；横跨', 'from one side to the other', 'Sensors measure heat across the city.'],
  ['against', '反对；靠着', 'in opposition to; touching', 'A wall against the sun can stay cool.'],
  ['within', '在……之内', 'inside a limit or area', 'Heat can spread within a district.'],
  ['without', '没有；无', 'not having something', 'Without shade, the street feels hotter.'],
  ['inside', '在……里面；内部', 'in or into the inner part', 'People stayed inside during the alert.'],
  ['outside', '在……外面；外部', 'on the outer side', 'Workers stayed outside for a short time.'],
  ['above', '在……上方；高于', 'higher than something else', 'Temperatures rose above normal.'],
  ['below', '在……下面；低于', 'lower than something else', 'Night temperatures stayed below the day peak.'],
  ['nearby', '附近的；在附近', 'not far away', 'A nearby clinic offered shade and water.'],
  ['one', '一；一个', 'the number 1 or a single thing', 'One city tried a new idea.'],
  ['two', '二；两个', 'the number 2 or a pair', 'Two streets were redesigned.'],
  ['three', '三；三个', 'the number 3', 'Three articles are in the library.'],
  ['four', '四；四个', 'the number 4', 'Four sensors tracked temperature.'],
  ['five', '五；五个', 'the number 5', 'Five minutes can matter in an alert.'],
  ['week', '周；星期', 'a period of seven days', 'The warning lasted for a week.'],
  ['night', '夜晚', 'the time when it is dark outside', 'The road stayed hot at night.'],
  ['morning', '早晨；上午', 'the early part of the day', 'Morning shade is useful for walkers.'],
  ['afternoon', '下午', 'the part of the day after noon', 'The afternoon can be the hottest time.'],
  ['evening', '傍晚；晚上', 'the later part of the day', 'Evening temperatures stayed high.'],
  ['today', '今天', 'the present day', 'Today the city uses heat warnings.'],
  ['tomorrow', '明天', 'the day after today', 'Tomorrow may be even hotter.'],
  ['yesterday', '昨天', 'the day before today', 'Yesterday the park was crowded.'],
  ['living', '活着的；生活中的', 'alive now; currently in use or happening', 'Living roots send signals.'],
  ['alive', '活着的', 'not dead', 'The plant stayed alive after the storm.'],
  ['growing', '生长中的；正在增长的', 'becoming larger or developing now', 'Growing roots search for water.'],
  ['train', '火车；训练', 'a railway vehicle; to teach or prepare someone', 'The train followed a strict timetable.'],
  ['regular', '有规律的；定期的', 'happening at fixed times or in a steady way', 'Regular schedules made life easier.'],
  ['fixed', '固定的；不变的', 'set and not likely to change', 'A fixed time helped the whole town.'],
  ['length', '长度；时长', 'how long something is', 'The length of the day changes with the season.'],
  ['however', '然而；不过', 'used to show contrast', 'However, the solution was not simple.'],
  ['therefore', '因此；所以', 'used to show a result', 'The city cooled streets; therefore, the alert was shorter.'],
  ['instead', '代替；而不是', 'in place of something else', 'They used shade instead of heavy concrete.'],
  ['also', '也；同样', 'in addition', 'The plan also improved walking routes.'],
  ['still', '仍然；依然', 'continuing to happen or remain', 'The road still held heat at night.'],
  ['only', '仅仅；只有', 'no more than', 'Only a few streets had enough shade.'],
  ['since', '自从；因为', 'from a time in the past; because', 'Since the policy began, conditions improved.'],
  ['although', '虽然；尽管', 'used to show contrast', 'Although the design was costly, it worked.'],
  ['though', '虽然；不过', 'used to show contrast', 'Though expensive, the plan helped residents.'],
  ['religious', '宗教的', 'relating to religion', 'Religious festivals depended on calendars.'],
  ['administration', '管理；行政', 'the work of running an organization or system', 'Time helped administration become more orderly.'],
  ['organization', '组织；安排', 'the way people or things are arranged or managed', 'Organization improved after standard time was introduced.'],
  ['commercial', '商业的', 'related to buying and selling', 'Commercial travel relied on reliable clocks.'],
  ['industrialization', '工业化', 'the growth of industry and factories', 'Industrialization increased the need for standard time.'],
  ['research', '研究', 'careful study to discover new facts', 'Research depends on accurate measurements.'],
  ['schedule', '日程；时间表', 'a plan of times and events', 'The schedule was built around the clock.'],
  ['shared', '共享的；共同的', 'used by more than one person or group', 'A shared time system makes travel easier.'],
  ['household', '家庭；家用的', 'a home or the people living in one', 'Each household received the notice.'],
  ['invisible', '看不见的；无形的', 'not able to be seen', 'The network is invisible underground.'],
  ['global', '全球的；世界的', 'relating to the whole world', 'Global time systems need coordination.'],
  ['economic', '经济的', 'relating to money, business, and trade', 'The change had an economic effect.'],
  ['imperial', '帝国的；帝王的', 'relating to an empire', 'Imperial trade depended on fast ships.'],
  ['expansion', '扩张；扩大', 'the process of becoming larger or wider', 'Expansion brought new towns and roads.'],
  ['instrument', '仪器；工具', 'a tool or device used for a purpose', 'The clock became a scientific instrument.'],
];

const EXTRA_DICTIONARY_BASE_ENTRIES = [
  // Lemmatization-focused roots that should stay as base entries only.
  ['city', '城市；城镇', 'a large town or urban area', 'Many families move to the city for work.', 'noun', false],
  ['building', '建筑；大楼', 'a structure with walls and a roof', 'The building stays cool in the afternoon shade.', 'noun', false],
  ['build', '建造；建立', 'to make something by putting parts together', 'Workers build the new bridge in stages.', 'verb', false],
  ['use', '使用；运用', 'to put something to work for a purpose', 'Students use maps to understand the route.', 'verb', false],
  ['redesign', '重新设计；改造', 'to design something again in a new way', 'Engineers redesign the street to improve safety.', 'verb', false],
  ['hot', '热的；炎热的', 'having a high temperature', 'The pavement feels hot after noon.', 'adjective', false],
  ['large', '大的；规模大的', 'big in size or amount', 'A large canopy can reduce direct sunlight.', 'adjective', false],
  ['big', '大的；重要的', 'large in size or importance', 'The city made a big investment in cooling.', 'adjective', false],
  ['common', '常见的；普遍的', 'frequently found or widely shared', 'Heat waves are becoming more common each year.', 'adjective', false],

  // High-frequency verbs.
  ['analyze', '分析；解析', 'to study something carefully by breaking it into parts', 'Researchers analyze the data before drawing conclusions.', 'verb'],
  ['indicate', '表明；指出', 'to show or point to a fact or result', 'The dark color may indicate extra heat storage.', 'verb'],
  ['suggest', '表明；建议', 'to make an idea seem likely or recommend it', 'The results suggest a stronger cooling effect.', 'verb'],
  ['estimate', '估计；估算', 'to roughly judge the size or amount of something', 'Scientists estimate the reading time from the word count.', 'verb'],
  ['reveal', '揭示；显示', 'to make something known or visible', 'The survey may reveal a hidden pattern.', 'verb'],
  ['demonstrate', '证明；展示', 'to show clearly by evidence or action', 'The experiment demonstrates how shade lowers temperature.', 'verb'],
  ['examine', '检查；审视', 'to look at something carefully', 'Doctors examine the student before practice begins.', 'verb'],
  ['compare', '比较', 'to look at things side by side to see differences', 'Students compare two articles to find a shared theme.', 'verb'],
  ['contrast', '对比；形成对照', 'to show clear differences between things', 'The writer contrasts old methods with new tools.', 'verb'],
  ['classify', '分类；归类', 'to group things by shared qualities', 'Researchers classify the words by topic.', 'verb'],
  ['define', '定义；界定', 'to explain the exact meaning of something', 'The glossary defines each key term clearly.', 'verb'],
  ['identify', '识别；确认', 'to recognize and name something', 'Readers identify the main idea more quickly with practice.', 'verb'],
  ['interpret', '解释；阐释', 'to explain what something means', 'Teachers interpret the data for the class.', 'verb'],
  ['assess', '评估；判断', 'to judge the quality or value of something', 'The teacher assesses each reflection carefully.', 'verb'],
  ['evaluate', '评估；评价', 'to judge the importance or quality of something', 'We evaluate the article after reading it.', 'verb'],
  ['generate', '产生；生成', 'to produce or create something', 'The system can generate a reading summary.', 'verb'],
  ['require', '需要；要求', 'to need something or make something necessary', 'This activity requires careful reading.', 'verb'],

  // Article-friendly nouns and academic nouns.
  ['factor', '因素', 'something that helps cause a result', 'Temperature is one factor that affects comfort.', 'noun'],
  ['process', '过程；进程', 'a series of steps that leads to a result', 'Learning is a gradual process.', 'noun'],
  ['method', '方法；手段', 'a way of doing something', 'The class uses a simple method to check answers.', 'noun'],
  ['approach', '方法；途径', 'a way of dealing with a task or problem', 'A careful approach can reduce mistakes.', 'noun'],
  ['theory', '理论', 'an idea that explains how something works', 'The theory helps explain the pattern.', 'noun'],
  ['concept', '概念', 'an idea that people think about or understand', 'The concept of resilience appears often in the article.', 'noun'],
  ['pattern', '模式；规律', 'a repeated design or way in which things happen', 'A clear pattern appears across the charts.', 'noun'],
  ['structure', '结构；组织方式', 'the way parts are arranged and connected', 'The structure of the paragraph is very clear.', 'noun'],
  ['function', '功能；作用', 'the purpose of something', 'The function of a sensor is to detect change.', 'noun'],
  ['impact', '影响；冲击', 'the effect that something has on a person or thing', 'Heat has a strong impact on daily life.', 'noun'],
  ['consequence', '结果；后果', 'something that happens because of another action', 'A small delay can have a large consequence.', 'noun'],
  ['benefit', '益处；好处', 'something useful or positive', 'A cooler street brings a clear benefit to residents.', 'noun'],
  ['challenge', '挑战；难题', 'a difficult task or problem', 'The design challenge is to save energy and stay safe.', 'noun'],
  ['feature', '特征；特点', 'an important part or quality of something', 'A key feature of the system is its speed.', 'noun'],
  ['context', '语境；背景', 'the situation or information around an event', 'Word meaning depends on context.', 'noun'],
  ['role', '角色；作用', 'the part something plays', 'Trees play a role in cooling the street.', 'noun'],
  ['source', '来源；源头', 'the place where something comes from', 'The source of the signal is easy to trace.', 'noun'],
  ['result', '结果；成果', 'something that happens because of an action', 'The result shows clear improvement.', 'noun'],
  ['policy', '政策；方针', 'an official plan or rule', 'The city introduced a new heat policy.', 'noun'],
  ['community', '社区；群体', 'a group of people who live or work together', 'The community shared cooling information quickly.', 'noun'],
  ['heat', '热；热量', 'the quality of being hot', 'The heat built up during the afternoon.', 'noun', false],
  ['resident', '居民；住户', 'a person who lives in a place', 'Every resident received a cooling alert.', 'noun'],
  ['transport', '交通；运输', 'the movement of people or goods', 'Public transport stayed open during the heat warning.', 'noun'],
  ['material', '材料；资料', 'the substance something is made from', 'Light-colored material can reduce heat absorption.', 'noun'],
  ['cooling', '降温；冷却', 'the process of making something less hot', 'Cooling is easier when the room has shade.', 'noun', false],
  ['shade', '阴影；遮荫', 'an area that is protected from direct sunlight', 'Shade helps people rest on hot days.', 'noun'],
  ['vegetation', '植被；植物群', 'plants growing in an area', 'Vegetation can help the city stay cooler.', 'noun', false],
  ['emission', '排放；释放物', 'something that is released into the air', 'Lower emission levels support cleaner air.', 'noun'],

  // Simple adjectives without extra forms.
  ['effective', '有效的；起作用的', 'successful in producing the desired result', 'This is an effective strategy for reading.', 'adjective'],
  ['efficient', '高效的；效率高的', 'doing something well without wasting time or energy', 'The new route is more efficient.', 'adjective'],
  ['stable', '稳定的；不变的', 'not likely to change suddenly', 'A stable system helps the lesson run smoothly.', 'adjective'],
  ['reliable', '可靠的；可信赖的', 'able to be trusted or depended on', 'The notes are reliable and easy to review.', 'adjective'],
  ['visible', '可见的；明显的', 'easy to see or notice', 'The word is visible on the page.', 'adjective'],
  ['natural', '自然的；天然的', 'existing in nature rather than made by people', 'Natural shade can cool the path.', 'adjective'],
  ['artificial', '人工的；人造的', 'made by people rather than nature', 'Artificial light is useful at night.', 'adjective'],
  ['public', '公共的；面向公众的', 'for everyone to use', 'Public space needs careful planning.', 'adjective'],
  ['local', '本地的；当地的', 'relating to a nearby place', 'Local streets can become hot quickly.', 'adjective'],
  ['global', '全球的；全世界的', 'relating to the whole world', 'Global climate change affects many cities.', 'adjective'],
];

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

const MOCK_DICTIONARY = buildMockDictionary();

const ARTICLES = RAW_ARTICLES.map((article) => ({
  ...article,
  coreWordSet: new Set(article.coreWords.map((word) => normalizeWord(word))),
  wordCount: countArticleWords(article.content),
  estimatedMinutes: getEstimatedReadingMinutes(countArticleWords(article.content)),
}));

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

    const lookupResult = findDictionaryEntry(word);
    const dictionaryEntry = lookupResult?.entry || null;
    const matchedWord = lookupResult?.matchedWord || normalizeWord(word);
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
      ? `查询词：${word}；匹配词：${matchedWord}。${existingVocabularyItem ? '该词已在生词本中，可继续更新记录。' : '已命中内置 mockDictionary。'}`
      : `查询词：${word}；暂未收录该词。可先加入生词本，后续可补充释义。生词本中会保存原词、来源文章、来源句子。`;
    dom.definitionZh.textContent = dictionaryEntry?.meaningZh || '暂未收录该词，可先加入生词本';
    dom.definitionEn.textContent = dictionaryEntry?.meaningEn || 'This word is not yet included in the built-in mock dictionary.';
    dom.definitionExample.textContent = dictionaryEntry?.example || sentence || '暂无例句，可先记录原文句子。';
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
