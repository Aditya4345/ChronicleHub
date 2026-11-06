-- Newsletter Table
CREATE TABLE IF NOT EXISTS newsletters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),

    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Subscriber Table
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'unsubscribed')),

    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
