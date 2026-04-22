module.exports = {
  apps: [
    {
      name: 'multisoft-next',
      cwd: './frontend-next',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
    {
      name: 'multisoft-node-api',
      cwd: './server/multisoft',
      script: './bin/www',
      interpreter: 'C:/Users/%USERNAME%/AppData/Roaming/nvm/v12.22.12/node.exe',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
    {
      name: 'multisoft-django',
      cwd: '.',
      script: 'gunicorn',
      args: 'multisoft_informes.wsgi:application --bind 0.0.0.0:8000',
      interpreter: './venv/Scripts/python.exe',
      env: {
        DJANGO_SETTINGS_MODULE: 'multisoft_informes.settings.production',
      },
    },
  ],
};
