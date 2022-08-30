# Quick Setup Script
1. Install dependencies
```sh
git clone https://github.com/apeboard/monitor.git;
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -;
sudo apt-get install -y nodejs;
npm install pm2 -g;
pm2 install pm2-logrotate;
```

2. Add `pm2.json`
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
