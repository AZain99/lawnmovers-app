Quick upload instructions — Roman Urdu

1) Local build already available as `dist/` and `dist.zip` in project root.

2) Recommended (rsync) — replace USER, server, domain path: 

```bash
# backup remote public_html first
ssh USER@yourserver "cd /home/USER/domains/yourdomain.net && mkdir backup_$(date +%F_%T) && mv public_html/* backup_$(date +%F_%T)/ || true"

# upload dist contents and .htaccess
rsync -av --delete dist/ USER@yourserver:/home/USER/domains/yourdomain.net/public_html/
# upload .htaccess too (if rsync above didn't include hidden files):
scp .htaccess USER@yourserver:/home/USER/domains/yourdomain.net/public_html/.htaccess

# set permissions on server
ssh USER@yourserver "cd /home/USER/domains/yourdomain.net/public_html && find . -type d -exec chmod 755 {} \; && find . -type f -exec chmod 644 {} \;"
```

3) If you used DirectAdmin file manager (GUI):
- Upload `dist.zip` to `public_html` and extract there. Ensure `.htaccess` is present in `public_html` (you might need to upload it separately because some file managers hide dotfiles).

4) Remove old dev files (only if you are sure):
```bash
ssh USER@yourserver
cd /home/USER/domains/yourdomain.net/public_html
rm -rf src node_modules package.json vite.config.ts index.html # be careful
exit
```

5) Verify from your machine:
```bash
curl -I https://yourdomain.net/
curl -I https://yourdomain.net/assets/index-ByrF9awc.js
```

6) If site is served from a subfolder (e.g., /admin_dashboard/), edit `vite.config.ts` locally, set `base: '/admin_dashboard/'`, rebuild (`npm run build-only`), then upload dist to `public_html/admin_dashboard/`.
