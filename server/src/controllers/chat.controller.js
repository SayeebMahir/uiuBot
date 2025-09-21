import { z } from 'zod';
import Message from '../models/Message.js';

const chatSchema = z.object({
  content: z.string().min(1),
  threadId: z.string().optional(),
});

export async function sendMessage(req, res) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });
  const { content, threadId = 'default' } = parsed.data;

  await Message.create({ userId: req.user.id, role: 'user', content, threadId });

  // Simple direct check for calendar keywords
  if (content.toLowerCase().includes('calendar')) {
    const pdfUrl = '/static/documents/academic-calendar.pdf';
    const answer = `Here's the Academic Calendar for your reference. You can view or download it here: [View Academic Calendar](${pdfUrl})`;
    const saved = await Message.create({ userId: req.user.id, role: 'assistant', content: answer, threadId });
    return res.json({ message: answer, threadId });
  }

  // Default response
  const saved = await Message.create({ userId: req.user.id, role: 'assistant', content: 'Thanks for your question. I will fetch university info soon.', threadId });
  return res.json({ message: saved.content, threadId });
}

export async function getHistory(req, res) {
  const threadId = String(req.query.threadId || 'default');
  const items = await Message.find({ userId: req.user.id, threadId }).sort({ createdAt: 1 });
  res.json(items.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt })));
}

