const bedrock = require('bedrock');
const database = require('bedrock-mongodb');
const {promisify} = require('util');

const collectionName = 'test-mongo-index';

bedrock.events.on('bedrock-mongodb.ready', async () => {
  await promisify(database.openCollections)([collectionName]);

  await promisify(database.createIndexes)([{
    collection: collectionName,
    fields: {id: 1},
    options: {unique: true, background: false}
  }]);
});

bedrock.events.on('bedrock.started', async () => {
  let longId = '';
  for(let i = 0; i < 3000; ++i) {
    const x = Math.floor(10 * Math.random()).toString();
    longId += x;
  }
  console.log('IIIIIII', longId);
  const record = {
    id: longId
  };

  const result = await database.collections[collectionName].insert(
    record, database.writeOptions);
  console.log('RRRRRRRRR', result);
  return result;
});

bedrock.start();

// MONGO 3.X PRODUCES
/*
(node:11649) UnhandledPromiseRejectionWarning: MongoError: WiredTigerIndex::insert: key too large to index, failing  3012 { : "486038657097590591094921571768013919539636479074471573249380079538392369870834888895514000535894759912368850322158837914721938820280203386443112662293..." }
    at Function.MongoError.create (/home/matt/dev/test-mongo-index/node_modules/mongodb-core/lib/error.js:31:11)
    at toError (/home/matt/dev/test-mongo-index/node_modules/mongodb/lib/utils.js:139:22)
    at /home/matt/dev/test-mongo-index/node_modules/mongodb/lib/collection.js:668:23
    at handleCallback (/home/matt/dev/test-mongo-index/node_modules/mongodb/lib/utils.js:120:56)
    at resultHandler (/home/matt/dev/test-mongo-index/node_modules/mongodb/lib/bulk/ordered.js:421:14)
    at /home/matt/dev/test-mongo-index/node_modules/mongodb-core/lib/connection/pool.js:469:18
    at process._tickCallback (internal/process/next_tick.js:61:11)
(node:11649) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
*/
