import { PostData } from "@/lib/types";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Image from "next/image";
import { formatRelativeDate } from "@/lib/utils";

const Post = ({ post }: { post: PostData }) => {
  return (
    <div className="flex flex-col gap-6 border-b border-gray-700 p-6">
      <div className="flex gap-4">
        <div className="relative h-14 w-14 shrink-0 rounded-full">
          <Image
            src={post.user.avatarUrl || profilePlaceholder}
            alt="profile picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-semibold">{post.user.username}</h2>
          <p className="text-sm text-gray-500">
            {formatRelativeDate(post.createdAt)}
          </p>
        </div>
      </div>
      <div>
        <p>{post.caption}</p>
      </div>
    </div>
  );
};

export default Post;
