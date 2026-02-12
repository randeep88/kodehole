import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useTree = ({
  orbitName,
  snapshot,
}: {
  orbitName: string;
  snapshot?: string;
}) => {
  const { data: tree, isPending: isLoadingTree } = useQuery({
    queryKey: ["tree", orbitName],
    enabled: !!orbitName && !!snapshot,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orbits/${orbitName}/tree${
          snapshot ? `?snapshot=${snapshot}` : ""
        }`,
      );

      return res.data;
    },
  });

  return {
    tree,
    isLoadingTree,
  };
};
