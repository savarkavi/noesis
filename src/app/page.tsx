import BorderContainer from "@/components/BorderContainer";
import localFont from "next/font/local";

const vintage = localFont({
  src: "../app/fonts/Vintage.ttf",
});

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-2 py-8">
      <BorderContainer>
        <h1
          className={`${vintage.className} neonBlueText t racking-widest text-center text-7xl text-blue-500 sm:text-9xl lg:text-[13rem]`}
        >
          Noesis
        </h1>
        <div></div>
      </BorderContainer>
    </div>
  );
}
