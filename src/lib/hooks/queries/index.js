import { getProblems, getUser } from "@/lib/apis";
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
