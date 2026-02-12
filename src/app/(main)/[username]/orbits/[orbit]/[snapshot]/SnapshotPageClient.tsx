"use client";

import { Loader2 } from "lucide-react";
import ProjectUI from "../ProjectUI";
import { useTree } from "@/src/hooks/useTree";

const SnapshotPageClient = ({
  orbitName,
  snapshot,
}: {
  orbitName: string;
  snapshot: string;
}) => {
  const { tree, isLoadingTree } = useTree({ orbitName, snapshot });

  if (isLoadingTree) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return <ProjectUI orbit={orbitName} snapshot={snapshot} tree={tree.tree} />;
};

export default SnapshotPageClient;
