import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeletePostMutation } from "@/lib/mutations/postMutations";
import { PostData } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  post: PostData;
}

const DeletePostDialog = ({ open, onClose, post }: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            className="flex w-[100px] items-center justify-center"
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: () => toast.success("Post deleted"),
              })
            }
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
