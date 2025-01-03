import { menuItems } from "@/constants";
import Link from "next/link";
import NotificationButton from "./NotificationButton";

const MenuBar = async () => {
  return (
    <div className="sticky top-12 hidden h-fit justify-center px-8 sm:flex md:w-full md:max-w-[280px]">
      <div className="mt-24 flex flex-col gap-12">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return item.name === "Notifications" ? (
            <NotificationButton key={item.name} />
          ) : (
            <Link
              href={item.path}
              key={item.name}
              className="flex items-center gap-6 text-white"
            >
              <Icon size={28} className="text-blue-600" />
              <span className="hidden text-xl md:inline">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;
