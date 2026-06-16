# MOBILE_ACCESS.md｜手机端访问说明

## 1. 本地局域网访问方式

启动本地静态服务：

```bash
npx http-server . -p 8000 -a 0.0.0.0 -c-1
```

手机访问地址：

```text
http://电脑局域网IP:8000/index.html
```

说明：

- `电脑局域网IP` 请替换为当前电脑在局域网中的真实 IP
- 手机和电脑需要连接同一个局域网
- `-c-1` 用于尽量避免静态资源缓存干扰

## 2. GitHub Pages 公网访问方式

预期访问地址：

```text
https://jizw0704-source.github.io/ielts-knowledge-reader/
```

## 3. GitHub Pages 配置步骤

1. 打开 GitHub 仓库
2. 进入 `Settings`
3. 进入 `Pages`
4. `Source` 选择 `Deploy from a branch`
5. `Branch` 选择 `main`
6. `Folder` 选择 `/root`
7. 点击 `Save`
8. 等待 GitHub Pages 构建完成
9. 使用手机浏览器或微信打开 Pages 地址

## 4. 微信端注意事项

- 如果页面没有更新，可以在 URL 后面加版本参数，例如 `?v=1`
- 生词本数据存储在当前浏览器的 `localStorage` 中
- 不同访问地址之间的 `localStorage` 不共享
- 微信、Safari、Chrome 之间的生词数据相互独立

## 5. 当前限制

- 暂无账号系统
- 暂无跨设备同步
- 暂无后端数据库
- 手机端保存依赖浏览器 `localStorage`
