const express = require('express');
const router = express.Router();
const TopRatedExpert = require('../models/Expert');
const mongoose = require('mongoose');

// Placeholder auth middleware
function ensureAdmin(req, res, next) {
  // implement your JWT/session check
  // req.user.isAdmin etc
  // For now assume authenticated
  return next();
}

// GET top-rated public list (ordered)
router.get('/top-rated-experts', async (req, res) => {
  try {
    const list = await TopRatedExpert.find({})
      .sort({ position: 1 })
      .populate('expertId', 'name avatarUrl rating') // optional
      .lean();

    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin POST to set positions array (atomic-ish)
router.post('/admin/top-rated-experts', ensureAdmin, async (req, res) => {
  /**
   * Expect body:
   * { positions: [ { position: 1, expertId: "..." }, ... ] }
   */
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { positions } = req.body;
    if (!Array.isArray(positions)) {
      throw new Error('positions must be an array');
    }
    // validate positions 1..5 and unique
    const seenPos = new Set();
    for (const p of positions) {
      if (!p.position || !p.expertId)
        throw new Error('position & expertId required');
      if (p.position < 1 || p.position > 5)
        throw new Error('position must be 1..5');
      if (seenPos.has(p.position))
        throw new Error('duplicate positions not allowed');
      seenPos.add(p.position);
    }

    // Strategy: remove all existing and insert supplied positions.
    await TopRatedExpert.deleteMany({}, { session });

    const docs = positions.map((p) => ({
      expertId: p.expertId,
      position: p.position,
      meta: p.meta || {},
    }));

    await TopRatedExpert.insertMany(docs, { session });

    await session.commitTransaction();
    session.endSession();
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res
      .status(400)
      .json({ success: false, message: err.message || 'Bad request' });
  }
});

// PATCH single item (change position or expert)
router.patch('/admin/top-rated-experts/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { position, expertId, meta } = req.body;
  try {
    if (position && (position < 1 || position > 5)) {
      return res
        .status(400)
        .json({ success: false, message: 'position must be 1..5' });
    }

    const update = {};
    if (position) update.position = position;
    if (expertId) update.expertId = expertId;
    if (meta) update.meta = meta;

    const item = await TopRatedExpert.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
