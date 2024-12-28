"use client";

import { MessageSquare } from "lucide-react";

interface CommentButtonProps {
  totalComments: number;
  onClicked: () => void;
}

const CommentButton = ({ totalComments, onClicked }: CommentButtonProps) => {
  return (
    <div
      className="flex w-fit cursor-pointer items-center gap-2"
      onClick={onClicked}
    >
      <button>
        <MessageSquare className="size-5 text-blue-500" />
      </button>
      <span className="text-sm tabular-nums text-gray-400">
        {`${totalComments} ${totalComments === 1 ? "comment" : "comments"}`}
      </span>
    </div>
  );
};

export default CommentButton;
