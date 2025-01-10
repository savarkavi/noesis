"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import { LinkInfo } from "./PostInput";
import { useState } from "react";
import { isValidUrl } from "@/lib/utils";

interface LinkDialogProps {
  linkInfo: LinkInfo;
  onChangeLinkInfo: (title: string, url: string) => void;
}

const LinkDialog = ({ linkInfo, onChangeLinkInfo }: LinkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-2 rounded-full border border-muted-foreground bg-muted px-4 py-2 text-sm">
          <LinkIcon className="size-4" />
          Enter Link
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provide Link Information</DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-lg">
              Title
            </Label>
            <Input
              id="title"
              onChange={(e) => onChangeLinkInfo(e.target.value, linkInfo.url)}
              value={linkInfo.title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="url" className="text-lg">
              URL
            </Label>
            <Input
              id="url"
              onChange={(e) => {
                const newUrl = e.target.value;
                setIsUrlValid(isValidUrl(newUrl));
                onChangeLinkInfo(linkInfo.title, newUrl);
              }}
              value={linkInfo.url}
              className={!isUrlValid ? "border-red-500" : ""}
            />
            {!isUrlValid && (
              <span className="text-sm text-red-500">
                Please enter a valid URL
              </span>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            className="text-white"
            onClick={() => setOpen(false)}
            disabled={!isUrlValid}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
