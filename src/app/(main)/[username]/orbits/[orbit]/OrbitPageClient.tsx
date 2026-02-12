"use client";

import DefaultOrbitPage from "@/src/components/DefaultOrbitPage";
import OrbitPageComp from "@/src/components/OrbitPageComp";
import { useOrbits } from "@/src/hooks/useOrbits";

const OrbitPageClient = ({ orbit: orbitName }: any) => {
  const { orbit } = useOrbits(orbitName!);

  const isSnapshotExistInOrbit = orbit?.data?.orbitData?.snapshots?.length > 0;

  if (!isSnapshotExistInOrbit) {
    return <DefaultOrbitPage orbit={orbitName} />;
  }

  return <OrbitPageComp orbit={orbit?.data?.orbitData} />;
};

export default OrbitPageClient;
