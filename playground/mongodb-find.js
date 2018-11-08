const { MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log(`Unable to connect to mongodb: ${error}`);
    }
    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5bdacdfdd6057d9dfdeeacfa')}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch Todos.", err);
    // });

    db.collection('Todos').find().count().then((count)=>{
        console.log('Todos count: ', count);
    }, (err) => {
        console.log("Unable to fetch Todos.", err);
    });

    client.close();
});
