let express = require('express');
let body_parser = require('body-parser');

let {ObjectID} = require('mongodb');
let {mongoose}  = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');	

let app = express();
let app_port = process.env.PORT || 3000;

app.use(body_parser.json());

app.post("/todos", (request, response) => {
	let todo = new Todo({
		text : request.body.text
	});

	todo.save().then((document) => {
		response.send(document)
	}).catch((err) => {
		response.status(400).send(err);
	});
});

app.get("/todos", (request, response) => {
	Todo.find().then((todos) => {
		response.send({todos});
	}).catch((error) => response.status(400).send(error));
});

app.get("/todos/:id", (request, response) => {
	let id = request.params.id;

	if(!ObjectID.isValid(id)){
		response.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if(!todo){
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((error) => response.status(400).send({}));
});

app.listen(app_port, () => {
	console.log(`Started on port ${app_port}`);
});

module.exports = {app};