const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

let user_id_one = new ObjectID();
let user_id_two = new ObjectID();

let existing_users = [{
	_id : user_id_one,
	email : "user_one@email.com",
	password : "user_one_password",
	tokens : [{
		access : 'auth',
		token : jwt.sign({ _id : user_id_one.toHexString(), 'access' : 'auth'}, 'abc123').toString()
	}]
},	{
	_id : user_id_two,
	email : "user_two@email.com",
	password : "user_two_password"
}];

let populateUsers = (done) => {
	User.remove({}).then(() => {
		let user_one = new User(existing_users[0]).save();
		let user_two = new User(existing_users[1]).save();

		return Promise.all([user_one, user_two]);
	}).then(() => done());
};


let existing_todo = [{
	_id : new ObjectID(),
	text : "First test todo"
}, {
	_id : new ObjectID(),
	text : "second test todo",
	completed : true,
	completed_at : 123
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(existing_todo);
	}).then(() => done());
};

module.exports = {existing_todo, populateTodos, existing_users, populateUsers};