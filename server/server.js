let express = require('express');
let body_parser = require('body-parser');

let {mongoose}  = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');	

let app = express();
let app_port = 3000;

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

app.listen(app_port, () => {
	console.log('Started on port 3000');
});
