#!/bin/bash

# 检查是否有更改
if [[ -z $(git status -s) ]]
then
    echo "没有检测到更改，无需提交。"
    exit 0
fi

# 添加所有更改
git add .

# 提交更改
git commit -m "自动更新: $(date)"

# 推送到 GitHub
git push origin main

echo "更改已成功推送到 GitHub。"