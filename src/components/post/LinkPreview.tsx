import { LinkMetadata } from "@prisma/client";
import Image from "next/image";

const LinkPreview = ({ metadata }: { metadata: LinkMetadata }) => {
  const proxyImageUrl = `/api/link-image-proxy?url=${encodeURIComponent(metadata.image)}`;
  const urlWithoutProtocol = new URL(metadata.url).hostname;

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-100">
      <div className="relative h-[300px] w-full rounded-t-lg">
        <Image
          src={proxyImageUrl}
          alt="link image"
          fill
          className="rounded-t-lg object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 text-base text-black">
        <p className="font-serif text-xl font-bold">{metadata.title}</p>
        <p className="text-muted">{metadata.description}</p>
        <p className="font-semibold text-muted">{urlWithoutProtocol}</p>
      </div>
    </div>
  );
};

export default LinkPreview;
