# Phase Review V0.5.0 - Source-backed Content Architecture

## 1. Phase Goal

V0.5.0 的核心目标是把 IELTS Knowledge Reader 从单一 `script.js` 承载全部内容，升级为更清晰、更可维护的内容架构。

- `articles.js` 维护文章数据；
- `context-vocabulary.js` 维护文章语境词汇包；
- `script.js` 维护页面逻辑、点词逻辑、生词本、阅读记录、Quote Splash、复制分享语等主功能；
- 新文章开始支持 `references`；
- 阅读页可以展示 Sources and References。

这个阶段不是为了增加大量新功能，而是为了让后续每日文章、来源记录和语境词汇扩展更稳。

## 2. Completed Milestones

### V0.5.0-a Content Architecture Documentation

- 新增或更新 `CONTENT_PIPELINE.md`；
- 明确 source-backed content pipeline；
- 明确 `references` 字段规则；
- 明确旧文章不伪造来源；
- 明确新增文章流程。

### V0.5.0-b Split Context Vocabulary

- 新增 `context-vocabulary.js`；
- 从 `script.js` 拆出 `ARTICLE_CONTEXT_VOCABULARY`；
- 现有三篇语境词汇文章保持可用；
- 点词行为保持不变。

### V0.5.0-c Split Articles Data

- 新增 `articles.js`；
- 从 `script.js` 拆出 `RAW_ARTICLES`；
- 当前文章数量保持 10 篇；
- 首页、文章库、阅读页、`publishDate` 逻辑保持正常。

### V0.5.0-d Source-backed Sponge Cities Article

- 新增 `Can Sponge Cities Help Us Live with Floods?`；
- 新增 `references` 字段；
- 新增对应 article-level contextual vocabulary；
- 当前文章数量变为 11 篇；
- 验证 source-backed content pipeline 基本闭环。

### V0.5.0-e Display Article References

- 新增 `renderArticleReferences(article)`；
- 阅读页底部展示 Sources and References；
- 旧文章不显示空 references 区块；
- 新文章来源可见、可追溯。

## 3. Current Architecture

- `index.html`：静态入口，按顺序加载 `articles.js`、`context-vocabulary.js`、`script.js`；
- `articles.js`：文章数据层；
- `context-vocabulary.js`：文章级语境词汇层；
- `script.js`：主交互逻辑层；
- `style.css`：样式层；
- `docs/`：项目规范、内容流水线、阶段复盘和项目记忆。

## 4. What Improved

- `script.js` 明显减负；
- 后续新增文章主要改 `articles.js`；
- 后续补充语境词汇主要改 `context-vocabulary.js`；
- 主逻辑文件更稳定；
- `references` 让内容可信度提升；
- source-backed article pipeline 已经跑通；
- 以后更适合长期维护和 Codex 小步开发。

## 5. Remaining Issues

- 点词覆盖率仍有限；
- 当前本地词典仍然不够全面；
- `references` 目前只展示，不参与搜索、筛选或文章质量评分；
- 旧文章没有 `references`，保持诚实但内容可信度弱于新文章；
- 文章生成仍依赖人工或 Codex 手动流程；
- 手机微信访问仍可能受网络环境影响。

## 6. Next Recommended Phase

下一阶段建议进入 V0.6.0 Hybrid Dictionary System。

目标是把点词升级成：

1. article-level contextual vocabulary 优先；
2. local base dictionary 兜底；
3. 后续预留 online dictionary / AI fallback。

下一阶段不要急着接外部 API，先做本地基础词典和查词架构，让静态版本继续保持稳定。

## 7. Validation Summary

V0.5.0 阶段验收重点：

- `node --check articles.js` 通过；
- `node --check context-vocabulary.js` 通过；
- `node --check script.js` 通过；
- Quote Splash 正常；
- 今日推荐正常；
- 文章库正常；
- 阅读页正常；
- 语境词汇正常；
- 普通词回退全局词典正常；
- 生词本、完成阅读、读后感、复制分享语正常；
- References 展示正常；
- 旧文章不显示空 references 区块。

## 8. Development Discipline

本阶段有效的开发纪律：

- 先定位，再修改；
- 每次只做一个小目标；
- 拆分任务必须分阶段；
- 每阶段保留独立 commit；
- 工作区不干净时停止；
- 不伪造 `references`；
- 不为旧文章硬补来源；
- 不让 Codex 一次性大改所有结构。
