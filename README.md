# TerminalMind 🖥️

> CyberTerminal 风格知识库 & 面试题练习平台

![TerminalMind](https://img.shields.io/badge/TerminalMind-v1.0-00ff9f?style=for-the-badge)

## ✨ Features

- 📚 **Knowledge Base** - Markdown 驱动的知识库，支持全文搜索
- 🎯 **Interview Mode** - 闯关答题，AI 智能提示
- 🤖 **AI Chat** - 基于知识库的 AI 对话助手
- 🎨 **CyberTerminal 风格** - 黑客帝国同款 Terminal 美学
- 🔐 **HTTP Basic Auth** - 简单的登录保护

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for production)
- Git

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/terminal-mind.git
cd terminal-mind

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:4321`

### Production (Docker)

```bash
# Build and run
docker compose up -d

# Update and redeploy
./scripts/deploy.sh
```

Visit `http://localhost:3000`

## 📁 Content Structure

```
public/content/
├── knowledge/          # 知识库文档
│   ├── java/
│   │   ├── spring-core.md
│   │   └── jvm.md
│   └── ai/
│       └── llm.md
└── interview/          # 面试题
    ├── java/
    │   └── jvm-interview.md
    ├── ai/
    │   └── llm-interview.md
    └── comprehensive/
        └── system-design.md
```

### Adding Content

1. **知识库**: 添加 Markdown 文件到 `public/content/knowledge/`
2. **面试题**: 添加 Markdown 文件到 `public/content/interview/`

#### 面试题格式

```markdown
# Topic Name [Easy/Medium/Hard]

## Question 1: Title
- A) Option A
- B) Option B **[x]**  <- 正确答案标记
- C) Option C
- D) Option D

**Answer:** B
```

## ⚙️ Configuration

Copy the config template and set your values:

```bash
cp config/site.config.json config/site.config.local.json
```

Edit `config/site.config.json`:

```json
{
  "ai": {
    "apiKey": "your-api-key-here",
    "endpoint": "http://localhost:8250/api/chat"
  },
  "auth": {
    "user": "admin",
    "pass": "your-password"
  }
}
```

## 🔒 Authentication

For production, generate htpasswd:

```bash
# Install apache2-utils on Ubuntu/Debian
sudo apt install apache2-utils

# Generate password
htpasswd -nb admin your-password
```

Add to nginx config or use Docker with environment variables.

## 🎨 Customization

### Colors

Edit `src/styles/global.css`:

```css
:root {
  --cyber-green: #00ff9f;
  --cyber-cyan: #00d4ff;
  --cyber-purple: #bf00ff;
  --cyber-yellow: #ffff00;
}
```

### Logo

Replace `public/favicon.svg`

## 📝 License

MIT
