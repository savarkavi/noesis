import BorderContainer from "@/components/BorderContainer";
import { getCurrentSession } from "@/lib/session";
import localFont from "next/font/local";
import { redirect } from "next/navigation";

const vintage = localFont({
  src: "../app/fonts/Vintage.ttf",
});

export default async function Home() {
  const { user } = await getCurrentSession();

  if (user) redirect("/home");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-2 py-8">
      <BorderContainer>
        <h1
          className={`${vintage.className} neonBlueText text-center text-7xl tracking-widest text-blue-500 sm:text-9xl lg:text-[13rem]`}
        >
          Noesis
        </h1>
        <div></div>
      </BorderContainer>
    </div>
  );
}
