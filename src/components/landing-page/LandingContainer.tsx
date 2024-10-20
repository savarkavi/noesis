import LandingMain from "./LandingMain";
import LandingNavbar from "./LandingNavbar";

const LandingContainer = () => {
  return (
    <div className="flex h-screen w-full flex-col justify-between">
      <LandingNavbar />
      <LandingMain />
    </div>
  );
};

export default LandingContainer;
