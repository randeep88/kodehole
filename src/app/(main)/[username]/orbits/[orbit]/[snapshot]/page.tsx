import SnapshotPageClient from "./SnapshotPageClient";

const SnapshotPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ orbitName: string; snapshot: string }>;
  searchParams: Promise<{ o: string }>;
}) => {
  const { snapshot } = await params;
  const orbitName = (await searchParams).o;

  return <SnapshotPageClient orbitName={orbitName} snapshot={snapshot} />;
};

export default SnapshotPage;
