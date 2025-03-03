"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { toast } from "sonner";

interface renameBookmarkFolderParams {
  folderName: string;
  newName: string;
}

export const renameBookmarkFolder = async ({
  folderName,
  newName,
}: renameBookmarkFolderParams) => {
  try {
    const { user } = await getCurrentSession();

    if (!user) throw new Error("Unauthorized");

    const folder = await prisma.bookmarkfolder.findFirst({
      where: {
        userId: user.id,
        name: folderName,
      },
    });

    if (!folder) throw new Error("Folder not found");

    const updatedFolder = await prisma.bookmarkfolder.update({
      where: {
        id: folder.id,
      },
      data: {
        name: newName,
      },
    });

    return updatedFolder;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFolder = async (folderName: string) => {
  try {
    const { user } = await getCurrentSession();

    if (!user) throw new Error("Unauthorized");

    const folder = await prisma.bookmarkfolder.findFirst({
      where: {
        userId: user.id,
        name: folderName,
      },
    });

    if (!folder) throw new Error("Folder not found");

    await prisma.bookmarkfolder.delete({
      where: {
        id: folder.id,
      },
    });
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete the folder. Try again later.");
  }
};
