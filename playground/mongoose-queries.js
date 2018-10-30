const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// let id = "5bd6bf661a3d6b24603f9dfa";

// Todo.find({
// 	_id : id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id : id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo){
// 		return console.log('Id not found');
// 	}

// 	console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));