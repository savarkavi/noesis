import BottomMenu from "@/components/BottomMenu";
import MenuBar from "@/components/MenuBar";
import TopBar from "@/components/TopBar";
import SessionProvider from "@/contexts/SessionProvider";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  if (!session.user) return redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="min-h-screen w-full bg-[#161e27]">
        <div className="mx-auto flex h-full w-full max-w-[1240px] justify-between">
          <MenuBar />
          <div className="flex w-full max-w-[640px] flex-col border-gray-700 sm:border-x">
            <TopBar />
            {children}
            <BottomMenu />
          </div>
          <div className="hidden w-full max-w-[300px] lg:block"></div>
        </div>
      </div>
    </SessionProvider>
  );
}