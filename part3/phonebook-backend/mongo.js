const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as arguement");
  return;
}

const password = process.argv[2];

const mongoURL = `mongodb+srv://admin:${password}@cluster0.asn5f.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", true);

mongoose.connect(mongoURL);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const listPhonebook = () => {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  listPhonebook();

  return;
}

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({ name, number, important: false });

person.save().then((result) => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
});
