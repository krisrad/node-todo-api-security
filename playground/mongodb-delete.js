const { MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log(`Unable to connect to mongodb: ${error}`);
    }
    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

   // delete many
//    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
//        console.log(result);
//    })

   // delete one
//    db.collection('Todos').deleteOne({text:'Eat lunch'}).then((results) => {
//        console.log(result);
//    })

   // findone and delete
   db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
       console.log(result);
   })

    client.close();
});