# TerminalMind 网站工作流程与规范总结

## 📁 目录结构

```
my_knowledge/                    # 知识库内容目录
├── 00-规范/                     # 规范文档
│   ├── 知识库规范.md
│   └── 面试题库规范.md
├── 01-学习笔记/                 # 学习笔记
│   ├── Java后端/
│   ├── AI与大模型/
│   ├── 系统架构/
│   └── 工具效率/
├── 02-工作日志/                 # 工作日志
├── 03-面试准备/                 # 面试准备
│   └── 面试题库/
├── 04-内容创作/                 # 内容创作
├── 05-资源收藏/                 # 资源收藏
└── 06-绘图/                     # 绘图

terminal-mind/                   # 网站源码
├── src/pages/
│   ├── knowledge/              # 知识库页面
│   ├── interview/              # 面试题页面
│   └── chat/                   # AI聊天页面
├── config/site.config.json      # 网站配置
└── dist/                        # 构建输出
```

## 🌐 网站架构

```
用户访问 https://ai.suyang.site
    ↓
nginx (反向代理, 端口 80/443)
    ↓
Astro 服务 (开发环境: localhost:4321)
    ↓
静态生成页面 + API 路由
    ↓
Markdown 文件 → HTML (构建时转换)
```

## ⚙️ 配置文件说明

### site.config.json

```json
{
  "knowledge": {
    "basePath": "/home/ubuntu/my_knowledge",  # 知识库根目录
    "showDirs": ["01-学习笔记", "02-工作日志", ...],  # 显示的顶级目录
    "excludeDirs": [".obsidian", ".git", ".claude", "00-规范"],  # 排除的目录
  },
  "interview": {
    "basePath": "/home/ubuntu/my_knowledge/03-面试准备/面试题库"
  }
}
```

## 📝 文档规范

### 知识库文档格式

```markdown
---
title: 文档标题
date: 2026-03-28
tags: [JVM, Java, 面试]
category: Java后端
status: 已发布
---

# 文档标题

## 第一章

内容...

## 第二章

[[相关文档/]]  # Obsidian wikilink
```

### 面试题库文档格式（卡片式）

```markdown
---
title: JVM 内存模型
date: 2026-03-20
category: Java后端
difficulty: Medium
tags: [JVM, 内存模型]
status: 已发布
---

# JVM 内存模型

## 堆内存 (Heap)

堆是线程共享的内存区域...

### 关键词
- 年轻代
- 老年代

### 常见问题

**Q: 堆内存溢出怎么处理？**
: 调整堆大小、检查内存泄漏...

---

## 虚拟机栈 (VM Stack)

虚拟机栈是线程私有的...
```

## 🔄 工作流程

### 1. 内容创作流程

```
编写 Markdown 文档
    ↓
推送到 GitHub (my_knowledge 仓库)
    ↓
服务器自动/手动拉取更新
    ↓
触发网站重新构建
    ↓
发布到 ai.suyang.site
```

### 2. 网站开发流程

```
本地修改代码 (terminal-mind)
    ↓
git push origin main
    ↓
服务器拉取更新
    ↓
npm run build (构建静态页面)
    ↓
服务自动重启
```

### 3. 部署命令

```bash
# 启动开发服务器
cd ~/terminal-mind && npm run dev

# 构建生产版本
cd ~/terminal-mind && npm run build

# 重启服务
pkill -f "astro dev"
cd ~/terminal-mind && nohup npm run dev > /tmp/astro.log 2>&1 &

# 查看日志
tail -f /tmp/astro.log
```

## 🛠️ 常用维护命令

```bash
# 查看 nginx 状态
sudo systemctl status nginx

# 重启 nginx
sudo systemctl restart nginx

# 查看证书状态
sudo certbot certificates

# 更新证书
sudo certbot renew

# 查看端口占用
netstat -tlnp | grep 4321
```

## 📌 注意事项

1. **Wikilink 语法**：`[[文档名]]` 或 `[[文件夹/文档名]]`
   - 相对路径：当前文档所在目录
   - 绝对路径：从 my_knowledge 根目录

2. **目录索引**：每个子目录需要 `.md` 文件作为展示页面
   - 文件名应与文件夹名相同（如 `AI热点新闻/` 需要 `AI热点新闻.md`）

3. **排除文件**：以下文件不会显示在网站上
   - `README.md`
   - `CLAUDE.md`
   - 以 `CLAUDE` 开头的文件
   - `.git`, `.obsidian`, `.claude` 目录

4. **面试题**：新格式基于知识点卡片，每个 `##` 是一个知识卡片

## 🔒 安全配置

- **防火墙**：UFW 已配置开放 80, 443 端口
- **SSL**：Let's Encrypt 自动证书
- **域名**：ai.suyang.site

## 📊 构建统计

- 总页面数：73+
- 知识库页面：70+
- 面试题页面：3+
