# Source-backed Content Pipeline

## 1. Purpose

This process upgrades daily articles from ordinary original IELTS-style articles to source-backed English knowledge articles that deliver both IELTS reading practice and genuine knowledge growth. It gives each new article a clear path from reference research to original writing, contextual vocabulary, local verification, and commit.

The goal is to make every article pass two gates: it must be useful for IELTS reading practice, and it must leave the reader with accurate, memorable knowledge. Future content should also be traceable, reliable, and maintainable.

## 2. Core Principle

- Articles must be original.
- Every article must begin with one clear knowledge question and end with 2–4 reviewable knowledge takeaways.
- Reading difficulty and knowledge value are separate quality gates; passing one does not compensate for failing the other.
- Multiple sources may be used for topics, factual points, structure, and terminology.
- Copying, translating, or closely rewriting a single source is forbidden.
- `references` records reference sources only; it does not mean the article is republished, translated, or adapted from those sources.
- Legacy articles must not receive fabricated sources after the fact.
- Legacy articles should not be packaged as if they came from a specific source.

## 3. New Article Workflow

1. 确定主题，并写出一个核心知识问题；
2. 搜集 2–4 个参考来源；
3. 提炼事实点、概念关系、限制条件和 2–4 个预期知识收获；
4. 设计 IELTS-style 篇章结构和阅读训练点；
5. 写成原创 IELTS-style 英文知识文章；
6. 生成聚焦核心知识的 `summaryZh` / `summaryEn`；
7. 生成 `coreWords`；
8. 生成 `ARTICLE_CONTEXT_VOCABULARY`；
9. 填写 `references`；
10. 分别执行阅读训练价值、知识价值、事实与版权审核；
11. 本地验收；
12. 提交。

## 4. References Field

Recommended structure:

```js
references: [
  {
    title: '',
    source: '',
    url: '',
    usage: ''
  }
]
```

- `title`: 参考材料标题；
- `source`: 来源站点、期刊、机构或媒体；
- `url`: 原始链接；
- `usage`: 该来源用于主题、事实点、背景、结构或词汇，不代表改写原文。

## 5. Legacy Article Policy

- 旧文章不强制补 `references`；
- 不允许为了“看起来有来源”而补假来源；
- 旧文章可以没有 `references`；
- 如确需说明，可使用 `sourceNote`：

```text
Legacy original IELTS-style article; references not backfilled.
```

- 不要把已有原创模拟文章伪装成具体来源文章。

## 6. Validation Checklist

- 是否有一个清晰、值得理解的核心知识问题；
- 用户读后是否能准确复述 2–4 个关键知识点；
- 是否同时通过阅读训练价值和知识价值两道门槛；
- 摘要是否直接呈现核心知识，而不是只介绍文章结构；
- 新文章是否有 2–4 个来源；
- `references` 是否真实可追溯；
- 文章是否原创；
- 是否避免近似改写；
- 是否 750–900 words；
- 是否有 `summaryZh` / `summaryEn`；
- 是否有 `coreWords`；
- 是否有 article-level contextual vocabulary；
- 是否 `node --check` 通过；
- 是否不影响今日推荐、文章库、阅读页、点词、生词本、完成阅读、读后感、Quote Splash、复制分享语。
