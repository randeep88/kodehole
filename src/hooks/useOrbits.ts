import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { orbit } from "../app/(main)/[username]/create-orbit/page";
import { toast } from "sonner";

export const useOrbits = (orbitName?: string) => {
  const queryClient = useQueryClient();

  const { data: orbits, isPending } = useQuery({
    queryKey: ["orbits"],
    queryFn: async () => {
      const res = await axios.get(`/api/orbits/get-orbits`);
      return res;
    },
  });

  const { data: snapshots, isPending: isLoadingSnapshots } = useQuery({
    queryKey: ["snapshots", orbitName],
    enabled: !!orbitName,
    queryFn: async () => {
      const res = await axios.get(
        `/api/snapshots/get-snapshots?orbitName=${orbitName}`,
      );
      return res.data;
    },
  });

  const { data: orbit, isPending: isLoadingOrbit } = useQuery({
    queryKey: ["orbit", orbitName],
    enabled: !!orbitName,
    queryFn: async () => {
      const res = await axios.get(
        `/api/orbits/get-orbit?orbitName=${orbitName}`,
      );
      return res;
    },
  });

  const { data: orbitExistense, isPending: isCheckingOrbitExistense } =
    useQuery({
      enabled: !!orbitName,
      queryKey: ["check-orbit-existense", orbitName],
      queryFn: () => {
        const res = axios.get(
          `/api/orbits/check-orbit-existense?name=${orbitName}`,
        );
        return res;
      },
    });

  const { mutate: createOrbit, isPending: isCreatingOrbit } = useMutation({
    mutationFn: (data: orbit) => {
      const res = axios.post(`/api/orbits/create-orbit`, data);
      return res;
    },
    onSuccess: () => {
      toast.success("New Orbit created");
      queryClient.invalidateQueries({ queryKey: ["orbits"] });
    },
    onError: () => {
      toast.error("Failed to create orbit");
    },
  });

  return {
    orbits,
    isPending,
    createOrbit,
    isCreatingOrbit,
    orbitExistense,
    isCheckingOrbitExistense,
    orbit,
    isLoadingOrbit,
    snapshots,
    isLoadingSnapshots,
  };
};
