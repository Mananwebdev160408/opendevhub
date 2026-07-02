const fs = require('fs');
const path = require('path');

const workspaceRoot = 'c:\\Users\\asus\\OneDrive\\Documents\\code zone\\opendevhub';

// 1. Clean README.md
const readmePath = path.join(workspaceRoot, 'README.md');
if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath, 'utf8');

  // Replace title and intro slop
  readme = readme.replace('> **The Ultimate Developer Toolbox & Open Source Directory**', '> **Developer Toolbox & Open Source Directory**');
  readme = readme.replace('Discover open-source repositories, search good first issues, explore public APIs, access developer tools, browse cheatsheets, and explore CSS/design utilities — all in one high-density, zero-fluff portal.', 'Search open-source repositories, browse good first issues, explore public APIs, access developer tools, browse cheatsheets, and explore CSS/design utilities — all in a unified, high-density, offline-first dashboard.');

  // Replace emojis in highlights
  readme = readme.replace('## ✨ Highlights', '## Highlights');
  readme = readme.replace('- 🧰 **40+ Offline Developer Utilities**', '- **40+ Offline Developer Utilities**');
  readme = readme.replace('- 🔍 **Direct GitHub API Exploration**', '- **Direct GitHub API Exploration**');
  readme = readme.replace('- 📖 **1200+ HTTP Status Codes**', '- **1200+ HTTP Status Codes**');
  readme = readme.replace('- 🗂 **API Directory**', '- **API Directory**');
  readme = readme.replace('- 🎨 **CSS Visual Tools**', '- **CSS Visual Tools**');
  readme = readme.replace('- 📋 **6 Cheatsheet Collections**', '- **6 Cheatsheet Collections**');
  readme = readme.replace('- 🔨 **Builder Tools**', '- **Builder Tools**');
  readme = readme.replace('- 📚 **Dev Glossary**', '- **Dev Glossary**');
  readme = readme.replace('- 📰 **Dev News & Events**', '- **Dev News & Events**');
  readme = readme.replace('- 🔐 **Zero cookies, zero tracking, zero sign-up**', '- **Zero cookies, zero tracking, zero sign-up**');
  readme = readme.replace('- 🆓 **100% free and open-source**', '- **100% free and open-source**');

  // Replace other headers
  readme = readme.replace('## 🗺️ Pages & Routes', '## Pages & Routes');
  readme = readme.replace('## 🧰 Dev Toolbox', '## Dev Toolbox');
  readme = readme.replace('## 🎨 CSS & Design Tools', '## CSS & Design Tools');
  readme = readme.replace('## 📋 Cheatsheet Library', '## Cheatsheet Library');
  readme = readme.replace('## 🔨 Builder Tools', '## Builder Tools');
  readme = readme.replace('## 🔌 GitHub Integration', '## GitHub Integration');
  readme = readme.replace('## 🚀 Getting Started', '## Getting Started');
  readme = readme.replace('## 🏗️ Project Structure', '## Project Structure');
  readme = readme.replace('## 🛠️ Tech Stack', '## Tech Stack');
  readme = readme.replace('## 🤝 Contributing', '## Contributing');
  readme = readme.replace('## 📝 License', '## License');
  readme = readme.replace('## 🙏 Acknowledgements', '## Acknowledgements');
  readme = readme.replace('Built with ❤️ for developers, by developers.', 'Built for developers, by developers.');

  fs.writeFileSync(readmePath, readme, 'utf8');
  console.log('README.md cleaned successfully.');
}

// 2. Clean PRD.md
const prdPath = path.join(workspaceRoot, 'PRD.md');
if (fs.existsSync(prdPath)) {
  let prd = fs.readFileSync(prdPath, 'utf8');
  prd = prd.replace('## Phase 1 — ✅ Shipped', '## Phase 1 — Completed');
  prd = prd.replace('## Phase 2 — ✅ Shipped', '## Phase 2 — Completed');
  prd = prd.replace('## Phase 3 — ✅ Shipped', '## Phase 3 — Completed');
  prd = prd.replace('## Phase 4 — ✅ Shipped', '## Phase 4 — Completed');
  fs.writeFileSync(prdPath, prd, 'utf8');
  console.log('PRD.md cleaned successfully.');
}
