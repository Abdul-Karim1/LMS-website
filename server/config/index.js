"use strict";
const env = process.env.NODE_ENV || "development";
// Load server configuration
const nodeEnv = require(`${__dirname}/env/${env}`);
const commonEnv = require("./common");
const config = {
  ...nodeEnv,
  ...commonEnv,
};

module.exports = config;
