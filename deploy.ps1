# 检查是否有更改
if (-not (git status --porcelain)) {
    Write-Host "没有检测到更改，无需提交。"
    exit 0
}

# 添加所有更改
git add .

# 提交更改
git commit -m "自动更新: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 推送到 GitHub
git push origin main

Write-Host "更改已成功推送到 GitHub。"

# 如果安装了 Vercel CLI 并且想要自动部署
vercel --prod