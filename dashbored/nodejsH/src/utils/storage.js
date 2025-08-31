const path = require('path');
const fs = require('fs');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function buildUploadPath(...segments) {
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  ensureDir(uploadsRoot);
  const fullPath = path.join(uploadsRoot, ...segments);
  ensureDir(path.dirname(fullPath));
  return fullPath;
}

module.exports = {
  ensureDir,
  buildUploadPath,
};


