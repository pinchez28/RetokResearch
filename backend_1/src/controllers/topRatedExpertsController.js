// controllers/topRatedExpertsController.js
import TopRatedExpert from '../models/TopRatedExpert.js';
import Expert from '../models/Expert.js'; // create this dummy Expert model if you want populate to work

// Helper: build meta safely
async function buildExpertMeta(expertId) {
  if (!Expert) return null; // fallback if Expert model doesn't exist
  const expert = await Expert.findById(expertId).select(
    'name avatarUrl rating'
  );
  if (!expert) return null;
  return {
    name: expert.name,
    avatarUrl: expert.avatarUrl,
    rating: expert.rating,
  };
}

// Get Top Rated Experts
export const getTopRatedExperts = async (req, res) => {
  try {
    const list = await TopRatedExpert.find({}).sort({ position: 1 });
    // Map to ensure meta is always returned
    const experts = await Promise.all(
      list.map(async (ex) => ({
        _id: ex._id,
        expertId: ex.expertId,
        meta: ex.meta ||
          (await buildExpertMeta(ex.expertId)) || {
            name: 'Unknown',
            avatarUrl: '/img/default-avatar.png',
            rating: 0,
          },
        position: ex.position,
      }))
    );
    res.json({ success: true, experts });
  } catch (err) {
    console.error('GET Top Rated Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create Top Rated Expert
export const createTopRatedExpert = async (req, res) => {
  try {
    const { expertId, position } = req.body;
    if (!expertId || !position)
      return res
        .status(400)
        .json({ success: false, message: 'Missing expertId or position' });

    if (position < 1 || position > 5)
      return res
        .status(400)
        .json({ success: false, message: 'Position must be 1–5' });

    const existing = await TopRatedExpert.findOne({ position });
    if (existing)
      return res
        .status(409)
        .json({
          success: false,
          message: `Position ${position} is already taken.`,
        });

    const meta = await buildExpertMeta(expertId);
    const newEntry = await TopRatedExpert.create({ expertId, position, meta });

    res.json({ success: true, expert: newEntry });
  } catch (err) {
    console.error('CREATE Top Rated Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Top Rated Expert
export const updateTopRatedExpert = async (req, res) => {
  try {
    const { position } = req.params;
    const { expertId } = req.body;

    if (position < 1 || position > 5)
      return res
        .status(400)
        .json({ success: false, message: 'Position must be 1–5' });

    const meta = await buildExpertMeta(expertId);
    const updated = await TopRatedExpert.findOneAndUpdate(
      { position },
      { expertId, meta },
      { new: true, upsert: true }
    );

    res.json({ success: true, expert: updated });
  } catch (err) {
    console.error('UPDATE Top Rated Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Top Rated Expert
export const deleteTopRatedExpert = async (req, res) => {
  try {
    const { position } = req.params;
    await TopRatedExpert.findOneAndDelete({ position });
    res.json({ success: true, message: `Position ${position} cleared.` });
  } catch (err) {
    console.error('DELETE Top Rated Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reorder Top Rated Experts
export const reorderTopRatedExperts = async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list))
      return res
        .status(400)
        .json({ success: false, message: 'Invalid payload format' });

    const seenPositions = new Set();
    for (const entry of list) {
      if (!entry.expertId || !entry.position)
        return res
          .status(400)
          .json({ success: false, message: 'Missing fields in entry' });

      if (entry.position < 1 || entry.position > 5)
        return res
          .status(400)
          .json({ success: false, message: 'Position must be 1–5' });

      if (seenPositions.has(entry.position))
        return res
          .status(400)
          .json({ success: false, message: 'Duplicate positions detected' });

      seenPositions.add(entry.position);
    }

    await TopRatedExpert.deleteMany({});
    for (const entry of list) {
      const meta = await buildExpertMeta(entry.expertId);
      await TopRatedExpert.create({
        expertId: entry.expertId,
        position: entry.position,
        meta,
      });
    }

    res.json({
      success: true,
      message: 'Top Rated Experts reordered successfully',
    });
  } catch (err) {
    console.error('REORDER Top Rated Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
