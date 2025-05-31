const PersonForm = ({
  newName,
  newNumber,
  onAddNewPerson,
  setNewName,
  setNewNumber,
}) => {
  return (
    <form onSubmit={onAddNewPerson}>
      <div>
        <p>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </p>
        <p>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          ></input>
        </p>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
