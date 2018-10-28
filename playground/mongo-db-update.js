const {MongoClient, ObjectID} = require('mongodb');

let db_name = "TodoApp";
let url = 'mongodb://localhost:27017';
let user_collection_name = "users";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	let user_collection = client.db(db_name).collection(user_collection_name);

	if(err) {
		return console.log('Unable to connect to mongo database server');
	}

	user_collection.findOneAndUpdate({
	 _id : new ObjectID("5bd4755eeb3d5d26a866c1e1")
	}, {
		$set : {
			name : "Bobby Hard"
		},
		$inc : {
			age : 1
		}
	}, {
		returnOriginal : false
	}).then((result) => {
		console.log(result);
	}).catch((err) => {
		console.log("Unable to delete", err);
	});

	client.close();
});