# PROJECT_MEMORY.md｜IELTS Knowledge Reader 项目记忆

## 1. 项目定位

IELTS Knowledge Reader 是一个面向雅思阅读能力提升的英文知识阅读器，当前定位为手机端 H5 静态应用。它不是 IELTS / Cambridge IELTS 真题售卖平台，而是原创 IELTS-style 英文知识阅读工具。

## 2. 当前部署与仓库

- 本地目录：`Y:\codex\ielts-knowledge-reader`
- GitHub 仓库：<https://github.com/jizw0704-source/ielts-knowledge-reader.git>
- GitHub Pages 地址：<https://jizw0704-source.github.io/ielts-knowledge-reader/>
- 当前线上 `main` 已保持稳定版本，开发分支不自动合并 `main`

## 3. 已完成版本

- V0.1：基础 H5 阅读器，包含首页、阅读页、文章库、点词释义、生词本、localStorage 存储、微信端访问
- V0.2：阅读记录增强，包含单词数、建议阅读时长、完成阅读、读后感、文章库已读状态
- V0.2.1：词典框架，包含 mockDictionary 扩充、词形还原、未收录词提示、词汇覆盖检查函数
- V0.2.2：文章规范文档，明确每篇文章 750–900 words、原创 IELTS-style、版权边界
- V0.2.3-a：扩写 `How Cities Adapt to Extreme Heat`，约 893 words
- V0.2.3-b：扩写 `The Hidden Intelligence of Plants`，约 887 words
- V0.2.3-c：扩写 `The History of Timekeeping`，约 819 words
- V0.2.4：三篇长文词典覆盖补齐，当前稳定版本已上线并作为正式可用基线

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

- `PROJECT_MEMORY.md` 只在重要节点更新。
- 不记录无意义流水账。
- 不记录隐私信息、账号密码、API Key。
- 每次完成重要版本、踩坑或改变路线时再更新。
- 更新项目记忆应作为独立小任务，不与业务代码混在一起。

## 9. 当前稳定版本说明

- V0.2.4 已上线，是当前稳定版本。
- GitHub Pages 已通过电脑端浏览器和手机微信内置浏览器验收。
- 当前稳定 tag 为 `v0.2.4-stable`。
- V0.2.4 包含：
  - 三篇 750–900 words 的原创 IELTS-style 长文；
  - 阅读记录；
  - 建议阅读时长；
  - 完成阅读；
  - 读后感；
  - 点词释义；
  - 生词本；
  - 三篇长文词典覆盖补齐；
  - 项目记忆文档。

## 10. V0.2.5 暂停记录

- V0.2.5 cache versioning 曾尝试通过调整 `index.html` 的资源引用版本号来降低微信缓存问题。
- 由于修改 `index.html` 后出现乱码，已回退并暂停。
- 当前结论：后续不要轻易修改 `index.html` 的资源引用，若确需调整，必须先做最小范围验证和明确回退方案。

## 11. V0.3 方向

下一阶段进入 V0.3，优先方向如下：

1. V0.3.0：日历看板。
2. V0.3.1：每日一句。
3. V0.3.2：阅读完成页增强。
4. V0.3.3：新增第 4 篇长文。

## 12. 版本推进原则

- 先保证稳定，再做扩展。
- 每次只改一个明确的小目标。
- 每次修改前都先确认规则文档。
- 每次提交前都先确认只包含预期文件。
- 如果需要修改视觉、缓存或资源引用，优先做小范围、可回退的变更。
