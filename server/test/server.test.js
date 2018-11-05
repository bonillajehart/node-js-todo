const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let existing_todo = [{
	_id : new ObjectID(),
	text : "First test todo"
}, {
	_id : new ObjectID(),
	text : "second test todo",
	completed : true,
	completed_at : 123
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(existing_todo);
	}).then(() => done());
});

describe("POST /todos", () => {
	it("should create a new todo", (done) => {
		let text = "new todo from test";

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((response) => {
				expect(response.body.text).toBe(text);
			})
			.end((err, response) => {
				if(err){
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((err) => done(err));
			});
	});

	it("should not create a new todo with invalid data", (done) =>{
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, response) => {
				if(err){
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((err) => done(err));
			});
	});
});

describe("GET /todos", () => {
	it("should get all todo", (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((response) => {
				expect(response.body.todos.length).toBe(2)
			})
			.end(done)
	});
});

describe("GET /todos/:id", () => {
	it("should get todo doc", (done) => {
		request(app)
			.get(`/todos/${existing_todo[0]._id.toHexString()}`)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(existing_todo[0].text);
			})
			.end(done)
	});

	it("should return 404 if todo not found", (done) => {
		let new_id = new ObjectID();
		request(app)
			.get(`/todos/${new_id.toHexString()}`)
			.expect(404)
			.end(done)
	});

	it("should return 404 if not valid ObjectID", (done) => {
		request(app)
			.get(`/todos/1234`)
			.expect(404)
			.end(done)
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		let new_todo_obj = { 
			_id : new ObjectID(), 
			text : 'Test to be delete'
		};

		let new_todo_model = new Todo(new_todo_obj);

		new_todo_model.save().then(() => {
			request(app)
				.delete('/todos/' + new_todo_obj._id.toHexString())
				.expect(200)
				.expect((response) => {
					expect(response.body.todo).toInclude(new_todo_obj);
				}).end((error, response) => {
					if(error){
						return done(error)
					}

					Todo.findById(new_todo_obj._id).then((todo) => {
						expect(todo).toNotExist();
						done();
					}).catch((error) => {
						done(error);
					});
				});
		});
	});

	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete('/todos/' + new ObjectID().toHexString())
			.expect(404)
			.end(done)
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.delete('/todos/1234')
			.expect(404)
			.end(done);
	})
});

describe("PATCH /todos/:id", () => {
	it('should update the todo', (done) => {
		let existing_todo_id_2 = existing_todo[1]._id.toHexString();
		let text = "Text to be the update";
		let completed = true;

		request(app)
			.patch(`/todos/${existing_todo_id_2}`)
			.send({
				text,
				completed
			})
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(text);
				expect(response.body.todo.completed).toBe(completed);
				expect(response.body.todo.completed_at).toBeA('number');
			})
			.end((error, response) => {
				if(error){
					return done(error);
				}

				Todo.findById(existing_todo[1]._id).then((todo) => {
					expect(todo.text).toBe(text);
					expect(todo.completed).toBe(completed);
					done();
				}).catch((error) => done(error));
			});
	});

	it('should clear completed_at when todo is not completed', (done) => {
		let existing_todo_id_2 = existing_todo[1]._id.toHexString();
		let completed = false;

		request(app)
			.patch(`/todos/${existing_todo_id_2}`)
			.send({
				completed
			})
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.completed_at).toBe(null);
			})
			.end((error, response) => {
				if(error){
					return done(error);
				}

				Todo.findById(existing_todo[1]._id).then((todo) => {
					expect(todo.completed_at).toBe(null);
					done();
				}).catch((error) => done(error));
			});
	});
});