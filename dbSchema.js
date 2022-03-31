const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = process.env.dbName;
const username = process.env.username;
const password = process.env.password;
const dburl = `mongodb+srv://${username}:${password}@cluster0.b0dyt.mongodb.net/test/${dbName}`
module.exports = {MongoClient,dburl,mongodb}

