let mongoose = require('mongoose');

let User = mongoose.model('users', {
	email : {
		type : String,
		minlength: 1,
		required: true,
		trim : true
	}
});

module.exports = {User};