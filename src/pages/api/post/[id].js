import { promises as fs } from 'fs';
import path from 'path';

// Simple JSON-backed storage fallback (replace with DB if available)
const dataFile = path.join(process.cwd(), 'public', 'data', 'posts.json');

async function readPosts() {
  try {
    const txt = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return [];
  }
}

async function writePosts(posts) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(posts, null, 2), 'utf8');
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const posts = await readPosts();
    const found = posts.find(p => String(p._id || p.id) === String(id));
    if (!found) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json({ data: found });
  }

  if (req.method === 'PUT') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON' });
    }

    const posts = await readPosts();
    const idx = posts.findIndex(p => String(p._id || p.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Not found' });

    posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString() };
    await writePosts(posts);
    return res.status(200).json({ data: posts[idx] });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}
