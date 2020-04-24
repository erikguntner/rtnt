require('dotenv').config();

module.exports = {
  env: {
    GRAPH_HOPPER_KEY: process.env.GRAPH_HOPPER_KEY,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    PG_CONN_STRING: process.env.PG_CONN_STRING,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    NOW_URL: process.env.NOW_URL
  },
};
