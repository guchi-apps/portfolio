module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
        PORT: 3105,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
