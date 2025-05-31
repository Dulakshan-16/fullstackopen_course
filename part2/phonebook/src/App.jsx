import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null });

  // Get persons from json server
  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter)
  );

  const clearForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification({ message: null });
    }, 5000);
  };

  // Update person
  const updatePerson = (person) => {
    const ok = window.confirm(
      `${person.name} is already added to phonebook, replace the old number with a new one?`
    );

    if (ok) {
      personService
        .update({ ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id === person.id ? updatedPerson : p))
          );
          notifyWith(`${updatedPerson.name}'s number changed`);
        })
        .catch(() => {
          notifyWith(
            `Information on ${person.name} has already been removed from the server`,
            true
          );
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  // Add new person event handler
  const onAddNewPerson = (e) => {
    e.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName
    );

    // Check if name already exsists in list
    if (existingPerson) {
      updatePerson(existingPerson);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // Add new person data to database
    personService.create(newPerson).then((createdPerson) => {
      setPersons(persons.concat(createdPerson));
      notifyWith(`Added ${createdPerson.name}`);
      clearForm();
    });
  };

  // Remove person event handler
  const onRemovePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name}?`);

    if (ok) {
      personService.remove(person.id).then((deletedPerson) => {
        setPersons(persons.filter((person) => person.id !== deletedPerson.id));
        notifyWith(`Deleted ${person.name}`);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}></Notification>
      <Filter
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
      ></Filter>
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onAddNewPerson={onAddNewPerson}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        onRemovePerson={onRemovePerson}
      ></Persons>
    </div>
  );
};

export default App;
