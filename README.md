# reverse-proxy


```bash
sudo mkdir -p /var/www/certbot

sudo certbot certonly --webroot -w /var/www/certbot -d {{name}}
```
<!-- sudo certbot certonly --webroot -w /var/www/certbot -d shorturl.bombs.kr -d s.bombs.kr -->