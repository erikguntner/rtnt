// const withCss = require('@zeit/next-css');
// require('dotenv').config();

// module.exports = withCss({
//   env: {
//     GRAPH_HOPPER_KEY: process.env.GRAPH_HOPPER_KEY,
//     MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
//   },
// });

require('dotenv').config();

module.exports = {
  env: {
    GRAPH_HOPPER_KEY: process.env.GRAPH_HOPPER_KEY,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
};
