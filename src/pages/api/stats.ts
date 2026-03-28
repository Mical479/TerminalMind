import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

function countFiles(dir: string, extensions: string[] = ['.md', '.mdx']): number {
  let count = 0;
  
  if (!fs.existsSync(dir)) return 0;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      count += countFiles(fullPath, extensions);
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
    // Get the content base path
    const contentBase = path.join(process.cwd(), 'public', 'content');
    const knowledgePath = path.join(contentBase, 'knowledge');
    const interviewPath = path.join(contentBase, 'interview');
    
    const knowledgeCount = countFiles(knowledgePath);
    const interviewCount = countFiles(interviewPath);
    
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
