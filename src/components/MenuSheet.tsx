"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import NotificationButton from "./NotificationButton";
import Link from "next/link";
import { menuItems } from "@/constants";
import { useState } from "react";

const MenuSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent side="left" className="z-[999]">
        <SheetHeader>
          <SheetTitle className="hidden">Menu Items</SheetTitle>
        </SheetHeader>
        <div className="mt-24 flex flex-col gap-12">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return item.name === "Notifications" ? (
              <div onClick={() => setIsOpen(false)} key={item.name}>
                <NotificationButton isMenuSheet />
              </div>
            ) : (
              <SheetClose asChild key={item.name}>
                <Link
                  href={item.path}
                  className="flex items-center gap-6 text-white"
                >
                  <Icon size={28} className="text-blue-600" />
                  <span className="text-xl">{item.name}</span>
                </Link>
              </SheetClose>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
