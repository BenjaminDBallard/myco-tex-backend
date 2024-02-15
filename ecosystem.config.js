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
      ref: 'origin/master',
      repo: 'git@github.com:BenjaminDBallard/myco-tex-backend.git',
      path: '/home/benb/mycotex-prod',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
