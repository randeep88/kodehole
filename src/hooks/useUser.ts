import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormValues } from "../app/(auth)/signup/page";
import { toast } from "sonner";

export const useUser = (username?: string | undefined) => {
  const queryClient = useQueryClient();
  const { data: user, isPending } = useQuery({
    queryKey: ["user", username],
    enabled: !!username,
    queryFn: () => {
      const res = axios.get(`/api/users/${username}`);
      return res;
    },
  });

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: async (user: FormValues) => {
      const res = axios.post(`/api/register`, user);
      return res;
    },
    onSuccess: () => {
      toast.success("User registered successfully");
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { mutate: udpateUsername, isPending: isUpdatingUsername } = useMutation(
    {
      mutationFn: async ({
        username,
        email,
      }: {
        username: string;
        email: string;
      }) => {
        const res = axios.patch(`/api/users/update-username`, {
          username,
          email,
        });
        return res;
      },
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries({ queryKey: ["user", username] });
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    },
  );

  return {
    user,
    isPending,
    register,
    isRegistering,
    udpateUsername,
    isUpdatingUsername,
  };
};
