const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'third test todo',
    completed: true,
    completedAt : 333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos', ()=> {
    it('should create a new Todo', (done)=>{
        var text = 'test todo text';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            })

        })
    });

    it('should not create a todo with invalid body', (done)=>{
        var text = "";
        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    });
});

describe('GET /todos', ()=>{
    it('should return all todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(3);
            })
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(res.body.todos.length).toBe(todos.length);
                    done();
                }).catch((err) => {
                    done(err);
                });
            })
    })
});

describe('GET /todos/:id', ()=>{
    it ('should return a todo', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done)=>{
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res)=>{
                expect(res.text).toBe('Todo not found')
            })
            .end(done);
    });

    it ('should return a 404 for non-object id', (done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .expect((res)=>{
                expect(res.text).toBe('Invalid Object Id')
            })
            .end(done);
    });

});

describe('DELETE /todos/:id', ()=>{
    it ('should remove a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
    });

    it ('should return 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it ('should return 404 if object id is invalid', (done)=>{
        request(app)
            .delete(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', ()=>{

    it('should update the todo', (done)=>{
        var id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text:'repair laptop', completed: true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('repair laptop');                
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toNotBe(null);
            })
            .end(done);
    });

    it ('should clear completedat when completedat is not updated', (done)=>{
        var id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({completed:false})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });

});