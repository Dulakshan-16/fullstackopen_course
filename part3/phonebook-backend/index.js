const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => Math.floor(Math.random() * 1000);

app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();

  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const personData = req.body;

  if (!personData.name || !personData.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const existingPerson = persons.find(
    (p) => p.name.toLowerCase() === personData.name.toLowerCase()
  );

  if (existingPerson) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    ...personData,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
