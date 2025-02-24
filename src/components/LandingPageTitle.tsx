"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import localFont from "next/font/local";

const vintage = localFont({
  src: "../app/fonts/Vintage.ttf",
});

const LandingPageTitle = () => {
  useGSAP(() => {
    gsap.to("#landing-page-text", {
      textShadow: "0 0 1px blue",
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "none",
    });
  });

  return (
    <h1
      id="landing-page-text"
      className={`${vintage.className} neonBlueText text-center text-7xl tracking-widest text-blue-500 sm:text-9xl lg:text-[13rem]`}
    >
      Noesis
    </h1>
  );
};

export default LandingPageTitle;
