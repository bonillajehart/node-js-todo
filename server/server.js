const _ = require('lodash');
const express = require('express'); 
const body_parser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose}  = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');	

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
	}).catch((error) => response.status(400).send());
});

app.delete("/todos/:id", (request, response) => {
	let id = request.params.id;

	if(!ObjectID.isValid(id)){
		response.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo){
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((error) => response.status(400).send());
});

app.patch('/todos/:id', (request, response) => {
	let id = request.params.id;
	let body = _.pick(request.body, ['completed', 'text']);

	if(_.isBoolean(body.completed) && body.completed){
		body.completed_at = new Date().getTime();
	} else {
		body.completed = false;
		body.completed_at = null
	}

	Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo) => {
		if(!todo){
			return response.status(404).send();
		}

		return response.send({todo});
	}).catch((error) => response.status(400).send());
});

app.listen(app_port, () => {
	console.log(`Started on port ${app_port}`);
});

module.exports = {app};