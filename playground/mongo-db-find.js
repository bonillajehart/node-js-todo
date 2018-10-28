const {MongoClient, ObjectID} = require('mongodb');

let db_name = "TodoApp";
let url = 'mongodb://localhost:27017';
let todo_collection_name = "todos";
let user_collection_name = "users";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	let todo_collection = client.db(db_name).collection(todo_collection_name);
	let user_collection = client.db(db_name).collection(user_collection_name);

	if(err) {
		return console.log('Unable to connect to mongo database server');
	}

	todo_collection.find({ completed : true }).toArray().then((docs) => {
		console.log("Todos");
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log("Unable to fetch todos", err);
	});

	client.close();
});