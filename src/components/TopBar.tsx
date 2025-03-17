import Image from "next/image";
import MenuSheet from "./MenuSheet";
import SearchInput from "./SearchInput";
import UserProfileButton from "./UserProfileButton";
import logo from "../assets/logo.png";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="sticky top-0 z-[10] flex items-center justify-between gap-4 border-b border-gray-700 bg-[#161e27] px-2 py-4 sm:px-8">
      <div className="sm:hidden">
        <MenuSheet />
      </div>
      <Link href="/home" className="hidden sm:block">
        <div className="flex shrink-0 items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <Image src={logo} alt="logo" fill className="object-cover" />
          </div>
          <h1 className="hidden font-serif text-4xl text-blue-600 md:block">
            Noesis
          </h1>
        </div>
      </Link>
      <SearchInput />
      <UserProfileButton />
    </div>
  );
};

export default TopBar;
