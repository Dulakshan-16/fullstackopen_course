const Filter = ({ filter, onFilterChange }) => (
  <p>
    filter shown with a <input value={filter} onChange={onFilterChange}></input>
  </p>
);

export default Filter;
