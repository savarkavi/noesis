import UpdateProfileForm from "@/components/user-page/UpdateProfileForm";
import { getCurrentSession } from "@/lib/session";

export async function generateMetadata() {
  const { user } = await getCurrentSession();

  if (!user) return;

  return {
    title: `${user.username}`,
  };
}

const EditProfilePage = async () => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  return (
    <div className="p-6">
      <p className="mb-12 mt-8 text-2xl font-semibold">Edit Profile</p>
      <UpdateProfileForm user={user} />
    </div>
  );
};

export default EditProfilePage;
