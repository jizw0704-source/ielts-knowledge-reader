# PROJECT\_MEMORY.md｜IELTS Knowledge Reader 项目记忆

## 1\. 项目定位

IELTS Knowledge Reader 是一个面向雅思阅读能力提升的英文知识阅读器，当前定位为手机端 H5 静态应用。它不是 IELTS / Cambridge IELTS 真题售卖平台，而是原创 IELTS-style 英文知识阅读工具。

## 2\. 当前部署与仓库

* 本地目录：`Y:\\\\\\\\codex\\\\\\\\ielts-knowledge-reader`
* GitHub 仓库：[https://github.com/jizw0704-source/ielts-knowledge-reader.git](https://github.com/jizw0704-source/ielts-knowledge-reader.git)
* GitHub Pages 地址：[https://jizw0704-source.github.io/ielts-knowledge-reader/](https://jizw0704-source.github.io/ielts-knowledge-reader/)
* 当前线上 `main` 已保持稳定版本，开发分支不自动合并 `main`

## 3\. 已完成版本

* V0.1：基础 H5 阅读器，包含首页、阅读页、文章库、点词释义、生词本、localStorage 存储、微信端访问
* V0.2：阅读记录增强，包含单词数、建议阅读时长、完成阅读、读后感、文章库已读状态
* V0.2.1：词典框架，包含 mockDictionary 扩充、词形还原、未收录词提示、词汇覆盖检查函数
* V0.2.2：文章规范文档，明确每篇文章 750–900 words、原创 IELTS-style、版权边界
* V0.2.3-a：扩写 `How Cities Adapt to Extreme Heat`，约 893 words
* V0.2.3-b：扩写 `The Hidden Intelligence of Plants`，约 887 words
* V0.2.3-c：扩写 `The History of Timekeeping`，约 819 words
* V0.2.4：三篇长文词典覆盖补齐，当前稳定版本已上线并作为正式可用基线

## 4\. 当前关键决策

1. 不使用真实 IELTS / Cambridge IELTS 原文。
2. 不售卖未经授权的真题原文。
3. 内置文章采用原创 IELTS-style。
4. 每篇正式文章目标长度为 750–900 words。
5. 当前阶段不做后端、登录、云同步、AI 接口。
6. 当前存储继续使用 localStorage。
7. 每一轮只做一个小目标。
8. 不再随意大改 `style.css`。
9. 不同时修改文章、词典、UI 和存储逻辑。

## 5\. 已知坑点与注意事项

1. 手机微信 WebView 可能缓存旧版 `script.js` / `style.css`。
2. 如果微信端显示旧版本，优先清缓存或增加 URL 版本参数。
3. 后续如需更新静态资源引用，要非常谨慎，优先小范围验证。
4. 之前颜色系统修改曾导致按钮和弹窗交互异常。
5. 后续 UI 修改必须小步进行。
6. 不要使用宽泛 CSS 选择器，例如 `\\\\\\\[class\\\\\\\*="modal"]`。
7. Codex 临时检查文件不得留在项目外或纳入提交。
8. 每次提交前必须确认 `git status` 只包含预期文件。

## 6\. 当前待办

1. V0.2.5：`script.js` / `style.css` 版本参数优化与微信缓存问题进一步验证。
2. V0.3.0：日历看板。
3. V0.3.1：每日一句。
4. V0.3.2：阅读完成页增强。
5. V0.3.3：新增第 4 篇长文。

## 7\. 每轮开发前必读文件

1. `Y:\\\\\\\\codex\\\\\\\\AGENTS.md`
2. `AGENTS.md`
3. `docs/PROJECT\\\\\\\_RULES.md`
4. `docs/REGRESSION\\\\\\\_CHECKLIST.md`
5. `docs/ARTICLE\\\\\\\_SPEC.md`
6. `docs/PROJECT\\\\\\\_MEMORY.md`
7. `README.md`

## 8\. 更新规则

* `PROJECT\\\\\\\_MEMORY.md` 只在重要节点更新。
* 不记录无意义流水账。
* 不记录隐私信息、账号密码、API Key。
* 每次完成重要版本、踩坑或改变路线时再更新。
* 更新项目记忆应作为独立小任务，不与业务代码混在一起。

## 9\. 当前稳定版本说明

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

## 10\. V0.2.5 暂停记录

* V0.2.5 cache versioning 曾尝试通过调整 `index.html` 的资源引用版本号来降低微信缓存问题。
* 由于修改 `index.html` 后出现乱码，已回退并暂停。
* 当前结论：后续不要轻易修改 `index.html` 的资源引用，若确需调整，必须先做最小范围验证和明确回退方案。

## 11\. V0.3 方向

下一阶段进入 V0.3，优先方向如下：

1. V0.3.0：日历看板。
2. V0.3.1：每日一句。
3. V0.3.2：阅读完成页增强。
4. V0.3.3：新增第 4 篇长文。

## 12\. 版本推进原则

* 先保证稳定，再做扩展。
* 每次只改一个明确的小目标。
* 每次修改前都先确认规则文档。
* 每次提交前都先确认只包含预期文件。
* 如果需要修改视觉、缓存或资源引用，优先做小范围、可回退的变更。

## 13\. V0.3.0 Guardrail Record

* The first V0.3.0 scheduled-content attempt failed.
* The failure was caused by an over-broad `script.js` edit that accidentally touched `summaryZh`, `mockDictionary`, and the word-lookup logic, and it also caused `node --check` to fail.
* The failed diff was backed up to `Y:\\\\\\\\codex\\\\\\\\v030-scheduled-content-broken.diff`.
* `script.js` has been rolled back and the repository is back to a clean state.
* The team will now use a safer workflow: read-only locating -> minimal patch -> diff review -> functional verification -> commit.
* Future V0.3.0 work must restart from the clean baseline.
* \## V0.3.0 Scheduled Content Record
* 
* \- V0.3.0 scheduled content release logic 已完成。
* \- commit: 17b1090 Add scheduled content release logic。
* \- 本轮采用“只读定位 → 最小 patch → diff 审查 → 功能验收 → 提交”的受控 patch 流程。
* \- 本轮实现内容：
* &#x20; - 三篇文章新增 publishDate 字段；
* &#x20; - 首页今日推荐基于已发布文章；
* &#x20; - 文章库默认只显示已发布文章；
* &#x20; - openArticle 会阻止未发布文章通过普通入口打开；
* &#x20; - 不涉及后端、登录、云同步、AI 自动生成。
* \- 本轮人工验收通过：
* &#x20; - 电脑端正常；
* &#x20; - 手机微信端正常；
* &#x20; - 首页、文章库、阅读页、点词、生词本、完成阅读、读后感均正常。
* \- 下一步建议：
* &#x20; - 合并 main 并上线；
* &#x20; - 后续新增第 4 篇未来日期文章，用于验证真正的定时解锁。
* \## V0.3.1 Future Article Record
* 
* \- V0.3.1 新增第 4 篇未来日期文章已完成。
* \- commit: 4842f41 Add future sleep and memory article。
* \- 新增文章：
* &#x20; - id: the-science-of-sleep-and-memory
* &#x20; - title: The Science of Sleep and Memory
* &#x20; - publishDate: 2026-06-30
* &#x20; - word count: 858
* \- 本轮只修改 script.js 中 RAW\_ARTICLES 数据区。
* \- 未修改前三篇文章。
* \- 未修改 index.html、style.css、README.md、docs、词典、点词逻辑、生词本逻辑、阅读记录逻辑或 localStorage key。
* \- 当前日期为 2026-06-25 时，新文章不会出现在首页和文章库，这是预期行为。
* \- 本轮人工验收重点：
* &#x20; - 首页不显示未来文章；
* &#x20; - 文章库不显示未来文章；
* &#x20; - 前三篇文章正常；
* &#x20; - 点词、生词本、完成阅读、读后感正常。
* \- 后续方向：
* &#x20; - 继续扩展为 7 天文章池；
* &#x20; - 再进行 articles.js 文章数据拆分，为 AI 自动生成草稿做准备。

