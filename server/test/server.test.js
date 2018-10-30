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
	text: "second test todo"
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