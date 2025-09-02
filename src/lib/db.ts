import Database from 'better-sqlite3';

// Database connection singleton
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Initialize database
    db = new Database('clinic.db');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize schema
    initializeDatabase();
  }
  
  return db;
}

function initializeDatabase() {
  if (!db) return;
  
  try {
    // Create tables
    db.exec(`
      -- Clinic management
      CREATE TABLE IF NOT EXISTS clinics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- User management with roles
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clinic_id INTEGER NOT NULL,
          username TEXT NOT NULL UNIQUE,
          email TEXT,
          phone TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('owner', 'reception', 'doctor', 'pharmacy', 'accountant')),
          full_name TEXT NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      );

      -- Audit logs
      CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clinic_id INTEGER NOT NULL,
          user_id INTEGER,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id INTEGER,
          old_values TEXT,
          new_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Insert demo data
    const clinic = db.prepare('SELECT id FROM clinics WHERE id = 1').get();
    if (!clinic) {
      db.prepare(`
        INSERT INTO clinics (id, name, address, phone, email) VALUES 
        (1, 'Demo Clinic Karachi', '123 Main Road, Gulshan-e-Iqbal, Karachi', '+92-21-1234567', 'demo@clinic.pk')
      `).run();
    }

    // Insert demo users with hashed passwords
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    if (!existingUser) {
      // Using pre-hashed password for 'password'
      const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
      
      db.prepare(`
        INSERT INTO users (clinic_id, username, email, phone, password_hash, role, full_name) VALUES 
        (1, 'admin', 'admin@clinic.pk', '+92-300-1234567', ?, 'owner', 'Dr. Ahmed Ali'),
        (1, 'reception', 'reception@clinic.pk', '+92-300-2345678', ?, 'reception', 'Sarah Khan'),
        (1, 'doctor1', 'doctor@clinic.pk', '+92-300-3456789', ?, 'doctor', 'Dr. Fatima Sheikh'),
        (1, 'pharmacy', 'pharmacy@clinic.pk', '+92-300-4567890', ?, 'pharmacy', 'Muhammad Hassan')
      `).run(hashedPassword, hashedPassword, hashedPassword, hashedPassword);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default getDb;