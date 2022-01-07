# node-album-api

## Requirements

* Node.js
* MySQL server (5.5+)

## Setup instructions

* clone this repo
* `npm install` or `yarn install`
* copy `.env.sample` as `.env`
* modify `.env` to set environment variables
* initialize MySQL db : copy-paste `init.sql` in MySQL console. Alternatively: `mysql -uroot -p < init.sql`
* Run: `npm start` (production mode) or `npm run dev` (development mode with auto-restart on code changes)
* Server URL is <http://localhost:5200>
