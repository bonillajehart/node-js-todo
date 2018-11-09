const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function (){
	let user = this;

	return _.pick(user.toObject(), ['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id : user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {
		return token;
	}).catch((error) => {
		return Promise.reject(error);
	});
};

UserSchema.statics.findByToken = function(token) {
	let User = this;
	let decoded = null;

	try{
		decoded = jwt.verify(token, 'abc123');
	} catch (error){
		return Promise.reject(error);
	}

	return User.findOne({
		'_id' : decoded._id,
		'tokens.token' : token,
		'tokens.access' : 'auth'
	});
};

UserSchema.pre('save', function(next){
	let user = this;

	if(user.isModified('password')){
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, function(error, hash){
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

let User = mongoose.model('users', UserSchema);

module.exports = {User};