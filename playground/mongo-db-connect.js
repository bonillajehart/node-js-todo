const {MongoClient, ObjectID} = require('mongodb');

let db_name = "TodoApp";
let url = 'mongodb://localhost:27017';
let todo_collection_name = "todos";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	let todo_collection = client.db(db_name).collection(todo_collection_name);

	if(err) {
		return console.log('Unable to connect to mongo database server');
	}

	console.log('Connected to Mongo db server');

	todo_collection.insertOne({
		text : "Play video games",
		completed: true
	}, (err, result) => {
		if(err){
			return console.log("Unable to insert todo", err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	client.close();
});