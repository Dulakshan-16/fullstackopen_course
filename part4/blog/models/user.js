const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minLength: 3,
		unique: true,
	},
	name: {
		type: String,

		minLength: 3,
	},
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

userSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = doc._id.toString();

		delete ret._id;
		delete ret.__v;
		delete ret.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
