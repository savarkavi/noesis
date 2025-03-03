"use client";

import { kyInstance } from "@/lib/ky";
import { BookmarkFolder } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const CreateBookmarkFolderButton = ({ children }: { children: ReactNode }) => {
  const [nameInput, setNameInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = ["bookmark-folders"];

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await kyInstance.post("bookmark-folders", {
        json: { name: nameInput },
      });
      return response.json<BookmarkFolder>();
    },

    onSuccess: async (newFolder) => {
      toast.success("Folder created");

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<BookmarkFolder[]>(queryKey, (data) => {
        if (data) {
          return [...data, newFolder];
        }
        return [newFolder];
      });

      setNameInput("");
      setIsOpen(false);
    },

    onError: async (error: Error & { response?: Response }) => {
      setNameInput("");
      setIsOpen(false);
      const errorData = await error.response?.json();
      toast.error(errorData?.error || "Failed to create folder");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a folder</DialogTitle>
          <DialogDescription>
            Organize your bookmarks in custom made folders
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="name of your folder"
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
          />
        </div>
        <Button
          className="w-20 text-white"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookmarkFolderButton;
