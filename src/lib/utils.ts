import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function validateFiles(fileList: FileList) {
  const files = Array.from(fileList);

  const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 64 * 1024 * 1024;

  const validFiles = files.filter((f) => {
    if (f.type.startsWith("image/")) {
      if (f.size > MAX_IMAGE_SIZE) {
        toast.error(`Image ${f.name} exceeds 4mb limit`);
        return false;
      }
    } else if (f.type.startsWith("video/")) {
      if (f.size > MAX_VIDEO_SIZE) {
        toast.error(`Video ${f.name} exceeds 64mb limit`);
        return false;
      }
    }

    return true;
  });

  return validFiles.map((f) => {
    const extension = f.name.split(".").pop();
    const newName = `attachment_${crypto.randomUUID()}.${extension}`;
    return new File([f], newName, {
      type: f.type,
    });
  });
}
