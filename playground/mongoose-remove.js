const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

// Todo.findOneAndRemove({text:'go to temple'}).then((doc)=>{
//     console.log('removed..', doc);
// });

Todo.findByIdAndRemove('5bdfee02d6057d9dfdeee5ac').then((doc)=>{
    console.log('removed...', doc);
});