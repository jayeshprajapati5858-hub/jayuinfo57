
// Firebase has been removed as requested.
// PostgreSQL Connection Configuration
export const DB_CONFIG = {
  connectionString: "postgresql://ashish:ashish@152.53.240.143:5432/jayuinfo",
  type: "postgres",
  note: "This connection string should be used in a backend server (Node.js/Express), not directly in the browser."
};

// Application is currently running in local mode
export const isOfflineMode = true;
