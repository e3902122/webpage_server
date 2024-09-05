const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

// MongoDB 连接 URI（请替换为你的实际连接字符串）
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('shopDatabase'); // 替换为你的数据库名称
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

let db;

// API 路由
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const collection = db.collection('products');
    const result = await collection.insertOne({ name, price, image });
    res.status(201).json({ id: result.insertedId, name, price, image });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const collection = db.collection('products');
    const products = await collection.find({}).toArray();
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

const PORT = process.env.PORT || 3000;

// 连接到数据库并启动服务器
connectToDatabase().then((database) => {
  db = database;
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
});

module.exports = app;