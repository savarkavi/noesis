import { Button } from "../ui/button";
import { useDeletePostMutation } from "@/lib/mutations/postMutations";
import { PostData } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  post: PostData;
}

const DeletePostDialog = ({ open, onClose, post }: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this post?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-row items-center justify-end gap-4">
          <AlertDialogCancel
            className="my-0 w-fit"
            disabled={mutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            className="flex w-20 items-center justify-center"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;
