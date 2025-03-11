import MenuSheet from "./MenuSheet";
import SearchInput from "./SearchInput";

const TopBar = () => {
  return (
    <div className="sticky top-0 z-[10] flex items-center justify-between border-b border-gray-700 bg-[#161e27] p-4">
      <div className="sm:hidden">
        <MenuSheet />
      </div>
      <div className="flex">
        {/* <h2 className="font-serif text-5xl font-bold text-blue-600">N</h2> */}
        <h1 className="font-serif text-3xl text-blue-600">Noesis</h1>
      </div>
      <SearchInput />
      <div></div>
    </div>
  );
};

export default TopBar;
