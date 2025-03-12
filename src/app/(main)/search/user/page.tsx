import UsersList from "@/components/search-page/UsersList";
import { getCurrentSession } from "@/lib/session";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: `Search results for ${q}`,
  };
}
const SearchUsersPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  const { user } = await getCurrentSession();

  if (!user) return;
  return (
    <div className="p-6">
      <UsersList searchQuery={q} />
    </div>
  );
};

export default SearchUsersPage;
