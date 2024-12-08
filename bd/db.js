const knex = require("knex")

const knexx = require('../knexfile');

const db = knex(knexx.development);
module.exports = db;