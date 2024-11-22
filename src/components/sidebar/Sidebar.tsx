import { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import { Loader2 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sticky top-12 hidden h-fit w-full max-w-[400px] justify-center px-8 md:w-full lg:flex">
      <Suspense
        fallback={<Loader2 className="mx-auto animate-spin text-blue-500" />}
      >
        <WhoToFollow />
      </Suspense>
    </div>
  );
};

export default Sidebar;
