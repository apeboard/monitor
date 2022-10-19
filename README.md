# Quick Setup Script
1. Install dependencies
```sh
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -;
sudo apt-get install -y nodejs;
npm install pm2 -g;
pm2 install pm2-logrotate;
git clone https://github.com/apeboard/monitor.git;
npm install -C ./monitor;
```

1. Add `pm2.json`
```sh
nano pm2.json;
```
```
{
  "apps": [
    {
      "name": "monitor",
      "cwd": "./monitor",
      "script": "npm start"
    }
  ]
}
```

3. Start `pm2` service
```sh
pm2 start pm2.json;
```
