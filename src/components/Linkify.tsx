import Link from "next/link";
import { ReactNode } from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";

const Linkify = ({ children }: { children: ReactNode }) => {
  return (
    <LinkifyUsername>
      <LinkifyUrl>{children}</LinkifyUrl>
    </LinkifyUsername>
  );
};

function LinkifyUrl({ children }: { children: ReactNode }) {
  return (
    <LinkItUrl className="hover-underline text-primary">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: { children: ReactNode }) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/users/${match.slice(1)}`}
          className="text-primary"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}

export default Linkify;
