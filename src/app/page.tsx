import BorderContainer from "@/components/BorderContainer";
import LandingPageTitle from "@/components/LandingPageTitle";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();

  if (user) redirect("/home");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-2 py-8">
      <BorderContainer>
        <LandingPageTitle />
        <div />
      </BorderContainer>
    </div>
  );
}
