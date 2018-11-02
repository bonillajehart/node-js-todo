const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {
	console.log(result);
});

Todo.findOneAndRemove({
	'text' : 'test todo'
}).then((result) => {
	console.log(result);
});

Todo.findByIdAndRemove('5bd58a27f26b8c28f02c1a54').then((todo) => {
	console.log(todo);
});