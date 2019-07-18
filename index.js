const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const collectionName = 'test-mongo-index';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(async err => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const collection = db.collection(collectionName);

  await collection.createIndexes([{
    key: {
      id: 1
    },
    name: 'myIdIndex',
    unique: true,
  }], {
    background: false
  });

  let longId = '';
  for(let i = 0; i < 3000; ++i) {
    const x = Math.floor(10 * Math.random()).toString();
    longId += x;
  }
  const record = {
    id: longId
  };

  try {
    const result = await collection.insertOne(record);
    // console.log('RESULT', result);
    const r = await collection.find({id: longId}).explain();
    console.log('EXPLAIN', r);
  } catch(e) {
    console.error(e);
  }



  client.close();

  process.exit();
});


// bedrock.events.on('bedrock-mongodb.ready', async () => {
//   await promisify(database.openCollections)([collectionName]);
//
  // await promisify(database.createIndexes)([{
  //   collection: collectionName,
  //   fields: {id: 1},
  //   options: {unique: true, background: false}
  // }]);
// });
//
// bedrock.events.on('bedrock.started', async () => {
//   let longId = '';
//   for(let i = 0; i < 3000; ++i) {
//     const x = Math.floor(10 * Math.random()).toString();
//     longId += x;
//   }
//   console.log('IIIIIII', longId);
//   const record = {
//     id: longId
//   };
//
//   const result = await database.collections[collectionName].insert(
//     record, database.writeOptions);
//   console.log('RRRRRRRRR', result);
//   return result;
// });
//
