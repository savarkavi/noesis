import { useInfiniteQuery } from "@tanstack/react-query";
import CommentInput from "./CommentInput";
import { kyInstance } from "@/lib/ky";
import { CommentPage } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";

interface CommentsProps {
  postId: string;
  onClicked: () => void;
}

const Comments = ({ postId, onClicked }: CommentsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `posts/${postId}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<CommentPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (isPending) {
    return <Loader2 className="mx-auto mt-8 animate-spin text-blue-500" />;
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">
        Something went wrong. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <CommentInput postId={postId} />
      {comments.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">
          No comments yet.
        </p>
      )}
      <div className="mt-4 divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      {hasNextPage ? (
        isFetchingNextPage ? (
          <Loader2 className="mx-auto mt-8 animate-spin text-blue-500" />
        ) : (
          <button
            onClick={() => fetchNextPage()}
            className="mx-auto mt-4 block text-sm text-blue-500"
          >
            Load more comments
          </button>
        )
      ) : (
        <button
          onClick={() => onClicked()}
          className="mx-auto mt-4 block text-sm text-blue-500"
        >
          Collapse comments
        </button>
      )}
    </div>
  );
};

export default Comments;
