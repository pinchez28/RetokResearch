import { sanitizeRichText } from '../../utils/sanitizeRichText.js';
import rateLimit from 'express-rate-limit';

/**
 * POST /api/ai/rewrite
 * Secure AI rewrite endpoint
 */
export const rewriteJobDescription = async (req, res) => {
  try {
    const { content, tone } = req.body;

    if (!content)
      return res
        .status(400)
        .json({ success: false, message: 'Content required' });

    // 🔹 AI rewrite logic (placeholder)
    const rewritten = await fakeAIRewrite(content, tone);

    // 🔐 SANITIZE AI OUTPUT
    const safeHtml = sanitizeRichText(rewritten);

    res.json({
      success: true,
      content: safeHtml,
    });
  } catch (err) {
    console.error('AI rewrite error:', err);
    res.status(500).json({ success: false, message: 'AI rewrite failed' });
  }
};

// Mock until AI provider is plugged in
const fakeAIRewrite = async (content, tone) => {
  return `<h2>Improved (${tone})</h2><p>${content}</p>`;
};
