"use client";

import { TrendingUpIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  selectValue: string;
  setSelectValue: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ selectValue, setSelectValue }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4 text-3xl">
        <h1>Trending posts</h1>
        <TrendingUpIcon className="size-8" />
      </div>
      <div>
        <Select value={selectValue} onValueChange={setSelectValue}>
          <SelectTrigger className="gap-2 border-none text-white hover:bg-muted">
            <SelectValue placeholder="sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="year">This year</SelectItem>
            <SelectItem value="all-time">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Header;
