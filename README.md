# autocommit-robot
每日自动提交github仓库的脚本

## 功能说明
这个机器人会在每个工作日自动生成随机数量的提交（4-10次），在9-19点之间随机时间执行，每次提交会下载一个随机机器人图片到 `pictures` 目录。

## 如何让 GitHub Action 运行

### 1. 推送代码到 GitHub
确保你的代码已经推送到 GitHub 仓库。

### 2. 检查 Actions 权限
- 进入你的 GitHub 仓库
- 点击 "Settings" 标签
- 在左侧菜单中找到 "Actions" -> "General"
- 确保 "Actions permissions" 设置为 "Allow all actions and reusable workflows"

### 3. 手动触发测试
- 进入你的 GitHub 仓库
- 点击 "Actions" 标签
- 找到 "autocommit-robot" 工作流
- 点击 "Run workflow" 按钮手动触发一次测试

### 4. 自动执行时间
工作流配置为每天北京时间 21:45 执行（UTC 13:45）。

## 本地运行
```bash
npm install
node index.js
```

## 注意事项
- 脚本只会在工作日（周一到周五）执行
- 使用锁文件机制防止重复执行
- 每次运行会生成 4-10 次随机提交
- 提交时间在 9-19 点之间随机分布
