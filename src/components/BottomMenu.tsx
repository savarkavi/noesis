import { bottomMenuItems } from "@/constants";
import Link from "next/link";

const BottomMenu = () => {
  return (
    <div className="fixed bottom-0 z-[10] mx-auto flex h-[55px] w-full max-w-[640px] items-center justify-between border-t border-blue-400 bg-[#161e27] p-3 sm:hidden">
      {bottomMenuItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link href={item.path} key={item.path}>
            <Icon size={28} className="text-blue-600" />
          </Link>
        );
      })}
    </div>
  );
};

export default BottomMenu;
