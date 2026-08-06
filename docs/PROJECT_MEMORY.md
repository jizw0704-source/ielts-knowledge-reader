# PROJECT_MEMORY.md｜IELTS Knowledge Reader 项目记忆

## 1. 项目定位

IELTS Knowledge Reader 是一个面向雅思阅读能力提升的英文知识阅读器，当前定位为手机端 H5 静态应用。它不是 IELTS / Cambridge IELTS 真题售卖平台，而是原创 IELTS-style 英文知识阅读工具。

## 2. 当前部署与仓库

* 本地目录：`Y:\codex\ielts-knowledge-reader`
* GitHub 仓库：[https://github.com/jizw0704-source/ielts-knowledge-reader.git](https://github.com/jizw0704-source/ielts-knowledge-reader.git)
* GitHub Pages 地址：[https://jizw0704-source.github.io/ielts-knowledge-reader/](https://jizw0704-source.github.io/ielts-knowledge-reader/)
* 当前线上 `main` 已保持稳定版本，开发分支不自动合并 `main`

## 3. 已完成版本

* V0.1：基础 H5 阅读器，包含首页、阅读页、文章库、点词释义、生词本、localStorage 存储、微信端访问
* V0.2：阅读记录增强，包含单词数、建议阅读时长、完成阅读、读后感、文章库已读状态
* V0.2.1：词典框架，包含 mockDictionary 扩充、词形还原、未收录词提示、词汇覆盖检查函数
* V0.2.2：文章规范文档，明确每篇文章 750–900 words、原创 IELTS-style、版权边界
* V0.2.3-a：扩写 `How Cities Adapt to Extreme Heat`，约 893 words
* V0.2.3-b：扩写 `The Hidden Intelligence of Plants`，约 887 words
* V0.2.3-c：扩写 `The History of Timekeeping`，约 819 words
* V0.2.4：三篇长文词典覆盖补齐，当前稳定版本已上线并作为正式可用基线

## 4. 当前关键决策

1. 不使用真实 IELTS / Cambridge IELTS 原文。
2. 不售卖未经授权的真题原文。
3. 内置文章采用原创 IELTS-style。
4. 每篇正式文章目标长度为 750–900 words。
5. 当前阶段不做后端、登录、云同步、AI 接口。
6. 当前存储继续使用 localStorage。
7. 每一轮只做一个小目标。
8. 不再随意大改 `style.css`。
9. 不同时修改文章、词典、UI 和存储逻辑。

## 5. 已知坑点与注意事项

1. 手机微信 WebView 可能缓存旧版 `script.js` / `style.css`。
2. 如果微信端显示旧版本，优先清缓存或增加 URL 版本参数。
3. 后续如需更新静态资源引用，要非常谨慎，优先小范围验证。
4. 之前颜色系统修改曾导致按钮和弹窗交互异常。
5. 后续 UI 修改必须小步进行。
6. 不要使用宽泛 CSS 选择器，例如 `[class*="modal"]`。
7. Codex 临时检查文件不得留在项目外或纳入提交。
8. 每次提交前必须确认 `git status` 只包含预期文件。

## 6. 当前待办

1. V0.2.5：`script.js` / `style.css` 版本参数优化与微信缓存问题进一步验证。
2. V0.3.0：日历看板。
3. V0.3.1：每日一句。
4. V0.3.2：阅读完成页增强。
5. V0.3.3：新增第 4 篇长文。

## 7. 每轮开发前必读文件

1. `Y:\codex\AGENTS.md`
2. `AGENTS.md`
3. `docs/PROJECT_RULES.md`
4. `docs/REGRESSION_CHECKLIST.md`
5. `docs/ARTICLE_SPEC.md`
6. `docs/PROJECT_MEMORY.md`
7. `README.md`

## 8. 更新规则

* `PROJECT_MEMORY.md` 只在重要节点更新。
* 不记录无意义流水账。
* 不记录隐私信息、账号密码、API Key。
* 每次完成重要版本、踩坑或改变路线时再更新。
* 更新项目记忆应作为独立小任务，不与业务代码混在一起。

## 9. 当前稳定版本说明

* V0.2.4 已上线，是当前稳定版本。
* GitHub Pages 已通过电脑端浏览器和手机微信内置浏览器验收。
* 当前稳定 tag 为 `v0.2.4-stable`。
* V0.2.4 包含：

  * 三篇 750–900 words 的原创 IELTS-style 长文；
  * 阅读记录；
  * 建议阅读时长；
  * 完成阅读；
  * 读后感；
  * 点词释义；
  * 生词本；
  * 三篇长文词典覆盖补齐；
  * 项目记忆文档。

## 10. V0.2.5 暂停记录

* V0.2.5 cache versioning 曾尝试通过调整 `index.html` 的资源引用版本号来降低微信缓存问题。
* 由于修改 `index.html` 后出现乱码，已回退并暂停。
* 当前结论：后续不要轻易修改 `index.html` 的资源引用，若确需调整，必须先做最小范围验证和明确回退方案。

## 11. V0.3 方向

下一阶段进入 V0.3，优先方向如下：

1. V0.3.0：日历看板。
2. V0.3.1：每日一句。
3. V0.3.2：阅读完成页增强。
4. V0.3.3：新增第 4 篇长文。

## 12. 版本推进原则

* 先保证稳定，再做扩展。
* 每次只改一个明确的小目标。
* 每次修改前都先确认规则文档。
* 每次提交前都先确认只包含预期文件。
* 如果需要修改视觉、缓存或资源引用，优先做小范围、可回退的变更。

## 13. V0.3.0 Guardrail Record

* The first V0.3.0 scheduled-content attempt failed.
* The failure was caused by an over-broad `script.js` edit that accidentally touched `summaryZh`, `mockDictionary`, and the word-lookup logic, and it also caused `node --check` to fail.
* The failed diff was backed up to `Y:\codex\v030-scheduled-content-broken.diff`.
* `script.js` has been rolled back and the repository is back to a clean state.
* The team will now use a safer workflow: read-only locating -> minimal patch -> diff review -> functional verification -> commit.
* Future V0.3.0 work must restart from the clean baseline.
## V0.3.0 Scheduled Content Record

- V0.3.0 scheduled content release logic 已完成。
- commit: 17b1090 Add scheduled content release logic。
- 本轮采用“只读定位 → 最小 patch → diff 审查 → 功能验收 → 提交”的受控 patch 流程。
- 本轮实现内容：
  - 三篇文章新增 publishDate 字段；
  - 首页今日推荐基于已发布文章；
  - 文章库默认只显示已发布文章；
  - openArticle 会阻止未发布文章通过普通入口打开；
  - 不涉及后端、登录、云同步、AI 自动生成。
- 本轮人工验收通过：
  - 电脑端正常；
  - 手机微信端正常；
  - 首页、文章库、阅读页、点词、生词本、完成阅读、读后感均正常。
- 下一步建议：
  - 合并 main 并上线；
  - 后续新增第 4 篇未来日期文章，用于验证真正的定时解锁。
## V0.3.1 Future Article Record

- V0.3.1 新增第 4 篇未来日期文章已完成。
- commit: 4842f41 Add future sleep and memory article。
- 新增文章：
  - id: the-science-of-sleep-and-memory
  - title: The Science of Sleep and Memory
  - publishDate: 2026-06-30
  - word count: 858
- 本轮只修改 script.js 中 RAW_ARTICLES 数据区。
- 未修改前三篇文章。
- 未修改 index.html、style.css、README.md、docs、词典、点词逻辑、生词本逻辑、阅读记录逻辑或 localStorage key。
- 当前日期为 2026-06-25 时，新文章不会出现在首页和文章库，这是预期行为。
- 本轮人工验收重点：
  - 首页不显示未来文章；
  - 文章库不显示未来文章；
  - 前三篇文章正常；
  - 点词、生词本、完成阅读、读后感正常。
- 后续方向：
  - 继续扩展为 7 天文章池；
  - 再进行 articles.js 文章数据拆分，为 AI 自动生成草稿做准备。
## V0.3.2 Daily Article Record

- V0.3.2 新增 2026-06-26 每日文章已完成。
- commit: 4896010 Add urban trees daily article。
- 新增文章：
  - id: how-urban-trees-cool-modern-cities
  - title: How Urban Trees Cool Modern Cities
  - publishDate: 2026-06-26
  - word count: 900
- 本轮只修改 script.js 中 RAW_ARTICLES 数据区。
- 未修改已有四篇文章。
- 未修改 index.html、style.css、README.md、docs、词典、点词逻辑、生词本逻辑、阅读记录逻辑或 localStorage key。
- 本轮 node --check 通过。
- 本轮本地页面验收通过。
- 当前内容节奏调整为：每天新增 1 篇原创 IELTS-style 文章，publishDate 按日期自动解锁。
- 后续建议：
  - 继续新增 2026-06-27 每日文章；
  - 稳定数日后再推进 articles.js 文章数据拆分；
  - 后续再接入 AI 自动生成草稿与人工审核发布流程。
## V0.3.3 Share Entry and Product Intro

- V0.3.3 已完成分享入口与新用户引导的最小版本。
- commit: b71be21 Add share message entry and product intro。
- 本轮功能：
  - 首页新增一句产品说明；
  - 阅读页新增“复制分享语”按钮；
  - 新增分享语生成与复制逻辑；
  - 复制逻辑包含 navigator.clipboard.writeText 和 textarea fallback；
  - 新增 copy-share-message action 分支。
- 本轮只修改 script.js。
- 未修改文章正文。
- 未修改 RAW_ARTICLES。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改点词、生词本、阅读记录、localStorage key。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 未修改 index.html、style.css、README.md。
- node --check 通过。
- 本地验收重点：
  - 首页能看到产品说明；
  - 阅读页能看到“复制分享语”按钮；
  - 复制内容包含文章标题、产品说明和当前链接；
  - 点词、生词本、完成阅读、读后感均不受影响。
## V0.3.4 Daily Articles Backfill

- V0.3.4 已完成 2026-06-27 至 2026-07-02 每日文章补齐。
- commit: 9a5291b Backfill daily IELTS-style articles through July 2。
- 本轮只修改 script.js。
- 本轮只在 RAW_ARTICLES 尾部新增 5 篇原创 IELTS-style 文章。
- 新增文章：
  - 2026-06-27: How Public Libraries Are Changing in the Digital Age
  - 2026-06-28: Why Fungi Matter to Life on Earth
  - 2026-06-29: How Sensors Changed Modern Farming
  - 2026-07-01: The Hidden Cost of Urban Noise
  - 2026-07-02: Why Cities Need Quiet Places
- 当前文章日期已从 2026-06-25 连续覆盖至 2026-07-02，中间包含 2026-06-30 的 The Science of Sleep and Memory。
- 未修改已有文章正文和排序。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改点词、生词本、阅读记录、localStorage key。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 未修改 V0.3.3 首页产品说明和复制分享语逻辑。
- node --check 通过。
- 本地验收重点：
  - 首页显示 2026-07-02 的 Why Cities Need Quiet Places；
  - 文章库能看到 2026-06-27 至 2026-07-02 已发布文章；
  - 新增文章可进入阅读页；
  - 点词、生词本、完成阅读、读后感、复制分享语均正常。
## V0.3.5 Quote Splash Intro

- V0.3.5 已完成 Quote Splash 欢迎页。
- commit: 7b6f304 Add quote splash intro。
- 本轮新增打开产品链接后的英文 quote 欢迎页。
- 欢迎页包含：
  - 原创英文 quote；
  - 产品名 IELTS Knowledge Reader；
  - 简短产品说明；
  - CSS 渐变背景；
  - Skip 按钮。
- 欢迎页约 10 秒后自动进入“今日推荐页”。
- 点击 Skip 后立即进入“今日推荐页”。
- 本轮只修改 script.js 和 style.css。
- 未修改 index.html。
- 未新增图片资源。
- 未新增二维码。
- 未新增 localStorage key。
- 未修改 RAW_ARTICLES 和文章正文。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改点词、生词本、阅读记录、复制分享语逻辑。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 本地验收通过：
  - 首次打开显示 Quote Splash；
  - 背景视觉正常；
  - Skip 可进入今日推荐页；
  - 10 秒后自动进入今日推荐页；
  - 今日推荐页和阅读功能正常。
- 后续建议：
  - V0.3.6 可继续做 Download Poster + QR；
  - 欢迎页视觉可复用为海报模板。

## V0.3 Phase Review Record

* 已新增 `docs/PHASE_REVIEW_V0.3.md`，用于记录 IELTS Knowledge Reader V0.3 阶段复盘。
* V0.3 阶段重点完成每日文章闭环、分享入口、Quote Splash 欢迎页和部署入口验证。
* V0.3.6 Download Poster + QR 暂缓，后续在核心体验稳定后再推进。
## V0.4.0 Context-Aware Vocabulary Pilot

- V0.4.0 已完成文章语境释义试点。
- 本轮新增 ARTICLE_CONTEXT_VOCABULARY，用于支持文章级语境词汇包。
- 试点文章：Why Cities Need Quiet Places。
- 新增 lookupWordWithContext 等上下文查词 helper。
- 点词查询顺序调整为：当前文章语境词汇包优先，其次回退到全局词典和原有词形候选逻辑。
- 本轮只修改 script.js。
- 未修改 RAW_ARTICLES。
- 未修改文章正文。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改 findDictionaryEntry() 本体。
- 未修改 localStorage key。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 未修改点词弹窗结构、生词本、阅读记录、Quote Splash、复制分享语。
- UTF-8 检查通过，未发现真实乱码。
- 本地验收通过：
  - quiet places、urban noise、public health、attention、traffic、parks、restore、well-being 等词/短语可显示更贴合文章语境的解释；
  - 普通词仍可回退到全局词典；
  - 生词本、完成阅读、读后感、Quote Splash、复制分享语均正常。
- 后续建议：
  - 继续为其他文章补充 ARTICLE_CONTEXT_VOCABULARY；
  - 后续可考虑将文章数据和文章词汇包拆分到独立文件；
  - 暂不接外部 API，继续保持静态部署稳定性。



## V0.4.1 IELTS Source Style Guide

* 已新增 `docs/IELTS_SOURCE_STYLE_GUIDE.md`。
* 该文档用于规范后续每日文章的来源风格、选题标准、版权边界和 `references` 字段。
* 后续每日文章应从“随机 AI 生成”升级为“参考 IELTS 真题来源风格的原创模拟文章”。
* 本轮只修改 docs，不修改业务代码、不新增文章。
## V0.4.2 Context Vocabulary for Urban Trees Article

- V0.4.2 已完成第二篇文章的文章语境词汇包补充。
- commit: ac5766f Add context vocabulary for urban trees article。
- 本轮试点文章：How Urban Trees Cool Modern Cities。
- articleId: how-urban-trees-cool-modern-cities。
- 本轮在 ARTICLE_CONTEXT_VOCABULARY 中新增 22 个语境词汇条目。
- 覆盖词汇包括 urban trees、shade、evapotranspiration、urban heat island、green infrastructure、street trees、tree canopy、public health 等。
- 本轮只修改 script.js。
- 未修改 RAW_ARTICLES。
- 未修改文章正文。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改 findDictionaryEntry()。
- 未修改 localStorage key。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 未修改点词弹窗结构、生词本、阅读记录、Quote Splash、复制分享语。
- node --check 通过。
- 本地验收通过：
  - How Urban Trees Cool Modern Cities 中的重点词汇可优先命中文章语境释义；
  - 非试点词仍可回退到全局词典；
  - 生词本、完成阅读、读后感、Quote Splash 等功能正常。
- V0.4 语境词汇机制已从单篇试点扩展到第二篇文章，证明机制可复用。
## V0.4.3 Context Vocabulary for Urban Noise Article

- V0.4.3 已完成第三篇文章的文章语境词汇包补充。
- 试点文章：The Hidden Cost of Urban Noise。
- articleId: the-hidden-cost-of-urban-noise。
- 本轮在 ARTICLE_CONTEXT_VOCABULARY 中新增 22 个语境词汇条目。
- 覆盖词汇包括 urban noise、noise pollution、sleep disruption、traffic noise、cardiovascular risk、noise barriers、public health、long-term exposure、quiet zones 等。
- 本轮只修改 script.js。
- 未修改 RAW_ARTICLES。
- 未修改文章正文。
- 未修改 mockDictionary / DICTIONARY_ENTRIES。
- 未修改 findDictionaryEntry()。
- 未修改 localStorage key。
- 未修改 publishDate / getPublishedArticles / getTodayArticle。
- 未修改点词弹窗结构、生词本、阅读记录、Quote Splash、复制分享语。
- node --check 通过。
- 本地验收通过：
  - The Hidden Cost of Urban Noise 中的重点词汇可优先命中文章语境释义；
  - 非试点词仍可回退到全局词典；
  - 生词本、完成阅读、读后感、Quote Splash、今日推荐、文章库等功能正常。
- V0.4 语境词汇机制已扩展到第三篇文章，具备继续批量扩展的基础。



## V0.5.0-a Content Architecture Documentation

* 已启动 V0.5.0 Source-backed Content Architecture。
* 本阶段只做文档与内容流水线定义。
* 已新增 `docs/CONTENT_PIPELINE.md`。
* 已在 `docs/ARTICLE_SPEC.md` 中定义 `references` 字段。
* 已在 `docs/IELTS_SOURCE_STYLE_GUIDE.md` 中补充 source-backed article 流程。
* 已在 `docs/PROJECT_RULES.md` 中补充内容架构拆分规则。
* 本阶段未修改业务代码。
* 后续建议：

  * V0.5.0-b：拆分 `ARTICLE_CONTEXT_VOCABULARY` 到 `context-vocabulary.js`；
  * V0.5.0-c：拆分 `RAW_ARTICLES` 到 `articles.js`；
  * V0.5.0-d：用一篇新文章验证 source-backed pipeline。

## V0.5.0-b Split Context Vocabulary Data



- V0.5.0-b 已完成 ARTICLE_CONTEXT_VOCABULARY 拆分。

- 已新增 context-vocabulary.js，用于独立维护文章语境词汇包。

- index.html 已在 script.js 之前加载 context-vocabulary.js。

- script.js 不再内联 ARTICLE_CONTEXT_VOCABULARY 数据，而是通过 window.ARTICLE_CONTEXT_VOCABULARY || {} 读取。

- 本阶段未拆分 RAW_ARTICLES。

- 本阶段未修改文章正文、全局词典、点词弹窗结构、生词本、阅读记录、Quote Splash、复制分享语、publishDate 逻辑。

- node --check script.js 和 context-vocabulary.js 均通过。

- 本地验收通过：

  - 首页、今日推荐、文章库、阅读页正常；

  - 三篇已有语境词汇文章仍可命中文章语境释义；

  - 普通词仍可回退到全局词典；

  - 生词本、完成阅读、读后感、复制分享语正常。

- 后续建议：

  - V0.5.0-c：拆分 RAW_ARTICLES 到 articles.js；

  - V0.5.0-d：用一篇新文章验证 source-backed content pipeline。

## V0.5.0-c Split Articles Data



- V0.5.0-c 已完成 RAW_ARTICLES 拆分。

- 已新增 articles.js，用于独立维护文章数据。

- index.html 已在 script.js 之前加载 articles.js，并保持 context-vocabulary.js 也在 script.js 之前加载。

- script.js 不再内联 RAW_ARTICLES 数据，而是通过 window.RAW_ARTICLES || [] 读取。

- 当前文章数量保持为 10 篇。

- 文章 id 顺序保持不变。

- 本阶段未修改文章正文。

- 本阶段未修改 ARTICLE_CONTEXT_VOCABULARY。

- 本阶段未修改全局词典、点词逻辑、生词本、阅读记录、Quote Splash、复制分享语、publishDate 逻辑。

- node --check articles.js、context-vocabulary.js、script.js 均通过。

- 本地验收通过：

  - Quote Splash 正常；

  - 今日推荐正常；

  - 文章库显示 10 篇文章；

  - 阅读页正常；

  - 三篇语境词汇文章仍可命中文章语境释义；

  - 普通词仍可回退到全局词典；

  - 生词本、完成阅读、读后感、复制分享语正常。

- 后续建议：

  - V0.5.0-d：用一篇新文章验证 source-backed content pipeline；

  - 后续新增每日文章主要修改 articles.js；

  - 后续补充语境词汇主要修改 context-vocabulary.js。

## V0.5.0-d Source-backed Sponge Cities Article



- V0.5.0-d 已完成第一篇 source-backed article pipeline 试点文章。

- 新增文章：Can Sponge Cities Help Us Live with Floods?

- articleId: can-sponge-cities-help-us-live-with-floods。

- publishDate: 2026-07-03。

- 正文字数：786 words。

- 当前文章总数：11 篇。

- 本轮新增 references: 4 个。

- 本轮在 context-vocabulary.js 中新增 22 个文章语境词汇条目。

- 本轮只修改 articles.js 和 context-vocabulary.js。

- 未修改 script.js、index.html、style.css、docs、旧文章正文、旧文章排序、全局词典、点词逻辑、生词本、阅读记录、Quote Splash、复制分享语。

- node --check articles.js、context-vocabulary.js、script.js 均通过。

- 本地验收通过：

  - 文章库显示 11 篇文章；

  - 新文章可进入阅读页；

  - sponge city、stormwater、green infrastructure、permeable surfaces、rainwater harvesting、runoff 等词可命中文章语境释义；

  - 普通词仍可回退到全局词典；

  - 生词本、完成阅读、读后感、复制分享语正常。

- 本阶段验证了 source-backed content pipeline 的基本闭环：references + 原创文章 + coreWords + article-level contextual vocabulary。

- 注意：references 当前已进入文章数据，但页面暂未单独展示；后续可做 references display。

## V0.5.0-e Display Article References



- V0.5.0-e 已完成阅读页 references 展示。

- 新增 helper: renderArticleReferences(article)。

- references 展示位置：阅读页正文下方、完成阅读/读后感区域之前。

- 只有 article.references 存在且非空时才显示 references 区块。

- 旧文章不会显示空 references 区块。

- 每条 reference 显示 title、source、usage，并在存在 url 时提供 Open source 链接。

- Open source 使用 target="_blank" 和 rel="noopener noreferrer"。

- 本轮只修改 script.js 和 style.css。

- 未修改 articles.js、context-vocabulary.js、index.html、docs、文章正文、references 数据、语境词汇包、词典、点词逻辑、生词本、阅读记录、Quote Splash、复制分享语、localStorage key 和发布逻辑。

- node --check articles.js、context-vocabulary.js、script.js 均通过。

- 本地验收通过：

  - Can Sponge Cities Help Us Live with Floods? 阅读页底部显示 Sources and References；

  - 4 个来源均显示 title、source、usage；

  - Open source 可在新标签页打开；

  - 旧文章不显示空 references 区块；

  - 点词、生词本、完成阅读、读后感、复制分享语正常；

  - 手机端 references 区块不横向溢出。

- V0.5.0 的 source-backed content pipeline 已完成从数据结构到页面展示的闭环。

## V0.5.0 Phase Review

- 已完成 V0.5.0 Source-backed Content Architecture 阶段复盘。
- 已新增 `docs/PHASE_REVIEW_V0.5.md`。
- V0.5.0 已完成：
  - 内容流水线文档；
  - `context-vocabulary.js` 拆分；
  - `articles.js` 拆分；
  - 第一篇 source-backed 文章；
  - references 阅读页展示。
- 当前项目进入更稳定的三层结构：
  - `articles.js`：文章数据；
  - `context-vocabulary.js`：语境词汇；
  - `script.js`：主逻辑。
- 下一阶段建议推进 V0.6.0 Hybrid Dictionary System，重点解决点词释义覆盖率和智能度问题。
- 本阶段只修改 docs，不修改业务代码。

## V0.6.0-b Normalize Lookup Result

- V0.6.0-b 已完成并合并到 `main`。
- 本阶段只标准化 `lookupWordWithContext()` 的返回结构，为后续 Hybrid Dictionary System 打基础。
- 新增 `createLookupResult()` helper。
- `lookupWordWithContext()` 现在统一返回：
  - `entry`
  - `matchedWord`
  - `sourceType`
  - `sourceLabel`
  - `isFallback`
- 当前 `sourceType` 包括：
  - `article-context-phrase`
  - `article-context-word`
  - `local-dictionary`
  - `fallback`
- 本阶段保持查词优先级不变：article context phrase -> article context word -> local dictionary -> fallback。
- 本阶段未修改词典数据、文章数据、点词弹窗 HTML 结构、生词本保存 schema、localStorage key、Quote Splash、复制分享语、阅读记录和发布逻辑。
- `node --check articles.js`、`node --check context-vocabulary.js`、`node --check script.js` 均通过。
- 本地页面验收通过。
- 后续建议进入 V0.6.0-c：拆分 base dictionary，或先做 lookup sourceType 的轻量 UI 展示。

## V0.6.0-c Split Base Dictionary Data

- V0.6.0-c 已完成 base dictionary 静态数据拆分。
- 新增 base-dictionary.js。
- 已将 DICTIONARY_ENTRIES 从 script.js 迁移到 base-dictionary.js，并通过 window.DICTIONARY_ENTRIES 挂载。
- 已将 EXTRA_DICTIONARY_BASE_ENTRIES 从 script.js 迁移到 base-dictionary.js，并通过 window.EXTRA_DICTIONARY_BASE_ENTRIES 挂载。
- index.html 已在 script.js 之前加载 base-dictionary.js。
- buildMockDictionary() 仍保留在 script.js。
- MOCK_DICTIONARY 生成逻辑保持不变。
- lookupWordWithContext()、createLookupResult()、词形还原、点词弹窗、生词本、阅读记录、Quote Splash、复制分享语、localStorage key 均未改动。
- node --check articles.js、context-vocabulary.js、base-dictionary.js、script.js 均通过。
- 本地验收通过：
  - Quote Splash 正常；
  - 今日推荐正常；
  - 文章库正常；
  - 阅读页正常；
  - article context vocabulary 命中正常；
  - local dictionary 命中正常；
  - 词形变化命中正常；
  - 未收录词 fallback 和加入生词本正常；
  - 生词本、完成阅读、读后感、复制分享语、References 正常。
- 当前结构进一步清晰：
  - articles.js：文章数据；
  - context-vocabulary.js：文章语境词汇；
  - base-dictionary.js：基础词典静态数据；
  - script.js：主交互和查词构建逻辑。
- 后续建议推进 V0.6.0-d：优化 fallback message，让未收录词提示更清晰。

## V0.7.0-a MiniMax Context Vocabulary Pipeline Docs

- V0.7.0-a 已开始 MiniMax-assisted vocabulary pipeline。
- 本阶段目标是使用 MiniMax API 辅助生成文章级语境词汇包，而不是直接在前端实时调用 AI。
- 已新增 `docs/MINIMAX_CONTEXT_VOCABULARY_PIPELINE.md`。
- 已新增 `prompts/context-vocabulary-generation.md`。
- 已在 `docs/PROJECT_RULES.md` 中补充 AI 辅助内容生成和密钥安全规则。
- 明确安全规则：MiniMax API Key 不进入前端、不进入仓库、不进入文档、不进入 Prompt 模板。
- 当前推荐路线：
  - 先用 MiniMax 预生成 `context-vocabulary.js` 词汇包草稿；
  - 人工审核后再写入正式数据；
  - 用户点词时继续使用本地静态数据；
  - 后续如需实时 AI 点词，必须通过后端代理或 Serverless Function。
- 本轮只修改 docs 和 prompts，不修改业务代码，也不调用 MiniMax API。

## V0.7.0-b MiniMax Context Vocabulary Generator

- V0.7.0-b 已完成本地 MiniMax 语境词汇生成流程。
- 新增 `tools/generate-context-vocabulary.mjs`，默认使用 `MiniMax-M3`，通过 `MINIMAX_BASE_URL` / `MINIMAX_API_URL` 和环境变量中的 API Key 调用 MiniMax OpenAI-compatible API。
- 新增 `tools/run-minimax-vocabulary.ps1`，支持隐藏输入 API Key、联通测试和草稿生成；Key 只保留在当前进程中，并在脚本结束后清理。
- MiniMax 中国站 Base URL 已确认为 `https://api.minimaxi.com/v1`。
- `.gitignore` 已忽略本地密钥文件和 `generated/` 草稿目录。
- 已完成首个真实生成试点：`How Public Libraries Are Changing in the Digital Age`。
- `MiniMax-M3` 初始生成 36 条草稿；人工审核、纠错和补充后形成 40 条正式文章语境词汇。
- 新增正式词汇包 articleId：`how-public-libraries-are-changing-in-the-digital-age`。
- 人工验收通过：
  - article context phrase 命中正常；
  - article context word 命中正常；
  - 普通词回退 local dictionary 正常；
  - 点词弹窗和生词本兼容。
- 相关提交：
  - `eb66328 Add local MiniMax vocabulary generator`
  - `3c5df97 Support MiniMax base URL configuration`
  - `2182ce0 Add secure MiniMax test wrapper`
  - `870554b Fix MiniMax test endpoint`
  - `f9cef7e Use MiniMax China API endpoint`
  - `7287a41 Add reviewed public libraries context vocabulary`
- API Key 未进入前端、仓库、文档、Prompt、`localStorage` 或 Git 历史。
- 本阶段未接入实时 AI 点词；线上产品继续使用人工审核后的静态词汇包。
- 下一步建议：合并并推送 V0.7.0 分支；之后可按同一流程为其他文章生成和人工审核语境词汇包。

## V0.7.1 Persistent MiniMax Configuration and Heat Vocabulary

- V0.7.1 已完成 MiniMax 本地持久化配置。
- 新增 `.env.example`，用于说明本地 MiniMax 配置格式，不包含真实 API Key。
- 本机使用 `.env.local` 保存 API Key、Base URL 和模型配置；该文件已被 Git 忽略，不会进入仓库。
- `tools/run-minimax-vocabulary.ps1` 现在按以下顺序读取 Key：
  - `.env.local`；
  - 当前进程环境变量；
  - 隐藏输入提示。
- MiniMax 连接测试通过：`MiniMax-M3` at `https://api.minimaxi.com/v1/chat/completions`。
- 已使用持久化配置为 `How Cities Adapt to Extreme Heat` 生成语境词汇草稿。
- 初次生成因重复 `urban heat island` 被质量校验拒绝；重试后生成 31 条草稿。
- 人工审核时完成以下修正：
  - `canopy` 改为正文原词 `canopies`；
  - 不在正文中的 `resilience` 改为核心原词 `adaptation`；
  - 移除例句中没有来源支撑的具体温差表述。
- 新增正式词汇包 articleId：`how-cities-adapt-to-extreme-heat`，共 31 条：
  - 13 个短语；
  - 18 个单词。
- 校验通过：无重复、无缺失字段、所有 term 均能在文章正文中命中，例句未复制正文。
- 人工页面验收通过。
- 相关提交：
  - `de3eb81 Support persistent local MiniMax configuration`
  - `fee91e7 Add reviewed heat adaptation context vocabulary`
- API Key 未进入前端、Git、文档、Prompt、`localStorage` 或正式词汇数据。
- 线上产品仍使用人工审核后的静态词汇包，不在浏览器端直接调用 MiniMax API。

## Content Validation Guard

- 新增零依赖内容校验工具 `tools/validate-content.mjs`。
- 默认运行命令：`node tools/validate-content.mjs`。
- 校验范围包括文章结构、文章 ID、发布日期、难度格式、750–900 词长度、中文乱码、语境词汇结构、重复词条和来源链接。
- 字段缺失、重复 ID / 日期、字数越界、难度格式错误、连续问号、Unicode 替换字符、无中文释义和非法来源链接会阻断校验。
- 历史内容问题默认作为 warning；使用 `--strict` 时 warning 也会导致失败。
- 当前基线：12 篇文章、7 个语境词汇包、186 条语境词汇、8 条 references，硬错误为 0。
- 当前已识别的历史 warning：1 条中文释义混入异常字符、38 个语境词未在正文逐字出现、5 篇文章缺少专属语境词包。
- 已通过内存故障注入验证：难度问号、连续问号、字数越界、重复文章 ID、重复发布日期和非法引用 URL 均会被正确拦截。
- 本阶段未修改文章、词典数据、UI、localStorage、入口文件或线上运行逻辑。

## V0.7.2 Complete Context Vocabulary Coverage

- 12 篇正式文章的文章级语境词汇包已全部补齐。
- 本阶段新增 3 个经过人工审核的词汇包：
  - `the-history-of-timekeeping`：20 条；
  - `why-fungi-matter-to-life-on-earth`：20 条；
  - `how-sensors-changed-modern-farming`：20 条。
- 当前内容基线：12 篇文章、12 个语境词汇包、286 条语境词汇、8 条 references。
- `node tools/validate-content.mjs --verbose` 已通过，语境词汇包缺失 warning 已清零。
- 所有新增 term 均能在对应文章正文中逐字命中，无同包重复，中文内容保持 UTF-8。
- 375px 手机端回归通过：三篇文章均能命中文章级语境释义，生词添加、展示和删除正常，原有生词未受影响，控制台无错误。
- 业务数据提交：`c775301 Complete contextual vocabulary coverage`。
- 本阶段业务改动只涉及 `context-vocabulary.js`，未修改文章正文、全局词典、UI、点词逻辑或 `localStorage` key。

## V0.8.0 Local Data Backup and Restore

- 生词本页面已新增“备份与恢复”入口，支持导出生词和阅读记录为带版本号的 JSON 文件。
- 导入流程包含 2MB 文件限制、格式与版本检查、记录数量限制、数据规范化、数量预览、用户确认和取消操作。
- 确认导入后会用备份替换当前设备上的生词与阅读记录；双存储写入失败时会尝试恢复原值，页面状态不会提前切换。
- 现有存储键保持不变：`ielts-knowledge-reader.vocab.v1` 与 `ielts_reader_reading_records`。
- 业务提交：`4ffc6b7 Add local data backup and restore`。
- 375px 手机端验收通过：真实备份下载、有效文件预览与恢复、错误 JSON 拦截、取消恢复均正常。
- 完整回归通过：首页、文章库筛选、阅读页、点词、刷新后生词保留、熟悉程度、删除、完成阅读、读后感和复制分享语正常；控制台无错误。
- 本阶段未修改文章、上下文词汇、基础词典、查词规则、`index.html`、`style.css` 或现有 `localStorage` 键名。

## V0.8.1 Mobile Home Screen Guide

- 今日推荐页已新增可展开的“手机使用说明”，分别说明 iPhone / iPad Safari 与 Android Chrome 添加到主屏幕的操作路径。
- 引导明确说明当前版本仍需联网使用，生词和阅读记录只保存在当前浏览器；换设备前应使用生词本的“备份与恢复”。
- 本阶段复用现有按钮、卡片和隐藏状态样式，只修改 `script.js`，未修改 `index.html` 或 `style.css`。
- 本阶段未引入 Web App Manifest、Service Worker、离线缓存、安装检测、后端或新的 `localStorage` 键。
- 业务提交：`213fc44 Add mobile home screen guide`。
- 静态校验通过：4 个 JavaScript 文件语法正常；12 篇文章、12 个语境词汇包和 286 条语境词汇通过内容校验。
- 375px 手机端验收通过：说明入口、展开与收起状态、iOS / Android 文案和排版正常。
- 完整回归通过：今日推荐、文章库筛选与打开、阅读页、点词释义、生词加入、刷新保留、熟悉程度、删除、完成阅读、读后感和复制分享语正常；控制台无错误。
- 测试期间临时加入的单词已删除，验收结束时原有 2 个生词和 1 条阅读记录保持不变。

## V0.9.0 Installable Offline PWA Foundation

- 项目已从普通手机端 H5 增强为基础 PWA，仍保持纯静态 GitHub Pages 架构，不引入后端、账号或新的业务存储。
- 新增 `manifest.webmanifest`，包含应用名称、相对 `start_url` / `scope`、standalone 显示模式、主题色以及 192px / 512px PNG 图标。
- 新增 180px Apple Touch Icon，并保留可维护的 `icons/app-icon.svg` 图标源文件。
- 新增 `sw.js`，首次在线访问时缓存完整应用壳、12 篇内置文章、词典数据、Manifest 和图标。
- Service Worker 采用“在线优先、离线回退”策略：联网时获取并更新缓存，断网时使用已缓存内容；导航失败时回退到缓存的 `index.html`。
- 缓存清理只处理 `ielts-knowledge-reader-` 前缀，避免影响同一 GitHub Pages 域名下的其他项目。
- `script.js` 已增加安全的 Service Worker 注册；直接以 `file://` 打开时会跳过注册，原有页面功能不受影响。
- 手机使用说明已更新：首次在线加载后支持基础离线阅读；离线时不能获取新版本；生词和阅读记录仍只保存在当前浏览器。
- 业务提交：`edcf8a3 Add installable offline PWA foundation`。
- 静态校验通过：Manifest JSON、5 个 JavaScript 文件语法、12 篇文章、12 个语境词汇包和 286 条语境词汇均正常。
- 375px 手机端验收通过：Manifest 与 Apple Touch Icon 正确挂载，PWA 说明排版正常，控制台无错误。
- 真实离线验收通过：关闭本地静态服务后刷新页面，今日推荐、内置文章、点词释义和文章库标签筛选仍可使用。
- 完整在线回归通过：生词加入、刷新保留、熟悉程度、删除、完成阅读、读后感和复制分享语正常；测试结束时原有 2 个生词和 1 条阅读记录保持不变。
- 当前环境无法直接验证 iOS / Android 操作系统最终安装界面；正式部署后需在真实 Safari 和 Chrome 上各完成一次“添加到主屏幕”验收。
