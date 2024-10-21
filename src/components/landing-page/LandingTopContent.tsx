const LandingTopContent = () => {
  return (
    <div className="relative mx-4 flex h-full flex-col items-center border-x border-t border-blue-500 p-8">
      <p className="absolute -top-4 left-4 rounded-md bg-blue-600 px-3 py-1 font-serif font-semibold text-black">
        ABOUT
      </p>
      <div className="flex h-10 w-[400px] items-center justify-between overflow-hidden bg-red-600 py-1">
        <div className="flex h-[400px] -rotate-45 gap-2">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="h-full w-[6px] bg-black"></div>
          ))}
        </div>
        <p className="font-serif text-2xl font-bold uppercase tracking-widest">
          Welcome
        </p>
        <div className="flex h-[400px] rotate-45 gap-2">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="h-full w-[6px] bg-black"></div>
          ))}
        </div>
      </div>
      <div className="absolute -top-4 right-4 flex items-center gap-4">
        <p className="rounded-md bg-blue-600 px-3 py-1 font-serif font-semibold text-black">
          LOGIN
        </p>
        <p className="rounded-md bg-blue-600 px-3 py-1 font-serif font-semibold text-black">
          SIGNUP
        </p>
      </div>
    </div>
  );
};

export default LandingTopContent;
