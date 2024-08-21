import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ghpages from 'gh-pages';

// 獲取當前文件的目錄路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 獲取項目根目錄的路徑
const projectRoot = path.resolve(__dirname, '..');

// 使用 projectRoot 來引用項目根目錄中的文件
const indexHtmlPath = path.join(projectRoot, 'index.html');
const distPath = path.join(projectRoot, 'dist');

// 確保 dist 目錄存在
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// 複製 index.html 到 dist 目錄
fs.copyFileSync(
    indexHtmlPath,
    path.join(distPath, 'index.html')
);

// 部署到 gh-pages
ghpages.publish(distPath, function(err) {
    if (err) {
        console.error('部署失敗:', err);
    } else {
        console.log('部署成功');
    }
});