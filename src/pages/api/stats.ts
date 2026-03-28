import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface KnowledgeConfig {
  basePath: string;
  showDirs: string[];
  excludeDirs: string[];
}

const defaultConfig: KnowledgeConfig = {
  basePath: '/home/ubuntu/my_knowledge',
  showDirs: [],
  excludeDirs: ['.obsidian', '.git', 'Excalidraw', 'Prompt', '公众号']
};

function getKnowledgeConfig(): KnowledgeConfig {
  try {
    const configPath = path.join(process.cwd(), 'config', 'site.config.json');
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return { ...defaultConfig, ...configData.knowledge };
    }
  } catch (e) {
    console.error('Failed to load config:', e);
  }
  return defaultConfig;
}

function countFiles(dir: string, config: KnowledgeConfig, extensions: string[] = ['.md', '.mdx']): number {
  let count = 0;
  
  if (!fs.existsSync(dir)) return 0;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    // 排除指定目录
    if (config.excludeDirs.includes(item.name)) continue;
    
    // 如果 showDirs 不为空，则只显示指定目录
    if (config.showDirs.length > 0 && !config.showDirs.includes(item.name) && item.isDirectory()) {
      continue;
    }
    
    if (item.isDirectory()) {
      count += countFiles(fullPath, config, extensions);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (extensions.includes(ext)) {
        count++;
      }
    }
  }
  
  return count;
}

export const GET: APIRoute = async () => {
  try {
    const config = getKnowledgeConfig();
    const knowledgeCount = countFiles(config.basePath, config);
    
    // Interview path remains simple for now
    const contentBase = path.join(process.cwd(), 'public', 'content');
    const interviewPath = path.join(contentBase, 'interview');
    const interviewCount = countFiles(interviewPath, { ...defaultConfig, basePath: interviewPath });
    
    return new Response(JSON.stringify({
      knowledgeCount,
      interviewCount,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
