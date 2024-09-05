const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// 設置文件存儲
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// 讀取商品數據
let products = [];
const dataFile = 'products.json';
if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf8');
    products = JSON.parse(data);
}

// 中間件
app.use(express.static('public'));
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API 路由
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const newProduct = {
    id: products.length + 1,
    title: req.body.title,
    price: parseFloat(req.body.price),
    image: `/uploads/${req.file.filename}`
  };
  products.push(newProduct);
  
  // 保存到文件
  fs.writeFileSync(dataFile, JSON.stringify(products));
  
  res.status(201).json(newProduct);
});

// 啟動服務器
app.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
});