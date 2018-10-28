const {MongoClient, ObjectID} = require('mongodb');

let db_name = "TodoApp";
let url = 'mongodb://localhost:27017';
let todo_collection_name = "todos";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	let todo_collection = client.db(db_name).collection(todo_collection_name);

	if(err) {
		return console.log('Unable to connect to mongo database server');
	}

	todo_collection.findOneAndDelete({ completed : false}).then((result) => {
		console.log(result);
	}).catch((err) => {
		console.log("Unable to delete", err);
	});

	client.close();
});