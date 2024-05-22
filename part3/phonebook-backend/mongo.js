const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Usage:");
	console.log(
		"To add a person: node mongo.js [password] [person_name] [person_number]"
	);
	console.log("To display all entires: node mongo.js [password]");
	process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://dulakshanperera:${password}@cluster0.0t4hpqe.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
	Person.find({}).then((persons) => {
		console.log("phonebook:");
		persons.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
		process.exit();
	});
} else if (process.argv.length === 5) {
	const name = process.argv[3];
	const number = Number(process.argv[4]);

	const person = new Person({
		name: name,
		number: number,
	});

	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
}
