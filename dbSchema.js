const mongodb = require('mongodb');
const dotenv = require('dotenv');
require('dotenv').config();
const MongoClient = mongodb.MongoClient;
const dbName = process.env.MONGO_DB;
// const username = process.env.username;
// const password = process.env.password;
const dburl = process.env.MONGO_URL
module.exports = {MongoClient,dburl,mongodb}

