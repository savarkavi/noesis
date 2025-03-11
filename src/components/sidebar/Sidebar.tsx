import { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import { Loader2 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sticky top-20 hidden h-fit w-full max-w-[420px] justify-center px-8 xl:flex xl:w-full">
      <Suspense
        fallback={<Loader2 className="mx-auto animate-spin text-blue-500" />}
      >
        <WhoToFollow />
      </Suspense>
    </div>
  );
};

export default Sidebar;
