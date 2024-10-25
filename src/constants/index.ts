import {
  BellIcon,
  Bookmark,
  HomeIcon,
  MessageCircle,
  SearchIcon,
  Settings,
  User2,
} from "lucide-react";

export const menuItems = [
  {
    name: "Home",
    path: "/home",
    icon: HomeIcon,
  },
  {
    name: "Explore",
    path: "/search",
    icon: SearchIcon,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: BellIcon,
  },
  {
    name: "Messages",
    path: "/messages",
    icon: MessageCircle,
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    icon: Bookmark,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User2,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const bottomMenuItems = [
  {
    path: "/home",
    icon: HomeIcon,
  },
  {
    path: "/search",
    icon: SearchIcon,
  },
  {
    path: "/notifications",
    icon: BellIcon,
  },
  {
    path: "/messages",
    icon: MessageCircle,
  },
];

export const typeOfPosts = [
  {
    value: "media",
    label: "Media",
  },
  {
    value: "commentry",
    label: "Commentry",
  },
  {
    value: "external-link",
    label: "External Link",
  },
];
