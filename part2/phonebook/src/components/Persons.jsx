const Person = ({ person, onRemovePerson }) => (
  <>
    <p>
      {person.name} {person.number}{" "}
      <button onClick={() => onRemovePerson(person)}>delete</button>
    </p>
  </>
);

const Persons = ({ persons, onRemovePerson }) =>
  persons.length === 0
    ? "..."
    : persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onRemovePerson={onRemovePerson}
        ></Person>
      ));

export default Persons;
