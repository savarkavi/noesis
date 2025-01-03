import MenuSheet from "./MenuSheet";

const TopBar = () => {
  return (
    <div className="sticky top-0 z-[10] flex items-center border-b border-gray-700 bg-[#161e27] p-4 sm:py-8">
      <div className="sm:hidden">
        <MenuSheet />
      </div>
      <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl font-bold text-blue-600">
        N
      </h2>
    </div>
  );
};

export default TopBar;
