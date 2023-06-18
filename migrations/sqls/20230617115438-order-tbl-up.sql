CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(70) CHECK ("status" IN('active', 'complete')) NOT NULL DEFAULT 'active'
);