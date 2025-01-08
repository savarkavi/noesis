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
import { useDeleteCommentMutation } from "@/lib/mutations/commentMutations";
import { Button } from "../ui/button";
import { CommentData } from "@/lib/types";

interface DeleteCommentDialogProps {
  open: boolean;
  onClose: () => void;
  comment: CommentData;
}

const DeleteCommentDialog = ({
  open,
  onClose,
  comment,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation(comment.postId);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this comment?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-row items-center justify-end gap-4">
          <AlertDialogCancel className="my-0 w-fit">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            className="flex w-20 items-center justify-center"
            onClick={() =>
              mutation.mutate(comment.id, {
                onSuccess: () => toast.success("Comment deleted"),
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

export default DeleteCommentDialog;
