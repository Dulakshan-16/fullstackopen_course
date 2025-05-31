import axios from "axios";

const baseURL = "/api/persons";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const create = (newObject) => {
  return axios.post(baseURL, newObject).then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseURL}/${id}`).then((response) => response.data);
};

const update = (updatedObject) => {
  return axios
    .put(`${baseURL}/${updatedObject.id}`, updatedObject)
    .then((response) => response.data);
};

export default { getAll, create, remove, update };
