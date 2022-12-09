module.exports = {
  // this is to proactively fix the occasional issue
  // where the next.js dev server doesn't detect changes in docker
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};