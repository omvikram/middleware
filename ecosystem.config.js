module.exports = {
  apps: [
    {
      name: "middleware",
      script: "./server/index.js",
      watch: false,
      exec_mode: "cluster",
      instances: 2,
      autorestart: true,
      max_memory_restart: "1G"
    }
  ]
};
