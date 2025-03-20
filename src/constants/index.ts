import {
  BellIcon,
  Bookmark,
  HomeIcon,
  MessageCircle,
  SearchIcon,
  User2,
  TrendingUp,
} from "lucide-react";

export const menuItems = [
  {
    name: "Home",
    path: "/home",
    icon: HomeIcon,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: TrendingUp,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: BellIcon,
  },
  // {
  //   name: "Messages",
  //   path: "/messages",
  //   icon: MessageCircle,
  // },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    icon: Bookmark,
  },
  {
    name: "Profile",
    path: "/users",
    icon: User2,
  },
  // {
  //   name: "Settings",
  //   path: "/settings",
  //   icon: Settings,
  // },
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
    value: "YOUTUBE_VIDEO",
    label: "Youtube Video",
  },
  {
    value: "ARTICLE",
    label: "Article",
  },
  {
    value: "EXTERNAL_LINK",
    label: "External Link",
  },
  {
    value: "MEDIA",
    label: "Media",
  },
];
