import Image from "next/image";

const LandingMain = () => {
  return (
    <div className="relative h-[600px] w-full">
      <Image
        src="/landing-main.png"
        alt="landing-page-image"
        fill
        className="object-contain"
      />
    </div>
  );
};

export default LandingMain;
