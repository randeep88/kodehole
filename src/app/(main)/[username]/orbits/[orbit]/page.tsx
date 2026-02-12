import OrbitPageClient from "./OrbitPageClient";

export default async function OrbitPage({
  params,
}: {
  params: Promise<{ orbit: string }>;
}) {
  const { orbit } = await params;

  return <OrbitPageClient orbit={orbit} />;
}
