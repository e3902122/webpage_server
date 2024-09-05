const express = require('express');
const path = require('path');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

// 使用环境变量存储商品数据
let products = process.env.PRODUCTS ? JSON.parse(process.env.PRODUCTS) : [];

// API 路由
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const newProduct = { id: Date.now(), name, price, image };
    products.push(newProduct);
    // 在实际应用中，这里应该更新环境变量
    // 但在 Vercel 中，我们无法直接修改环境变量
    // 这里只是模拟添加商品
    console.log('添加新商品:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    console.log('服务器返回的商品:', products);
    res.json(products);
  } catch (error) {
    console.error('读取商品时出错:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 所有其他路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;