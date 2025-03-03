"use client";

import React, { FormEvent, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  deleteFolder,
  renameBookmarkFolder,
} from "@/app/(main)/actions/bookmarkActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface BookmarksFolderPostsProps {
  folderName: string;
}

const BookmarkFolderMenu = ({ folderName }: BookmarksFolderPostsProps) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [alerDialogOpen, setAlerDialogOpen] = useState(false);

  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [nameInput, setNameInput] = useState("");

  const router = useRouter();

  const handleRename = async (e: FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim()) toast.error("Invalid input");

    try {
      setRenameLoading(true);
      await renameBookmarkFolder({
        folderName,
        newName: nameInput,
      });

      toast.success("Folder renamed");

      router.push(`/bookmarks/${nameInput}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename the folder");
    } finally {
      setRenameDialogOpen(false);
      setNameInput("");
      setRenameLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteFolder(folderName);

      toast.success("Folder deleted");

      router.push("/bookmarks");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the folder");
    } finally {
      setDeleteLoading(false);
      setAlerDialogOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <form onSubmit={handleRename}>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter new folder name"
                className="w-full"
              />
            </form>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex w-20 items-center justify-center text-white"
              onClick={handleRename}
              disabled={!nameInput.trim() || renameLoading}
            >
              {renameLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alerDialogOpen} onOpenChange={setAlerDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              className="flex w-20 items-center justify-center bg-red-600 text-white hover:bg-red-500"
              onClick={() => {
                handleDelete();
              }}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsHorizontalIcon className="size-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setAlerDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BookmarkFolderMenu;
