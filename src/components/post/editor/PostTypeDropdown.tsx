"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { typeOfPosts } from "@/constants";
import { cn } from "@/lib/utils";
import { PostType } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type PostTypeDropdownProps = {
  value: PostType | null;
  setValue: Dispatch<SetStateAction<PostType | null>>;
};

const PostTypeDropdown = ({ value, setValue }: PostTypeDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between rounded-2xl border border-gray-500 bg-transparent text-blue-600"
        >
          {value
            ? typeOfPosts.find((type) => type.value === value)?.label
            : "select post type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {typeOfPosts.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value
                        ? null
                        : (currentValue as PostType),
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PostTypeDropdown;
