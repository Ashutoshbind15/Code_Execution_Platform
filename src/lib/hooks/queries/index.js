import { getProblems } from "@/lib/apis";

export const useProblems = () => {
  const { data, isLoading, isError, error } = useQuery("problems", getProblems);
  return {
    problems: data,
    isProblemsLoading: isLoading,
    isProblemsError: isError,
    problemsError: error,
  };
};
