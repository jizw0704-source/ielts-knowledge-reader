# MiniMax Context Vocabulary Pipeline

## 1. Purpose

本流程用于借助 MiniMax 为 IELTS Knowledge Reader 预生成文章级语境词汇包。MiniMax 不连接 GitHub Pages 前端，API Key 不进入仓库，也不进入浏览器代码。

生成结果必须经过人工审核，确认释义、例句、格式和版权边界后，才可以写入 `context-vocabulary.js`。用户点词时继续读取本地静态数据，因此现有 GitHub Pages 部署不依赖 AI 服务的实时可用性。

## 2. Why Not Real-time AI Lookup Yet

- GitHub Pages 是静态托管，无法安全隐藏 API Key。
- 实时查词会引入费用、延迟、限流和服务稳定性问题。
- 安全的在线 AI 查词需要 Vercel Serverless Function、Cloudflare Worker 或其他后端代理。
- 当前阶段优先使用 AI 预生成词汇包，再由人工审核并发布为本地静态数据。

## 3. Recommended Lookup Layers

推荐的 Hybrid Dictionary 查询层级：

1. article-level contextual vocabulary；
2. local base dictionary；
3. AI-generated contextual vocabulary expansion；
4. future server-side AI fallback。

V0.7.0 重点建设第 3 层：在开发阶段用 AI 扩充文章语境词汇，不改变用户端现有查词链路。

## 4. Input to MiniMax

每次生成应提供：

- article id；
- title；
- full article text；
- `summaryZh` / `summaryEn`；
- `coreWords`；
- `references`，如文章已有来源；
- 目标难度：IELTS 6.5–7.0；
- 目标词汇数量：20–40；
- 输出格式：可写入 `context-vocabulary.js` 的 JavaScript 数组条目。

不要向模型提供 API Key、用户数据、生词本数据或其他隐私信息。

## 5. Output Requirements

每个词汇条目必须包含：

```js
{
  term: '',
  type: 'phrase',
  definitionZh: '',
  definitionEn: '',
  example: ''
}
```

要求：

- `type` 只能是 `phrase` 或 `word`；
- 优先选择学术词、主题词、固定搭配、文章高频词和 IELTS 常见同义替换；
- 避免过度基础、与文章无关或无法帮助理解关键句的词；
- `definitionZh` 必须体现文章语境；
- `definitionEn` 应简洁、自然并适合 IELTS 学习者；
- `example` 应为原创简单例句，不复制文章长句；
- `term` 应在文章中出现，或与文章主题和关键表达高度相关；
- 输出必须便于人工审核并粘贴到 `context-vocabulary.js`；
- 不得生成虚假的来源、研究结论或 references。

## 6. Human Review Checklist

- 词或短语是否出现在文章中，或与文章高度相关；
- 中文释义是否贴合文章语境；
- 英文释义是否简洁准确；
- 例句是否自然、原创且没有复制文章长句；
- 是否与现有词汇包重复；
- 是否排除了过于简单或不适合 IELTS 的词；
- `term`、`type`、`definitionZh`、`definitionEn`、`example` 是否完整；
- JavaScript 引号、逗号和数组结构是否正确；
- `node --check context-vocabulary.js` 是否通过；
- 页面点词、全局词典回退和生词本是否正常。

## 7. Security Rules

- API Key 不得写入前端、仓库、文档或 Prompt 模板。
- API Key 不得提交到 Git，也不得保存到 `localStorage`。
- 后续本地脚本只能通过环境变量读取 Key。
- `.env`、`.env.local` 和其他密钥文件必须进入 `.gitignore`。
- 本地脚本默认只生成草稿，不直接覆盖正式数据文件。
- AI 输出必须经过人工审核后才能进入 `context-vocabulary.js`。
- 未来实时 AI 查词必须使用后端代理或 Serverless Function，并配置限流和错误处理。

## 8. Future Stages

- V0.7.0-a：建立流程文档和 Prompt 模板；
- V0.7.0-b：建立本地 MiniMax 生成脚本骨架和密钥防护；
- V0.7.0-c：选择一篇旧文章做词汇包试点；
- V0.7.0-d：验证新文章、references 和语境词汇的完整生成流程；
- V0.8.0：探索阅读理解题生成；
- V0.9.0：在安全后端代理基础上评估 AI fallback。
