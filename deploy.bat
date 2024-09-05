@echo off

REM 检查是否有更改
git status --porcelain > temp.txt
findstr /m . temp.txt > nul
if %errorlevel% neq 0 (
    echo 没有检测到更改，无需提交。
    del temp.txt
    exit /b 0
)
del temp.txt

REM 添加所有更改
git add .

REM 提交更改
git commit -m "自动更新: %date% %time%"

REM 推送到 GitHub
git push origin main

echo 更改已成功推送到 GitHub。