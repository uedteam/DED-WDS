import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ghpages from "gh-pages";

// 獲取當前文件的目錄路徑和項目根目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// 定義路徑
const paths = {
  indexHtml: path.join(projectRoot, "index.html"),
  dist: path.join(projectRoot, "dist"),
  components: path.join(projectRoot, "components"),
  distComponents: path.join(projectRoot, "dist", "components"),
  styles: path.join(projectRoot, "public", "styles"),
  distStyles: path.join(projectRoot, "dist", "public", "styles"),
  distHtml: path.join(projectRoot, "dist", "index.html"),
};

// 通用函數：確保目錄存在
const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 通用函數：複製檔案或目錄
const copyFiles = (srcDir, destDir, filterFn = () => true) => {
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir).filter(filterFn);
    ensureDirectory(destDir);
    files.forEach((file) => {
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    });
  } else {
    console.warn(`目錄 ${srcDir} 不存在，無法複製檔案。`);
  }
};

// 確保 dist 和子目錄存在
ensureDirectory(paths.dist);
ensureDirectory(paths.distComponents);
ensureDirectory(paths.distStyles);

// 複製 index.html 到 dist
fs.copyFileSync(paths.indexHtml, paths.distHtml);

// 複製 components 中的所有 .html 檔案
copyFiles(
  paths.components,
  paths.distComponents,
  (file) => path.extname(file) === ".html"
);

// 複製 styles 資料夾
copyFiles(paths.styles, paths.distStyles);

// 修改 index.html，添加 <base> 標籤
if (fs.existsSync(paths.distHtml)) {
  let indexContent = fs.readFileSync(paths.distHtml, "utf8");
  if (!indexContent.includes('<base href="/DED-WDS/">')) {
    indexContent = indexContent.replace(
      "<head>",
      '<head>\n\t  <base href="/DED-WDS/">'
    );
    fs.writeFileSync(paths.distHtml, indexContent, "utf8");
    console.log("已自動修正 index.html 的 <base> 標籤");
  }
}

// 部署到 gh-pages
ghpages.publish(paths.dist, (err) => {
  if (err) {
    console.error("部署失敗:", err);
  } else {
    console.log("部署成功");
  }
});
