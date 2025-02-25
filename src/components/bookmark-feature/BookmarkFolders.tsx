import { BookmarkFolder } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const BookmarkFolders = ({ data }: { data: BookmarkFolder[] }) => {
  return (
    <div className="change-scrollbar mb-2 flex max-h-[150px] flex-col overflow-y-scroll">
      {data?.map((folder) => (
        <div
          key={folder.id}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-muted"
        >
          <Checkbox id={folder.name} />
          <Label htmlFor={folder.name} className="w-full cursor-pointer">
            {folder.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default BookmarkFolders;
