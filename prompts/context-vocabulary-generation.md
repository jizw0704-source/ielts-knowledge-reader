# Prompt - Generate Article Context Vocabulary

你是一名 IELTS 阅读词汇教练。请根据下方文章，为 IELTS Knowledge Reader 生成文章级语境词汇包。

## Requirements

1. 目标读者为 IELTS 6.0–7.0 学习者。
2. 生成 20–40 个词或短语条目。
3. 优先选择：
   - 学术词；
   - 主题词；
   - 文章高频词；
   - 固定搭配；
   - IELTS 常见同义替换和改写表达；
   - 有助于理解文章关键句的词或短语。
4. 避免 `very`、`good`、`people`、`make` 等过于基础的词。
5. 不要生成与文章无关的词。
6. 每个条目必须包含：
   - `term`
   - `type`
   - `definitionZh`
   - `definitionEn`
   - `example`
7. `type` 只能是 `phrase` 或 `word`。
8. `definitionZh` 必须解释该词在本文语境中的含义，而不只是普通词典释义。
9. `definitionEn` 使用简洁自然的英文解释。
10. `example` 使用原创、自然、便于学习的英文例句，不要复制文章长句。
11. 输出必须是可粘贴到 `context-vocabulary.js` 的 JavaScript 数组格式。
12. 不要使用 Markdown 表格。
13. 不要输出分析过程、说明、标题或数组以外的文字。
14. 不要虚构文章没有提供的来源、数据或研究结论。

## Input

```text
ARTICLE_ID:
{{ARTICLE_ID}}

TITLE:
{{TITLE}}

SUMMARY:
{{SUMMARY}}

CORE_WORDS:
{{CORE_WORDS}}

ARTICLE_TEXT:
{{ARTICLE_TEXT}}

REFERENCES:
{{REFERENCES}}
```

## Output Example

```js
[
  {
    term: 'sponge city',
    type: 'phrase',
    definitionZh: '海绵城市；本文中指通过绿地、湿地和透水铺装等方式吸收、储存并管理雨水的城市规划理念。',
    definitionEn: 'An urban planning approach that uses natural and permeable surfaces to absorb, store, and manage rainwater.',
    example: 'A sponge city can reduce flood risk by slowing rainwater before it reaches drainage systems.',
  },
]
```
