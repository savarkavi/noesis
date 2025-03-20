"use client";

import { useState } from "react";
import Header from "./Header";
import TrendingPosts from "./TrendingPosts";
import { useSession } from "@/contexts/SessionProvider";

const Container = () => {
  const [selectValue, setSelectValue] = useState("today");
  const { user } = useSession();

  return (
    <div>
      <Header selectValue={selectValue} setSelectValue={setSelectValue} />
      <TrendingPosts userId={user.id} selectValue={selectValue} />
    </div>
  );
};

export default Container;
