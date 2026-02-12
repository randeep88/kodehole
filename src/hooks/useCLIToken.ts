import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCLIToken = () => {
  const { mutate: generateCLIToken, isPending: isGeneratingCLIToken } =
    useMutation({
      mutationFn: async () => {
        const res = await axios.post(`/api/cli-token`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("CLI Access Token generated");
      },
      onError: () => {
        toast.error("Failed to generate CLI Access Token");
      },
    });

  return {
    generateCLIToken,
    isGeneratingCLIToken,
  };
};
