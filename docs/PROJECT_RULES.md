# IELTS Knowledge Reader 项目规则

## 规则关系

1. 本文件是产品规则和需求细则文件。
2. 如果产品需求需要调整，应先更新本文件，再进入代码开发。
3. 如果本文件与 `AGENTS.md` 出现冲突，以 `AGENTS.md` 为准。

## 项目定位

IELTS Knowledge Reader 是面向雅思阅读能力提升的英文知识阅读器，不是雅思真题售卖平台。
产品通过原创 IELTS-style 英文文章、点词释义、生词本、摘要、标签和阅读记录，帮助用户在真实语境中积累词汇和知识。

## 用户场景

用户每天打开一篇接近雅思阅读难度的英文文章，阅读时点词查看释义，把不熟悉的词加入生词本，之后再回到生词本复习，并从文章库中继续探索新文章。

## MVP 范围

核心闭环：

今日文章 -> 阅读文章 -> 点词释义 -> 加入生词本 -> 查看生词本 -> 查看文章库

第一版只实现手机端 H5 MVP，不做 App、小程序、后端、登录、支付、AI 接口、自动采集和真实雅思原文库。

## 页面结构

### 1. 今日文章页

- 显示英文标题
- 显示中文摘要
- 显示英文摘要
- 显示标签
- 显示 IELTS 难度
- 显示来源类型
- 提供“开始阅读”按钮

### 2. 阅读页

- 英文正文按段落展示
- 顶部显示标题、标签、难度
- 显示阅读计时
- 点击英文单词弹出释义卡片
- 释义卡片包含单词、中文释义、英文释义、例句、加入生词本按钮、关闭按钮
- 尽量记录单词所在的原文句子

### 3. 生词本页

- 读取本地生词数据
- 显示单词、中文释义、英文释义、来源文章、原文句子、添加时间
- 支持删除单词
- 支持熟悉程度：陌生 / 认识 / 掌握
- 没有生词时显示空状态提示

### 4. 文章库页

- 展示至少 3 篇原创 IELTS-style 英文文章
- 支持按标签筛选
- 点击文章可进入阅读页

### 5. 底部导航

- 今日
- 文章库
- 生词本

## 数据结构

### 文章数据

每篇文章必须支持以下字段：

- `id`
- `title`
- `subtitle`
- `sourceType`
- `difficulty`
- `tags`
- `summaryZh`
- `summaryEn`
- `content`
- `coreWords`
- `publishDate`

### 生词数据

每个生词必须支持以下字段：

- `word`
- `meaningZh`
- `meaningEn`
- `example`
- `sourceArticleId`
- `sourceArticleTitle`
- `sourceSentence`
- `addedAt`
- `familiarity`

熟悉程度取值：

- 陌生
- 认识
- 掌握

## UI 原则

- 手机端优先
- 简洁、干净、适合长时间阅读
- 背景柔和
- 正文字体清晰
- 行距舒适
- 标签为胶囊样式
- 卡片圆角
- 底部导航固定
- 适配 375px 宽度手机屏幕
- UI 使用中文，英文文章正文保持英文，摘要同时显示中文和英文

## 内容来源与版权

- 不得内置、复制、改写或售卖真实 IELTS、Cambridge IELTS、剑桥雅思真题、官方样题等受版权保护内容
- MVP 阶段只能使用原创 IELTS-style 英文文章、公开授权文章，或用户自行导入内容
- 项目中的样例文章必须是原创 IELTS-style 英文文章，不能来自真实雅思材料

## 验收标准

1. 直接打开 `index.html` 可以运行
2. 首页能看到今日文章
3. 点击“开始阅读”能进入阅读页
4. 点击正文单词能弹出释义卡片
5. 生词能加入 `localStorage`
6. 刷新后生词仍保留
7. 生词本可以删除单词
8. 生词可以修改熟悉程度
9. 文章库可以按标签筛选
10. 底部导航可以正常切换
11. 控制台无明显 JavaScript 报错
12. 不包含任何真实雅思版权原文

## 后续迭代方向

- 用户自行导入文章
- 更丰富的标签与筛选
- 阅读进度与复习提醒
- 更完整的词汇统计
- 后端同步与登录能力

## 维护说明

- 如果文章数据或生词数据结构变化，先更新本文件，再同步更新实现代码
- 如果新增页面视图，保持底部导航行为一致

## Codex Controlled Patch Development Rules

1. Start with read-only locating before editing any file.
2. During read-only locating, list:
   - planned files;
   - planned functions or data sections;
   - prohibited areas;
   - risks;
   - minimal patch plan.
3. Every task must clearly state the allowed edit scope and the forbidden scope.
4. If `node --check`, tests, or build fail, stop immediately and report the error line and message; do not widen the fix scope.
5. After changes, check `git diff` before UI or functional verification.
6. If `git diff` contains forbidden areas, revert first instead of patching around the problem.
7. Do only one small goal per round; do not change articles, dictionary, UI, storage, entry files, and project rules at the same time.
8. Temporary scripts must be cleaned up and must not remain in the project tree or system temp directories.
9. Before commit, confirm `git status` only contains expected files.
10. Without confirmation, do not change:
    - `index.html` resource references;
    - global `style.css` rules;
    - `localStorage` keys;
    - `mockDictionary` / `DICTIONARY_ENTRIES`;
    - word lookup regexes;
    - article `content`;
    - `summaryZh` / `summaryEn`;
    - project rule files.
11. Important milestones must update `docs/PROJECT_MEMORY.md`.
12. If encoding noise, corruption, syntax pollution, or cross-area accidental edits appear, prefer rolling back to the latest stable commit instead of continuing to patch.
