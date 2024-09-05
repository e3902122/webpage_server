const express = require('express');
const path = require('path');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// API 路由
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// 所有其他路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app; // 确保导出 app