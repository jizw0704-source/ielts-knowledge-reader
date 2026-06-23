# PROJECT_MEMORY.md｜IELTS Knowledge Reader 项目记忆

## 1. 项目定位

IELTS Knowledge Reader 是一个面向雅思阅读能力提升的英文知识阅读器，当前定位为手机端 H5 静态应用。它不是 IELTS / Cambridge IELTS 真题售卖平台，而是原创 IELTS-style 英文知识阅读工具。

## 2. 当前部署与仓库

* 本地目录：Y:\codex\ielts-knowledge-reader
* GitHub 仓库：https://github.com/jizw0704-source/ielts-knowledge-reader.git
* GitHub Pages 地址：https://jizw0704-source.github.io/ielts-knowledge-reader/
* 当前线上 main 仍保持稳定版本，开发分支暂不自动合并 main

## 3. 已完成版本

* V0.1：基础 H5 阅读器，包含首页、阅读页、文章库、点词释义、生词本、localStorage 存储、微信端访问
* V0.2：阅读记录增强，包含单词数、建议阅读时长、完成阅读、读后感、文章库已读状态
* V0.2.1：词典框架，包含 mockDictionary 扩充、词形还原、未收录词提示、词汇覆盖检查函数
* V0.2.2：文章规范文档，明确每篇文章 750–900 words、原创 IELTS-style、版权边界
* V0.2.3-a：扩写 How Cities Adapt to Extreme Heat，约 893 words
* V0.2.3-b：扩写 The Hidden Intelligence of Plants，约 887 words
* V0.2.3-c：扩写 The History of Timekeeping，约 819 words

## 4. 当前关键决策

1. 不使用真实 IELTS / Cambridge IELTS 原文；
2. 不售卖未经授权的真题原文；
3. 内置文章采用原创 IELTS-style；
4. 每篇正式文章目标长度为 750–900 words；
5. 当前阶段不做后端、登录、云同步、AI 接口；
6. 当前存储继续使用 localStorage；
7. 每一轮只做一个小目标；
8. 不再随意大改 style.css；
9. 不同时修改文章、词典、UI 和存储逻辑。

## 5. 已知坑点与注意事项

1. 手机微信 WebView 可能缓存旧版 script.js / style.css；
2. 如果微信端显示旧版本，优先清缓存或增加 URL 版本参数；
3. 后续建议给 index.html 中的 script.js / style.css 引用加版本号；
4. 之前颜色系统修改曾导致按钮和弹窗交互异常；
5. 后续 UI 修改必须小步进行；
6. 不要使用宽泛 CSS 选择器，例如 `[class*="modal"]`；
7. Codex 临时检查文件不得留在项目外或纳入提交；
8. 每次提交前必须确认 git status 只包含预期文件。

## 6. 当前待办

1. V0.2.4：基于三篇长文做词典覆盖补齐；
2. V0.2.5：增加 script.js / style.css 版本参数，降低微信缓存问题；
3. V0.2.6：合并到 main 并上线 GitHub Pages；
4. 后续可考虑每日一句、再推荐一篇、用户导入文章、来源记录、类似文章推荐。

## 7. 每轮开发前必读文件

1. Y:\codex\AGENTS.md
2. AGENTS.md
3. docs/PROJECT_RULES.md
4. docs/REGRESSION_CHECKLIST.md
5. docs/ARTICLE_SPEC.md
6. docs/PROJECT_MEMORY.md
7. README.md

## 8. 更新规则

* PROJECT_MEMORY.md 只在重要节点更新；
* 不记录无意义流水账；
* 不记录隐私信息、账号密码、API Key；
* 每次完成重要版本、踩坑或改变路线时再更新；
* 更新项目记忆应作为独立小任务，不与业务代码混在一起。
