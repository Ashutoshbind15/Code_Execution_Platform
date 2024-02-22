import axios from "axios";

export const getProblems = async () => {
  const { data } = await axios.get("/api/problems");
  return data;
};

export const getUser = async () => {
  const { data } = await axios.get("/api/user");
  return data;
};
