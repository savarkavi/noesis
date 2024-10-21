import localFont from "next/font/local";
import LandingTopContent from "./LandingTopContent";
import LandingBottomContent from "./LandingBottomContent";

const vintage = localFont({
  src: "../../app/fonts/Vintage.ttf",
});

const LandingContainer = () => {
  return (
    <div className="flex h-full flex-col">
      <LandingTopContent />
      <h1
        className={`${vintage.className} neonBlueText -my-16 text-center text-[14rem] tracking-widest text-blue-500`}
      >
        Noesis
      </h1>
      <LandingBottomContent />
    </div>
  );
};

export default LandingContainer;
