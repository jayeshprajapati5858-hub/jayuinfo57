
// This configuration is used by the 'server.cjs' file running on the backend.
// The frontend connects to the backend API via HTTP, not directly to this DB.

export const DB_CONFIG = {
  connectionString: "postgresql://ashish:ashish@152.53.240.143:5432/jayuinfo",
  host: "152.53.240.143",
  port: 5432,
  user: "ashish",
  password: "ashish",
  database: "jayuinfo",
  type: "postgres",
  status: "active",
  note: "Run 'node server.cjs' to start the API."
};
