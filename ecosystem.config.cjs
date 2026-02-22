// PM2 Ecosystem Config — AstraNodes
// SQLite requires single writer: exec_mode must be "fork" (not "cluster")
// Generated/used by deploy.sh — edit environment values as needed.

module.exports = {
  apps: [
    {
      name: "astranodes-api",
      script: "./backend/src/server.js",
      cwd: "/opt/astranodes",           // Updated by deploy.sh
      interpreter: "node",
      interpreter_args: "--experimental-vm-modules",
      exec_mode: "fork",                // SQLite: single process only
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      restart_delay: 3000,             // 3 s cooldown between restarts
      max_restarts: 10,
      env_production: {
        NODE_ENV: "production",
        // All other vars are loaded from backend/.env at runtime
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/pm2/astranodes-error.log",
      out_file: "/var/log/pm2/astranodes-out.log",
      merge_logs: true,
    },
  ],
}
