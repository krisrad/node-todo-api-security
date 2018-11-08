const { MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log(`Unable to connect to mongodb: ${error}`);
    }
    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');
    db.collection('Todos').insertOne({
        text: 'Eat lunch',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo.', err);
        } 
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'RK',
        age: 42,
        location: 'chennai'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user.', err);
        } 
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });

    client.close();
});
