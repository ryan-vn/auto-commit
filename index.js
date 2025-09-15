const request = require("request");
const path = require("path");
const fs = require("fs");

// 创建pictures目录（如果不存在）
const dirPath = path.resolve(__dirname, "pictures");
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// 检查是否已有任务在运行
const lockFile = path.resolve(__dirname, ".robot.lock");
if (fs.existsSync(lockFile)) {
  console.log("检测到已有任务在运行，退出当前任务");
  process.exit(0);
}

// 创建锁文件
fs.writeFileSync(lockFile, new Date().toISOString());

// 检查是否为工作日（周一到周五）
const today = new Date();
const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ..., 6=周六

if (dayOfWeek === 0 || dayOfWeek === 6) {
  console.log("今天是周末，不执行任务");
  fs.unlinkSync(lockFile);
  process.exit(0);
}

console.log(`今天是工作日（周${dayOfWeek === 1 ? '一' : dayOfWeek === 2 ? '二' : dayOfWeek === 3 ? '三' : dayOfWeek === 4 ? '四' : '五'}），开始执行任务`);

// 随机生成今天的提交次数（4-10次）
const commitCount = 4 + Math.floor(Math.random() * 7); // 4-10次
console.log(`今天将提交 ${commitCount} 次`);

// 生成随机提交时间（9-19点之间）
const commitTimes = [];
for (let i = 0; i < commitCount; i++) {
  const randomHour = 9 + Math.floor(Math.random() * 11); // 9-19点
  const randomMinute = Math.floor(Math.random() * 60);
  commitTimes.push({ hour: randomHour, minute: randomMinute });
}

// 按时间排序
commitTimes.sort((a, b) => {
  if (a.hour !== b.hour) return a.hour - b.hour;
  return a.minute - b.minute;
});

console.log("今天的提交时间安排：");
commitTimes.forEach((time, index) => {
  console.log(`  ${index + 1}. ${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`);
});

// 计算第一个提交的延迟时间
const now = new Date();
const firstCommit = commitTimes[0];
const firstCommitTime = new Date();
firstCommitTime.setHours(firstCommit.hour, firstCommit.minute, 0, 0);

let delayMs = firstCommitTime.getTime() - now.getTime();
if (delayMs < 0) {
  // 如果第一个提交时间已过，延迟到明天
  delayMs += 24 * 60 * 60 * 1000;
}

console.log(`第一个提交将在 ${Math.floor(delayMs / (60 * 60 * 1000))} 小时 ${Math.floor((delayMs % (60 * 60 * 1000)) / (60 * 1000))} 分钟后执行`);

// 执行所有提交任务
let currentCommitIndex = 0;

function executeNextCommit() {
  if (currentCommitIndex >= commitTimes.length) {
    console.log("所有提交任务完成，清理锁文件");
    fs.unlinkSync(lockFile);
    return;
  }

  const commitTime = commitTimes[currentCommitIndex];
  const id = (~~(Math.random() * 100000)).toString();
  const url = `https://robohash.org/${id}`;
  
  // 生成文件名（包含提交序号）
  const dateArr = new Date().toLocaleDateString().split("/");
  dateArr.unshift(dateArr.pop());
  const date = dateArr.join("-");
  const fileName = `${date}-${currentCommitIndex + 1}.png`;
  
  console.log(`[${commitTime.hour.toString().padStart(2, '0')}:${commitTime.minute.toString().padStart(2, '0')}] 开始第 ${currentCommitIndex + 1} 次提交: ${url}`);
  
  request(url).pipe(fs.createWriteStream(`${dirPath}/${fileName}`));
  
  currentCommitIndex++;
  
  // 计算下一次提交的延迟时间
  if (currentCommitIndex < commitTimes.length) {
    const nextCommit = commitTimes[currentCommitIndex];
    const currentTime = new Date();
    const nextCommitTime = new Date();
    nextCommitTime.setHours(nextCommit.hour, nextCommit.minute, 0, 0);
    
    const nextDelayMs = nextCommitTime.getTime() - currentTime.getTime();
    setTimeout(executeNextCommit, nextDelayMs);
  } else {
    // 所有提交完成
    setTimeout(() => {
      console.log("所有提交任务完成，清理锁文件");
      fs.unlinkSync(lockFile);
    }, 1000);
  }
}

// 开始执行第一个提交
setTimeout(executeNextCommit, delayMs);
