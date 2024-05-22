import { useState, useEffect } from "react";
import personService from "./services/person";

const Notification = ({ message }) => {
	if (message == null) {
		return null;
	}

	const style = {
		color: message.type === "error" ? "red" : "green",
		background: "lightgrey",
		fontSize: 20,
		borderStyle: "solid",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};

	return <div style={style}>{message.content}</div>;
};

const Persons = ({ persons, deletePerson }) => {
	return (
		<>
			{persons.map((person) => (
				<p key={person.id}>
					{person.name} {person.number}{" "}
					<button onClick={deletePerson(person.id)}>delete</button>
				</p>
			))}
		</>
	);
};

const Filter = ({ filter, handleFilterChange }) => {
	return (
		<>
			<p>
				filter shown with{" "}
				<input value={filter} onChange={handleFilterChange}></input>
			</p>
		</>
	);
};

const PersonForm = ({ addPerson, name, number, nameChange, numberChange }) => {
	return (
		<>
			{" "}
			<form onSubmit={addPerson}>
				<div>
					name: <input value={name} onChange={nameChange} />
					<div>
						number: <input value={number} onChange={numberChange} />
					</div>
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
		</>
	);
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");
	const [message, setMessage] = useState(null);

	let filteredPersons = persons.filter((person) =>
		person.name.toLowerCase().includes(filter)
	);

	useEffect(() => {
		personService.getAll().then((response) => {
			setPersons(response.data);
		});
	}, []);

	const addPerson = (e) => {
		e.preventDefault();

		let newPerson = {
			name: newName,
			number: newNumber,
		};

		let searchPerson = persons.find(
			(person) => person.name.toLowerCase() == newName.toLowerCase()
		);

		if (searchPerson != null) {
			if (
				window.confirm(
					`${newName} is already added to phonebook, replace the old number with a new one`
				)
			) {
				personService
					.update(searchPerson.id, newPerson)
					.then((response) => {
						let updatedPersons = persons.map((person) =>
							person.id != response.data.id ? person : response.data
						);

						setPersons(updatedPersons);
					})
					.catch(() => {
						let message = {
							content: `Information of ${searchPerson.name} has already been removed from the server.`,
							type: "error",
						};
						setMessage(message);
						setTimeout(() => setMessage(null), 5000);
					});
			}
			return;
		}

		let message;

		personService
			.create(newPerson)
			.then((response) => {
				message = { content: `Added ${newPerson.name}`, type: "added" };

				setMessage(message);
				setTimeout(() => setMessage(null), 5000);
				setNewName("");
				setNewNumber("");
				return setPersons(persons.concat(response.data));
			})
			.catch((error) => {
				message = { content: error.response.data.error, type: "error" };

				setMessage(message);
				setTimeout(() => setMessage(null), 5000);
				setNewName("");
				setNewNumber("");
				return;
			});
	};

	const deletePerson = (id) => () => {
		name = persons.find((person) => person.id == id).name;
		if (!window.confirm(`Delete ${name}?`)) {
			return;
		}
		personService.remove(id).then((response) => {
			setPersons(persons.filter((person) => person.id != response.data.id));
		});
	};

	const handleChange = (state) => {
		return (e) => state(e.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} />
			<Filter
				filter={filter}
				handleFilterChange={(e) => setFilter(e.target.value)}
			/>
			<h3>add a new</h3>
			<PersonForm
				addPerson={addPerson}
				name={newName}
				number={newNumber}
				nameChange={handleChange(setNewName)}
				numberChange={handleChange(setNewNumber)}
			/>
			<h2>Numbers</h2>
			<Persons persons={filteredPersons} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
