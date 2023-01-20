/** @type {import('next').NextConfig} */

require("dotenv").config();
const nextConfig = {
  reactStrictMode: true,
  env:{
    ID: process.env.ID,
    SECRET: process.env.SECRET,
    ACCESSGRANT: process.env.ACCESSGRANT,
    ENDPOINT: process.env.ENDPOINT,
    STORJ_AUTH: process.env.STORJ_AUTH,
    LINK_SHARE: process.env.LINK_SHARE,
    BUCKET_NAME: process.env.BUCKET_NAME
  }
}

module.exports = nextConfig
