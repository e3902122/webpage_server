const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// 使用 Vercel 的临时文件系统
const uploadDir = '/tmp/uploads';

// 确保上传目录存在
fs.mkdir(uploadDir, { recursive: true })
  .catch(err => console.error('创建上传目录失败:', err));

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// 处理文件上传的路由
app.post('/api/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('没有文件被上传。');
  }

  try {
    const filePath = req.file.path;
    await fs.access(filePath);
    console.log('文件成功上传到:', filePath);
    res.status(200).send('文件上传成功');
  } catch (error) {
    console.error('文件处理错误:', error);
    res.status(500).send('文件上传过程中发生错误');
  }
});

// 提供静态文件访问
app.use('/uploads', express.static(uploadDir));

module.exports = app;