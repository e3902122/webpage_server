const express = require('express');
const path = require('path');
const portfinder = require('portfinder');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

// 模拟数据库
let products = [];

// API 路由
app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;
  const newProduct = { id: Date.now(), name, price, image };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

// 所有其他路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

portfinder.getPort((err, port) => {
  if (err) {
    console.error('无法找到可用端口:', err);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
  });

  // 添加错误处理
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`端口 ${port} 需要提升的权限`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`端口 ${port} 已被占用`);
        // 尝试使用下一个可用端口
        portfinder.getPort((err, newPort) => {
          if (err) {
            console.error('无法找到新的可用端口:', err);
            process.exit(1);
          }
          server.listen(newPort);
        });
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    console.log(`服务器正在监听 ${typeof addr === 'string' ? addr : addr.port}`);
  });
});

module.exports = app;