require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("data", (req) => {
	return JSON.stringify(req.body);
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/info", (request, response) => {
	const date = new Date();

	Person.find({}).then((persons) => {
		const htmlContent = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toISOString()}</p>
    `;
		response.send(htmlContent);
	});
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (!person) {
				return response.status(404).end();
			}

			response.json(person);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;
	const person = {
		name: body.name,
		number: Number(body.number),
	};
	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
	const body = request.body;

	if (!body) {
		return response.status(400).json({ error: "content missing" });
	}

	if (!body.name) {
		return response.status(400).json({ error: "name missing" });
	}

	if (!body.number) {
		return response.status(400).json({ error: "number missing" });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});