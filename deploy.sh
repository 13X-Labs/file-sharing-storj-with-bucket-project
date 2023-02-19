#/bin/sh

# Git Checkout & Git pull
git checkout master
git pull

# Install dependencies
npm install

# Build the app
npm run build

# Export the app
npm run export

# Deploy to Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID=9dcb06f92077d2d922d47c332b54cd32 npx wrangler pages publish ./out