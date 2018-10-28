const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let existing_todo = [{
	text : "First test todo"
}, {
	text: "second tests todo"
}]

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(existing_todo);
	}).then(() => done());
});

describe("Post /todos", () => {
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

describe("Get /todos", () => {
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