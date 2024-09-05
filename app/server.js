require('dotenv').config();
const express = require('express');
const path = require('path');
const portfinder = require('portfinder');
const sequelize = require('../config/database'); // 确保路径正确
const Product = require('../models/Product'); // 确保路径正确
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

// 同步数据库
sequelize.sync().then(() => {
  console.log('数据库已同步');
}).catch((error) => {
  console.error('数据库同步失败:', error);
});

// 在其他路由之前添加
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API 路由
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    console.log('接收到的商品数据:', req.body); // 添加日志
    const product = await Product.create({ name, price, image });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    console.log('返回的商品:', products); // 添加日志
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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