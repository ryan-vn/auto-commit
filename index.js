const request = require("request");
const path = require("path");
const fs = require("fs");

// 创建pictures目录（如果不存在）
const dirPath = path.resolve(__dirname, "pictures");
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// 检查是否为工作日（周一到周五）
const today = new Date();
const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ..., 6=周六

if (dayOfWeek === 0 || dayOfWeek === 6) {
  console.log("今天是周末，不执行任务");
  process.exit(0);
}

console.log(`今天是工作日（周${dayOfWeek === 1 ? '一' : dayOfWeek === 2 ? '二' : dayOfWeek === 3 ? '三' : dayOfWeek === 4 ? '四' : '五'}），开始执行任务`);

// 检查当前时间是否在工作时间内（9-19点）
const currentHour = today.getHours();
if (currentHour < 9 || currentHour >= 19) {
  console.log(`当前时间 ${currentHour}:${today.getMinutes().toString().padStart(2, '0')} 不在工作时间（9-19点）内，不执行任务`);
  process.exit(0);
}

// 生成一个随机的机器人图片
const id = (~~(Math.random() * 100000)).toString();
const url = `https://robohash.org/${id}`;

// 生成文件名（包含日期和时间戳）
const dateArr = new Date().toLocaleDateString().split("/");
dateArr.unshift(dateArr.pop());
const date = dateArr.join("-");
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const fileName = `${date}-${timestamp}.png`;

console.log(`开始执行提交任务: ${url}`);
console.log(`保存文件: ${fileName}`);

// 下载并保存图片
request(url)
  .pipe(fs.createWriteStream(`${dirPath}/${fileName}`))
  .on('finish', () => {
    console.log(`图片下载完成: ${fileName}`);
    console.log("单次提交任务完成");
  })
  .on('error', (err) => {
    console.error('下载图片时出错:', err);
    process.exit(1);
  });
