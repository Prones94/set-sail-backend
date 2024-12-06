require('dotenv').config();
const { Pool } = require('pg');

describe('PostgreSQL Connection', () => {
  let pool;

  beforeAll(() => {
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should connect to the PostgreSQL database', async () => {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('PostgreSQL Response:', res);
      expect(res).toHaveProperty('rows');
      expect(res.rows.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('PostgreSQL connection failed:', error);
      throw error;  
    }
  });
});
