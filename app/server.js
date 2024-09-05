const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const portfinder = require('portfinder');
const app = express();

// 服务静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

const productsFile = path.join(__dirname, 'products.json');

// 读取商品数据
async function readProducts() {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 如果文件不存在，返回空数组
      return [];
    }
    throw error;
  }
}

// 写入商品数据
async function writeProducts(products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

// API 路由
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const products = await readProducts();
    const newProduct = { id: Date.now(), name, price, image };
    products.push(newProduct);
    await writeProducts(products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    console.log('服务器返回的商品:', products); // 添加日志
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