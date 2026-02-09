# reverse-proxy

<!-- sudo certbot certonly --webroot -w /var/www/certbot -d shorturl.bombs.kr -d s.bombs.kr -->

### 기존 인증서에 도메인 추가
```bash
# --expand 옵션
sudo certbot certonly --webroot -w /var/www/certbot \
  -d {{already_existing_server_name}} -d {{now_adding_server_name}} --expand
```

### initial setup시
```bash
sudo mkdir -p /var/www/certbot # 이 디렉토리를 만들어줘야 certbot 명령어가 작동을 함
sudo certbot certonly --webroot -w /var/www/certbot -d {{name}} # webroot 방식으로 인증
```