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

