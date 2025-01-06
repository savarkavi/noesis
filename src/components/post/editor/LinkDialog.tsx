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
import { LinkInfo } from "./PostCommentry";

interface LinkDialogProps {
  linkInfo: LinkInfo;
  onChangeLinkInfo: (title: string, url: string) => void;
}

const LinkDialog = ({ linkInfo, onChangeLinkInfo }: LinkDialogProps) => {
  return (
    <Dialog>
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
              onChange={(e) =>
                onChangeLinkInfo(e.target.value.trim(), linkInfo.url)
              }
              value={linkInfo.title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="url" className="text-lg">
              URL
            </Label>
            <Input
              id="url"
              onChange={(e) =>
                onChangeLinkInfo(linkInfo.title, e.target.value.trim())
              }
              value={linkInfo.url}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button className="text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
