module.exports = {
  apps: [
    {
      name: "backend",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
