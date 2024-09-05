# 检查是否有更改
if (-not (git status --porcelain)) {
    Write-Host "没有检测到更改，无需提交。"
    exit 0
}

# 添加所有更改
git add .

# 提交更改
git commit -m "更新商店网页内容和样式"

# 如果您使用前端框架，添加构建步骤
# npm run build

# 推送到 GitHub
git push origin main

Write-Host "更改已成功推送到 GitHub。"

# 部署到 Vercel
vercel --prod