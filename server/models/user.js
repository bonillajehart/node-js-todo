const mongoose = require('mongoose');
const validator = require('validator');

// let base_attributes

let User = mongoose.model('users', {
	email : {
		type : String,
		minlength: 1,
		required: true,
		trim : true,
		unique: true,
		validate : {
			validator : validator.isEmail,
			message : '{VALUE} is not a valid email'
		}
	},
	password: {
		type : String,
		minlength : 6,
		required : true,
	},
	tokens : [{
		access : {
			type : String,
			required : true
		},
		token : {
			type : String,
			required : true
		}
	}]
});

module.exports = {User};