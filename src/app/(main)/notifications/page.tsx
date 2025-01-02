import Notifications from "@/components/notifications/Notifications";
import { getCurrentSession } from "@/lib/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div className="min-h-screen">
      <Notifications />
    </div>
  );
}
