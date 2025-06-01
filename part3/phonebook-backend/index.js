require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

const errorHandler = (error, req, res, next) => {
  console.log(error.name);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).json(error.message);
  }
  next(error);
};

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();

  Person.countDocuments({})
    .then((count) => {
      const html = `
      <p> 
      Phonebook has info for ${count} people 
      </p> 
      <p> ${date}</p>`;

      res.send(html);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id).then((result) => {
    res.status(204).end();
  });
});

app.post("/api/persons", (req, res, next) => {
  const personData = req.body;

  if (!personData.name || !personData.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({
    name: personData.name,
    number: personData.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  const { name, number } = req.body;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
