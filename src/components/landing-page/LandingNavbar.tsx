import localFont from "next/font/local";

const saintCarell = localFont({
  src: "../../app/fonts/SaintCarell.otf",
  weight: "100 900",
});

const LandingNavbar = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-14 bg-red-700 py-10 font-serif text-xl font-bold uppercase">
      <div className="flex gap-24 text-black">
        <p>About</p>
        <p>Explore</p>
        <p>Login</p>
        <p>Signup</p>
      </div>
      <h1
        className={`text-black ${saintCarell.className} text-9xl font-bold uppercase tracking-widest`}
      >
        Welcome to <span className="">Noesis</span>
      </h1>
    </div>
  );
};

export default LandingNavbar;
