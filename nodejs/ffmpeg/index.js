// 提取视频的音频
const child_process = require('child_process')
const path = require('path')

child_process.execSync('ffmpeg -i 黑择明.mp4 -q:a 0 -map a output.mp3')