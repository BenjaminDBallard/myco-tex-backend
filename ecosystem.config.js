module.exports = {
  apps: [
    {
      name: 'mycotex',
      script: 'mycotex-prod/current/dist/index.js',

      // Logging
      out_file: './out.log',
      error_file: './error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json'
    }
  ],

  deploy: {
    production: {
      user: 'benb',
      host: '159.203.123.45',
      ref: 'origin/main',
      repo: 'https://github.com/BenjaminDBallard/myco-tex-backend.git',
      path: '/home/benb/mycotex-prod',
      'pre-setup': 'apt-get install git ; ls -la',
      'post-setup': 'ls -la',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build  && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
