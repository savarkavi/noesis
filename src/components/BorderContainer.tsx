import Link from "next/link";
import { ReactNode } from "react";

const BorderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[1000px] flex-col items-center justify-between border border-blue-600 pt-12">
      <p className="absolute -top-4 left-4 rounded-md bg-blue-600 px-3 py-1 font-serif text-sm font-semibold text-black xl:text-base">
        ABOUT
      </p>
      <div className="flex h-10 w-full max-w-[400px] items-center justify-between overflow-hidden bg-red-600 py-1">
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
      {children}
      <div className="absolute -top-4 right-4 flex items-center gap-4">
        <Link
          href="/login"
          className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 font-serif text-sm font-semibold text-black xl:text-base"
        >
          LOGIN
        </Link>
        <Link
          href="/signup"
          className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 font-serif text-sm font-semibold text-black xl:text-base"
        >
          SIGNUP
        </Link>
      </div>
    </div>
  );
};

export default BorderContainer;
