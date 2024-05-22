const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("conencting to", url);

mongoose
	.connect(url)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		validate: {
			validator: (v) => /\d{2,3}-\d{6,}/.test(v),
			message: (props) => `${props.value} is not a valid phone number.`,
		},
	},
});

personSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret._id.toString();

		delete ret._id;
		delete ret.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
