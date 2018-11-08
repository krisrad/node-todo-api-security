const { MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log(`Unable to connect to mongodb: ${error}`);
    }
    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

   // findone and delete
//    db.collection('Todos').findOneAndUpdate({
//        _id:new ObjectID('5bdacdfdd6057d9dfdeeacfa')
//     }, {
//         $set: {
//             text: 'walk the elephant'
//         }
//     }, {
//         returnOriginal: false
//     }).then((result)=>{
//        console.log(result);
//    })

   db.collection('Users').findOneAndUpdate({
    _id:new ObjectID('5bdab8e2e7fe541dcc73a568')
    }, {
        $set: {
            name : 'Andrew'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    })

    client.close();
});