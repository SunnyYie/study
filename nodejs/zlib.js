import zlib from 'zlib';
import fs from 'fs';

const input = fs.createReadStream('input.txt');
const output = fs.createWriteStream('input.txt.gz');

// 压缩
input.pipe(zlib.createGzip()).pipe(output);

output.on('finish', () => {
  console.log('文件已压缩完成。');
});

// 解压缩
const unzipInput = fs.createReadStream('input.txt.gz');
const unzipOutput = fs.createWriteStream('input_unzipped.txt');

unzipInput.pipe(zlib.createGunzip()).pipe(unzipOutput);

unzipOutput.on('finish', () => {
  console.log('文件已解压缩完成。');
});
