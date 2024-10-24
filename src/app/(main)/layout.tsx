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

  return <SessionProvider value={session}>{children}</SessionProvider>;
}
