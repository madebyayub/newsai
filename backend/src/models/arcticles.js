const db = require('../config/database');

class Article {
  static async create({ url, title, content, category }) {
    const query = `
      INSERT INTO articles (url, title, content, category)
      VALUES ($1, $2, $3, $4)
      RETURNING url
    `;
    
    try {
      const { rows } = await db.query(query, [url, title, content, category]);
      return rows[0];
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  static async findByUrl(url) {
    const query = 'SELECT * FROM articles WHERE url = $1';
    
    try {
      const { rows } = await db.query(query, [url]);
      return rows[0];
    } catch (error) {
      console.error('Error finding article:', error);
      throw error;
    }
  }
}

module.exports = Article;