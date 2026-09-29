import { query } from '../config/db.js';

export const getCategories = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "categories" ORDER BY "id" ASC');
    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
};
