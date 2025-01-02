import { CommentData } from "@/lib/types";
import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import { formatRelativeDate } from "@/lib/utils";
import CommentOptionsButton from "./CommentOptionsButton";
import { useSession } from "@/contexts/SessionProvider";

const Comment = ({ comment }: { comment: CommentData }) => {
  const { user } = useSession();

  return (
    <div className="flex gap-4 py-6">
      <div className="relative h-10 w-10 shrink-0 rounded-full">
        <Image
          src={comment.user.avatarUrl || profilePlaceholder}
          alt="profile image"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex w-full flex-col gap-2 text-sm">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{comment.user.fullname}</span>
            <span className="text-muted-foreground">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          {user.id === comment.userId && (
            <CommentOptionsButton comment={comment} />
          )}
        </div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
