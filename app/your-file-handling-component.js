const fs = require('fs').promises;
const path = require('path');

async function handleFile(fileName) {
  try {
    const filePath = path.join('C:', '程式', 'public', 'uploads', fileName);
    await fs.access(filePath);
    // 文件存在，继续处理
    const data = await fs.readFile(filePath);
    // 处理文件数据...
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`文件不存在: ${fileName}`);
      // 处理文件不存在的情况
    } else {
      console.error(`处理文件 ${fileName} 时发生错误:`, error);
      // 处理其他类型的错误
    }
  }
}