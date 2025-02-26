"use client";

import { BookmarkFolder } from "@/lib/types";
import { FaRegFolderOpen } from "react-icons/fa6";
import React from "react";
import CreateBookmarkFolderButton from "../bookmark-feature/CreateBookmarkFolderButton";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { kyInstance } from "@/lib/ky";
import Link from "next/link";

const BookmarksFolders = () => {
  const { data: bookmarkFolderData } = useQuery({
    queryKey: ["bookmark-folders"],
    queryFn: () => kyInstance.get("bookmark-folders").json<BookmarkFolder[]>(),
  });

  if (!bookmarkFolderData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col px-6 py-4">
      <div className="self-end">
        <CreateBookmarkFolderButton>
          <Button className="text-white">
            <CirclePlusIcon /> New Folder
          </Button>
        </CreateBookmarkFolderButton>
      </div>
      <div className="mt-8 flex flex-wrap gap-20">
        {bookmarkFolderData.map((folder) => {
          return (
            <Link
              href={`/bookmarks/${folder.name}`}
              key={folder.id}
              className="flex cursor-pointer flex-col gap-2 rounded-lg p-2 hover:bg-muted"
            >
              <FaRegFolderOpen className="size-16 text-blue-600" />
              <p className="font-serif text-sm">{folder.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookmarksFolders;
