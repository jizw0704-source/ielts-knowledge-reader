# IELTS Source Style Guide

## 1. 目标

本指南用于约束 IELTS Knowledge Reader 后续每日文章的选题、来源风格、结构和版权边界，让文章更接近 IELTS Academic Reading 的真实阅读材料气质，但仍保持原创。

## 2. IELTS Academic Reading 来源特征

IELTS Academic Reading 的材料常见来源包括 books, journals, magazines, newspapers, online resources 等，通常面向受过教育但非专业的普通读者。主题覆盖科学、社会、历史、环境、技术、教育、文化、心理、城市等方向。

## 3. 推荐参考来源池

以下来源类型可作为选题、结构、事实点和表达方式的参考，但不得直接复制或近似改写原文。

### Science / Technology

- New Scientist
- Scientific American
- BBC Future
- MIT Technology Review
- Nature News / Nature Features
- Smithsonian Magazine
- Nautilus

### Environment / Ecology

- National Geographic
- The Conversation
- World Resources Institute
- UNEP
- FAO
- NASA Earth Observatory

### Society / Cities / Public Health

- The Guardian
- The Economist
- BBC Worklife / BBC Future
- WHO
- OECD
- university research news

### Culture / History / Psychology

- Aeon
- Psyche
- Smithsonian Magazine
- university museum / research pages
- history and archaeology magazines

## 4. 选题标准

每日文章选题应满足：

1. 有知识密度；
2. 适合非专业读者；
3. 有明确问题意识；
4. 能形成 750–900 words 的结构化文章；
5. 有适合 IELTS 6.5–7.0 的词汇和句式；
6. 可提炼 8–15 个核心词汇；
7. 避免过度新闻化、热点化、营销化。

## 5. 写作原则

1. 生成原创文章，不复制、不改写、不翻译原文；
2. 可以参考多个来源的主题、事实点和结构风格；
3. 文章应接近 IELTS Academic Reading 风格；
4. 语言客观，信息密度适中；
5. 不写成鸡汤文、博客文或营销文；
6. 每篇文章应有清晰标题、英文摘要、中文摘要、核心词汇；
7. 文章应适合点词学习和语境词汇包扩展。

## 6. 版权与引用边界

1. 禁止复制原文段落；
2. 禁止近似改写单一来源；
3. 禁止使用受版权保护文章的大段表达；
4. 可以记录参考来源；
5. 每篇文章应保持原创表达；
6. 如引用具体事实、数据或研究结论，应记录来源；
7. 后续建议在文章对象中增加 `references` 字段。

## 7. 后续文章生成流程建议

新文章应优先遵循 `docs/CONTENT_PIPELINE.md`。参考来源用于启发主题、事实点、结构和术语，不用于复制、翻译或近似改写。

每篇新文章建议使用 2–4 个参考来源，并保持原创 IELTS-style 表达。

1. 先确定主题；
2. 搜集 2–4 个参考来源；
3. 提炼事实点和结构；
4. 生成原创 IELTS-style 文章；
5. 生成 `summaryZh` / `summaryEn` / `coreWords`；
6. 生成 article-level contextual vocabulary；
7. 检查版权风险；
8. 写入文章数据；
9. 本地验收。

## 8. 推荐新增字段

建议后续文章对象增加：

```ts
references: [
  {
    title: '',
    source: '',
    url: '',
    usage: ''
  }
]
```

`references` 只记录来源参考，不代表文章转载或改写。

## 9. 与当前项目的关系

1. 当前已有文章仍保留；
2. 后续新增文章优先按照本指南生成；
3. 暂不强制回改旧文章；
4. 后续可逐步为旧文章补充 `references` 和 contextual vocabulary；
5. 本指南应与 `ARTICLE_SPEC.md` 和 `PROJECT_RULES.md` 配合使用。
