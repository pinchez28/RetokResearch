import mongoose from 'mongoose';

/**
 * Runs a function inside a MongoDB transaction.
 * Falls back to non-transactional execution if unsupported.
 */
export const withTransaction = async (fn) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    // 🟡 Mongo standalone fallback
    if (
      err?.codeName === 'IllegalOperation' ||
      err?.message?.includes('Transaction numbers are only allowed')
    ) {
      return fn(null); // run without transaction
    }

    throw err;
  }
};
