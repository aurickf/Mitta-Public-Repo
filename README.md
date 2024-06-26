## Important Notice

This code made to public for code review purpose only, therefore some code on this repo has been removed and will not work properly.

## Project Recap

This repository stores Kalyana's Membership application.

This application created on Typescript and NextJS, using MongoDB as database and AWS as file storage.

## Getting Started

Run the development server:

```bash
yarn dev
```

Run production server

```bash
yarn start
```

## Environment Config

### .env.local

```
HOSTNAME=localhost
PORT=3000

#NextAuth Config
NEXTAUTH_SECRET=""

#Google OAuth Config
GOOGLE_ID=""
GOOGLE_SECRET=""

#Facebook OAuth Config
FACEBOOK_ID=""
FACEBOOK_SECRET=""

#Mailer Config
EMAIL_SERVER_PASSWORD=""

#AWS S3 Config
AWS_USERNAME=""
AWS_ACCESSKEY_ID=""
AWS_SECRET_ACCESSKEY=""
AWS_REGION_NAME=""
```

### .env.development.local / .env.production.local

```
#MongoDB Connection String
DB_URI=""

EMAIL_ADMIN=""

#Zoom Server to Server OAuth API
ZOOM_ACCOUNT_ID=""
ZOOM_CLIENT_ID=""
ZOOM_CLIENT_SECRET=""
ZOOM_SECRET_TOKEN=""

#AWS S3 Config
AWS_BUCKET=""
AWS_BUCKET_ARCHIVE=""
```
