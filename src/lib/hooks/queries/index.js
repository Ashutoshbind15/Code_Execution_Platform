import { getProblem, getProblems, getSubmissions, getUser } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";

export const useProblems = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });
  return {
    problems: data?.problems,
    isProblemsLoading: isLoading,
    isProblemsError: isError,
    problemsError: error,
  };
};
export const useProblem = (id) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["problems", `${id}`],
    queryFn: () => getProblem(id),
    refetchOnWindowFocus: false,
  });
  return {
    problem: data?.problem,
    isProblemLoading: isLoading,
    isProblemError: isError,
    problemError: error,
  };
};

export const useUser = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  return {
    user: data?.user,
    isUserLoading: isLoading,
    isUserError: isError,
    userError: error,
  };
};

export const useUserSubmissions = (pid) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["submissions", `${pid}`],
    queryFn: () => getSubmissions(pid),
  });
  return {
    submissions: data?.userSubmissions?.submissions,
    isSubmissionsLoading: isLoading,
    isSubmissionsError: isError,
    submissionsError: error,
    refetchSubmissions: refetch,
  };
};
