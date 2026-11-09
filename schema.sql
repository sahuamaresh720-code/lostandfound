-- Create database schema for Lost & Found Portal

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    date_occurred DATE NOT NULL,
    image_path VARCHAR(500),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    approval_status VARCHAR(20) DEFAULT 'pending',
    recovery_status VARCHAR(20) DEFAULT 'unclaimed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    explanation TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_user ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(approval_status);
CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Phones, laptops, tablets, headphones, etc.'),
    ('Clothing', 'Jackets, sweaters, hats, scarves, etc.'),
    ('Books & Stationery', 'Textbooks, notebooks, pens, bags, etc.'),
    ('ID Cards & Documents', 'Student ID, passport, wallet, etc.'),
    ('Keys', 'Room keys, car keys, locker keys, etc.'),
    ('Accessories', 'Jewelry, watches, glasses, etc.'),
    ('Bags & Wallets', 'Backpacks, handbags, purses, wallets, etc.'),
    ('Others', 'Items that do not fit in other categories')
ON CONFLICT (name) DO NOTHING;
