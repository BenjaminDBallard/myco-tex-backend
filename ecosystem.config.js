module.exports = {
  apps: [
    {
      name: 'mycotex',
      script: 'dist/index.js'
    }
  ],

  deploy: {
    production: {
      user: 'benb',
      host: '159.203.123.45',
      ref: 'origin/main',
      repo: 'https://github.com/BenjaminDBallard/myco-tex-backend.git',
      path: '/home/benb/mycotex-prod',
      node_args: '--experimental-specifier-resolution=node',
      env: {
        NODE_ENV: 'production'
      },
      'pre-setup': 'apt-get install git ; ls -la',
      'post-setup': 'ls -la',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
