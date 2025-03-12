import SearchResults from "@/components/search-page/SearchResults";
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

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div>
      <SearchResults searchQuery={q} user={user} />
    </div>
  );
};

export default SearchPage;
