const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost/issuetracker';

function testWithCallbacks(callback) {
    console.log('\n--- testWithCallbacks ---');
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect((err, client) => {
        if (err) {
            callback(err);
            return;
        }
        const db = client.db();
        const collection = db.collection('employees');

        const employee = { id: 1, name: "A. Callback", age: 23 };
        collection.insertOne(employee, (err, result) => {
            if (err) {
                client.close();
                callback(err);
                return;
            }
            console.log('result of insertion: \n', result.insertedId);
            collection.find({ _id: result.insertedId }).toArray((err, docs) => {
                if (err) {
                    client.close();
                    callback(err);
                    return;
                }
                console.log('result of find: \n', docs);
                client.close();
                callback(err);
            })
        })
    });
}

testWithCallbacks(err => {
    if (err) {
        console.log(err);
    }
    testWithAsync();
})

async function testWithAsync() {
    console.log('\n-- testWithAsync ---');
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('employees');
        const employee = { id: 2, name: 'B. Async', age: 16 };
        const result = await collection.insertOne(employee);
        console.log('Result of inset:\n', result.insertedId);
        const docs = await collection.find({_id: result.insertedId}).toArray();
        console.log('Result of find:\n', docs)
    } catch(err) {
        console.log(err);
    } finally {
        client.close();
    }
}