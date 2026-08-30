# IELTS Knowledge Reader

面向雅思阅读能力提升的原创英文知识阅读器。项目通过 IELTS-style 英文文章、语境点词、生词本和阅读记录，帮助用户在真实语境中积累词汇与知识。

在线体验：[https://jizw0704-source.github.io/ielts-knowledge-reader/](https://jizw0704-source.github.io/ielts-knowledge-reader/)

> IELTS Knowledge Reader 不是雅思真题售卖平台，也不内置真实 IELTS、Cambridge IELTS 或官方样题原文。

## 核心学习路径

```text
今日文章 → 阅读文章 → 点词释义 → 加入生词本 → 管理生词 → 继续探索文章库
```

当前阶段已经完成手机端 H5 MVP 和基础 PWA 上线，正在从“功能可用”转向“持续学习闭环”验证。

## 当前状态

| 项目 | 状态 |
| --- | --- |
| 当前里程碑 | V1.0-a |
| 产品形态 | 手机优先的纯静态 H5 / PWA |
| 部署方式 | GitHub Pages，`main` 分支根目录 |
| 内容规模 | 12 篇原创文章、12 个语境词汇包、286 条语境词汇 |
| 数据保存 | 当前浏览器 `localStorage` |
| 备份方式 | 生词本页面导出与导入 JSON 备份 |
| 后端与账号 | 暂无 |

## 已完成功能

### 入口与手机预览

- 每个自然日首次打开时展示一张每日分享海报；关闭后不阻塞今日文章阅读。
- 海报包含英文句子、中文理解、类型/来源、日期、意境背景图、项目名称、访问地址和二维码。
- 今日文章卡片保留“打开今日海报”入口，同一天可以再次查看、下载或分享。
- 下载生成 1080×1440 PNG；支持文件分享的手机浏览器调用系统分享面板，其余浏览器自动回退到下载。
- 今日、文章库、生词本和阅读页切换后回到真正的页面顶部，顶部品牌栏保持可见。
- 375px 和 390px 窄屏下，文章标题、难度和来源信息会按上下结构排列，避免相互挤压。

### 今日文章与文章库

- 展示今日推荐、中文和英文摘要、标签、难度与来源类型。
- 文章库支持标签筛选、文章数量、字数、预计阅读时间和已读状态。
- 只展示已经到达 `publishDate` 的文章，未来文章不会提前出现。
- 当天有排期文章时优先展示；没有排期时按本地日期在已发布文章中稳定轮换，同一天刷新结果不变。

### 阅读与点词

- 英文正文按段落展示，并记录阅读时间。
- 点击英文单词可查看中文释义、英文释义和语境例句。
- 查词优先使用文章级语境词汇，再回退到基础词典及词形还原结果。
- 未收录单词仍可连同来源文章和原文句子加入生词本。

### 生词本与本地备份

- 保存单词、释义、来源文章、原文句子和添加时间。
- 支持“陌生 / 认识 / 掌握”熟悉程度和删除操作。
- 支持导出、校验并恢复 JSON 备份。
- 刷新页面后，本浏览器中的生词与熟悉程度仍会保留。

### 阅读记录

- 支持标记“完成阅读”。
- 支持保存读后感、展示阅读历史和复制分享文案。
- 文章库会显示文章的已读状态。

### PWA 与基础离线使用

- 已提供 Web App Manifest、应用图标和 Service Worker。
- 应用壳缓存版本已更新至 V1.0-a。
- 四张每日海报背景图和项目二维码随应用本地缓存，不依赖运行时图片接口。
- 首次联网完整加载后，可基础离线打开应用、阅读内置文章、点词和筛选文章。
- 支持安装事件的浏览器会按条件显示“安装到设备”入口。
- iPhone Safari 和不支持自动安装事件的浏览器继续使用手动“添加到主屏幕”说明。
- 从主屏幕以 standalone 模式启动后，不会重复显示安装邀请。

## 手机使用

### 直接在线使用

用手机浏览器打开：

```text
https://jizw0704-source.github.io/ielts-knowledge-reader/
```

建议优先使用 Safari 或 Chrome。微信内置浏览器可以阅读，但它与 Safari、Chrome 分别拥有独立的浏览器数据。

### 添加到手机主屏幕

- **iPhone / iPad Safari**：点击分享按钮，选择“添加到主屏幕”。
- **Android Chrome**：如果页面出现“安装到设备”，可直接点击；未出现时可在浏览器菜单中查找“安装应用”或“添加到主屏幕”。

不同浏览器和操作系统对安装入口的支持不同。自动安装按钮只在浏览器确认当前页面可安装时出现，不出现并不影响普通网页使用。

### 离线与数据注意事项

- 第一次使用以及获取新版本时仍需要联网。
- 离线模式只能使用已经缓存的内置页面、文章和词典数据。
- 生词和阅读记录只保存在当前域名、当前浏览器、当前设备中，不会自动跨设备同步。
- 清除浏览器数据、卸载浏览器或更换设备前，请先在生词本中导出备份。

更完整的手机访问说明见 [`docs/MOBILE_ACCESS.md`](docs/MOBILE_ACCESS.md)。

## 本地运行

项目是纯 HTML、CSS 和 JavaScript 静态应用，不需要安装生产依赖。

推荐使用本地静态服务：

```bash
cd ielts-reader
python3 -m http.server 8000 --bind 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:8000/
```

也可以直接打开 `index.html` 查看基础功能，但 Service Worker 和 PWA 安装能力需要通过 `http://localhost` 或 HTTPS 访问。

局域网手机调试时，可以监听全部本地网络接口：

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

电脑和手机需要连接同一局域网，再通过电脑的局域网 IP 访问。不要在不受信任的网络中开放本地服务。

## 检查与验收

JavaScript 语法检查：

```bash
node --check script.js
node --check sw.js
node --check articles.js
node --check context-vocabulary.js
node --check base-dictionary.js
```

文章、来源和语境词汇校验：

```bash
node tools/validate-content.mjs --verbose
```

项目目前没有独立的自动化浏览器测试套件。功能改动后还需要按照 [`docs/REGRESSION_CHECKLIST.md`](docs/REGRESSION_CHECKLIST.md) 完成手动回归；界面改动需要额外检查 375px 手机宽度。

## 项目结构

| 路径 | 用途 |
| --- | --- |
| `index.html` | 页面结构和静态资源入口 |
| `style.css` | 手机优先的页面样式 |
| `script.js` | 页面状态、交互、阅读记录、生词本和备份逻辑 |
| `articles.js` | 原创文章、摘要、标签、发布日期和参考来源 |
| `context-vocabulary.js` | 文章级语境词汇 |
| `base-dictionary.js` | 基础词典数据 |
| `manifest.webmanifest` | PWA 应用信息 |
| `sw.js` | 应用壳与内容的离线缓存 |
| `assets/daily-posters/` | 每日分享海报的本地背景图和项目二维码 |
| `tools/validate-content.mjs` | 内容结构与覆盖校验 |
| `docs/` | 产品规则、内容规范、回归清单与项目记录 |

## 数据与隐私边界

项目没有后端数据库，也不会把生词和阅读记录上传到服务器。当前使用两个主要本地存储空间：

- `ielts-knowledge-reader.vocab.v1`：生词本数据
- `ielts_reader_reading_records`：阅读完成状态与读后感
- `ielts_reader_daily_poster_seen`：最近一次自动展示每日海报的日期（不进入用户数据备份）

开发期可以使用本地脚本辅助生成文章语境词汇草稿，但 API 密钥不得进入前端、文档、仓库或 Git 历史。生成结果必须经过人工审核和内容校验后才能进入正式数据。

## 内容与版权边界

- 内置文章必须是原创 IELTS-style 内容，或有清晰公开授权的内容。
- 不得复制、改写或售卖真实 IELTS、Cambridge IELTS、剑桥雅思真题和官方样题。
- 不得伪造参考来源、研究发现、统计数据或出处。
- AI 辅助生成内容只能作为草稿，不能绕过人工审核。

## 已知限制

- 暂无账号、后端和跨设备自动同步。
- 每日推荐会在现有 12 篇文章中轮换，一个完整周期后仍会重复；内容规模尚不足以支撑长期每日阅读。
- 每日海报目前使用原创阅读提示和传统英语俗语，后续如加入名人名言必须先完成出处核验。
- 真实 iPhone Safari 和 Android Chrome 的最终安装、主屏幕启动及离线体验仍需要分别完成实机验收。
- `script.js` 仍是较大的单文件，后续应在关键行为有测试保护后逐步清理和拆分。

## 下一阶段建议

以下内容是建议路线，尚未全部实现：

1. **V1.0-b 今日复习**：在生词本中增加每次约 10 个词的复习流程。
2. **持续内容供给**：逐步扩充到至少 30 篇原创、来源可追溯的文章。
3. **质量与维护**：补充关键自动检查后，再小范围清理重复事件处理逻辑和拆分 `script.js`。

涉及产品行为或数据结构变化时，必须先更新 [`docs/PROJECT_RULES.md`](docs/PROJECT_RULES.md)，再进入代码开发。

## 相关文档

- [`docs/PROJECT_RULES.md`](docs/PROJECT_RULES.md)：产品范围、数据结构和验收规则
- [`docs/PROJECT_MEMORY.md`](docs/PROJECT_MEMORY.md)：版本里程碑和开发记录
- [`docs/ARTICLE_SPEC.md`](docs/ARTICLE_SPEC.md)：文章数据规范
- [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md)：内容生产流程
- [`docs/IELTS_SOURCE_STYLE_GUIDE.md`](docs/IELTS_SOURCE_STYLE_GUIDE.md)：来源风格与版权边界
- [`docs/REGRESSION_CHECKLIST.md`](docs/REGRESSION_CHECKLIST.md)：手动回归清单
- [`docs/MOBILE_ACCESS.md`](docs/MOBILE_ACCESS.md)：手机访问和 GitHub Pages 说明
