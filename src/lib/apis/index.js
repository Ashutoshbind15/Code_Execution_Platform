import axios from "axios";

export const getProblems = async () => {
  const { data } = await axios.get("/api/problems");
  return data;
};
export const getProblem = async (id) => {
  const { data } = await axios.get(`/api/problems/${id}`);
  return data;
};

export const getUser = async () => {
  const { data } = await axios.get("/api/user");
  return data;
};

export const getSubmissions = async (pid) => {
  const { data } = await axios.get(`/api/submissions?pid=${pid}`);
  return data;
};
