-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('aluminum', 'glass')),
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (password is plain text as requested)
INSERT INTO users (username, password) VALUES 
('admin', 'admin123'),
('agent1', 'password'),
('manager', 'manager123');

-- Insert sample inventory data
INSERT INTO inventory (type, quantity, description) VALUES 
('aluminum', 150, 'Aluminum sheets 2mm thickness'),
('glass', 75, 'Tempered glass panels 5mm'),
('aluminum', 200, 'Aluminum rods 10mm diameter'),
('glass', 120, 'Clear glass sheets 3mm'),
('aluminum', 80, 'Aluminum tubes 25mm diameter'),
('glass', 95, 'Frosted glass panels 6mm');
