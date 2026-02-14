"use client";

import DefaultOrbitPage from "@/src/components/DefaultOrbitPage";
import OrbitPageComp from "@/src/components/OrbitPageComp";
import { useOrbits } from "@/src/hooks/useOrbits";
import { Loader2 } from "lucide-react";

const OrbitPageClient = ({ orbit: orbitName }: any) => {
  const { orbit, isPending } = useOrbits(orbitName!);

  const isSnapshotExistInOrbit = orbit?.data?.orbitData?.snapshots?.length > 0;

  if (isPending || !isSnapshotExistInOrbit) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!isSnapshotExistInOrbit) {
    return <DefaultOrbitPage orbit={orbitName} />;
  }

  return <OrbitPageComp orbit={orbit?.data?.orbitData} />;
};

export default OrbitPageClient;
