require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Invalid Object Id');
    }
    Todo.findById(id).then((todo)=>{
        if (!todo) {
            res.status(404).send('Todo not found');
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(404);
    });    
});

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Invalid Object Id');
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if (!todo) {
            res.status(404).send('Todo not found');
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400);
    })
});

app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404);
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
        if (!todo) {
            return res.status(404);
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400);
    });

})

app.post("/users", (req, res)=> {
    var userbody = _.pick(req.body, ['email', 'password']);
    var user = new User(userbody);
    console.log(user);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
})

// POST /users/login {email, password}
app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(401).send(e);
    });
})

app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}
