import axios from "axios";

export const getProblems = async () => {
  const { data } = await axios.get("/api/problems");
  return data;
};
