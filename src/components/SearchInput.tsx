"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="absolute left-1/2 top-1/2 w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2">
        <Input
          className="rounded-full bg-muted py-5 pl-10 pr-4"
          placeholder="search noesis"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2" />
      </div>
    </form>
  );
};

export default SearchInput;
