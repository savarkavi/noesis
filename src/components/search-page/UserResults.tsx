import { UserData } from "@/lib/types";
import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Link from "next/link";
import { Button } from "../ui/button";

interface UserResultsProps {
  data: UserData[];
  query: string;
}

const UserResults = ({ data, query }: UserResultsProps) => {
  return (
    <div className="mt-10 flex flex-col gap-10 px-4">
      {!!data.length && <h2 className="text-3xl font-semibold">Users</h2>}
      {data.map((user) => (
        <div key={user.id} className="flex justify-between">
          <div className="flex gap-10">
            <div className="relative h-[80px] w-[80px] rounded-full">
              <Image
                src={user.avatarUrl || profilePlaceholder}
                alt="profile image"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">
                {user.fullname || user.username}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <h2>{`@${user.username}`}</h2>
                <span>•</span>
                <p>{`${user.followers.length} followers`}</p>
              </div>
            </div>
          </div>
          <Link href={`/users/${user.username}`} className="h-fit rounded-full">
            <Button className="w-20 rounded-full text-white">View</Button>
          </Link>
        </div>
      ))}
      {data.length >= 3 && (
        <Link
          href={`/search/users?q=${query}`}
          className="mx-auto w-fit rounded-full"
        >
          <Button className="w-28 rounded-full text-white">See More</Button>
        </Link>
      )}
    </div>
  );
};

export default UserResults;
