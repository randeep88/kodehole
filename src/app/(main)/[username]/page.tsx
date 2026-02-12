import UserProfile from "@/src/components/UserProfile";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  return (
    <div>
      <UserProfile username={username} />
    </div>
  );
};

export default UserProfilePage;
