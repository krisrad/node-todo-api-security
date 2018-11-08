const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5bdf2139ad64231524f21fd31';

if (!ObjectID.isValid(id)) {
    // return console.log("ObjectId is not valid", id);
}

Todo.find({_id:id}).then((todos)=>{
    console.log('Todos:', todos);
});

Todo.findOne({_id:id}).then((todo)=>{
    console.log('Todo:', todo);
});

Todo.findById(id).then((todo)=>{
    if (!todo) {
        return console.log("ID not found");
    }
    console.log('TodoById:', todo);
}).catch((e)=>console.log(e));