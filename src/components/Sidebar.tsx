import React, { useRef, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";

import { NavItemsManagement } from "./NavItemsManagement";
import { NavItemsStockReports } from "./NavItemsStockReports";
import { NavItemsSubjectLists } from "./NavItemsSubjectLists";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { useRouter } from "next/router";

// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// add NavItem prop to component prop
type Props = {
  open: boolean;
  navItems?: NavItem[];
  setOpen(open: boolean): void;
  toggleMinimized(): void;
};


const Sidebar = ({ open, navItems = [...NavItemsManagement, ...NavItemsSubjectLists, ...NavItemsStockReports], setOpen }: Props) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);

  const isLoginPage = router.pathname === "/LoginPage";
  const isSignupPage = router.pathname === "/SignupPage";
  const isTerminalPage = router.pathname === "/TerminalPage";

  useOnClickOutside(ref, (e) => {
    setOpen(false);

  });
  
  if (isLoginPage || isSignupPage ||isTerminalPage) {
    return null;
  }
  


const toggleMinimized = () => {
  setMinimized((prevState) => !prevState);
};

return (
  <>
    <div 
      className={classNames(
        "fixed inset-0 bg-black transition-opacity duration-200 z-30",
        {
          "opacity-70": open,
          "opacity-0 pointer-events-none": !open,
        }
      )}
    ></div>

    <div
      className={classNames({
        "flex flex-col justify-between shadow-2xl z-40": true,
        "bg-bright-white text-friendly-black": true,

        //"top-0 2xl:top-0 fixed": true,
        " md:sticky top-0 2xl:top-0  fixed": true,

        "md:h-[calc(100vh_-_64px)] h-full lg:w-[256px]": true,
        "transition-transform .2s ease-in-out md:-translate-x-0": true,
        "-translate-x-full ": !open,

      })}
      ref={ref}
    >
      {/* Add "X" icon */}
      {open && (
        <div className="absolute top-2 right-[-48px] z-50">
          <XMarkIcon
            className="h-10 w-10 text-bright-white cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <nav className="md:sticky top-0 md:top-16 ">
        {/* nav items */}
        <ul className="py-2 flex flex-col gap-2 font-semibold">
          
          <div className="font-bold px-4 py-1 text-lg bg-cougar-dark-red text-cougar-yellow rounded-r-full float-left" style={{ marginRight: "10px" }}>
            PERFORMANCE
          </div>
          {NavItemsStockReports.map((item, index) => {
            return (
          <Link key={index} href={item.href}>
          <li
            className={classNames({
              "text-friendly-black hover:bg-hover-white hover:bg-opacity-30 hover:shadow-xl": true,
              "flex gap-4 items-center ": true,
              "transition-colors duration-100": true,
              "rounded-md p-2 mx-2 ": true,
            })}
          >
            {item.icon} {!minimized && item.label}
          </li>
        </Link>
            );
          })}

          <div className="font-bold px-4 py-1 text-lg bg-cougar-dark-red text-cougar-yellow rounded-r-full float-left" style={{ marginRight: "10px" }}>
            SUPPLY CHAIN
          </div>
          {NavItemsSubjectLists.map((item, index) => {
            return (
          <Link key={index} href={item.href}>
          <li
            className={classNames({
              "text-friendly-black hover:bg-hover-white hover:bg-opacity-30 hover:shadow-xl": true,
              "flex gap-4 items-center ": true,
              "transition-colors duration-100": true,
              "rounded-md p-2 mx-2 ": true,
            })}
          >
            {item.icon} {!minimized && item.label}
          </li>
        </Link>
            );
          })}

          <div className="font-bold px-4 py-1 text-lg bg-cougar-dark-red text-cougar-yellow rounded-r-full float-left" style={{ marginRight: "10px" }}>
            MANAGEMENT
          </div>
          {NavItemsManagement.map((item, index) => {
            return (
          <Link key={index} href={item.href}>
          <li
            className={classNames({
              "text-friendly-black hover:bg-hover-white hover:bg-opacity-30 hover:shadow-xl": true,
              "flex gap-4 items-center ": true,
              "transition-colors duration-100": true,
              "rounded-md p-2 mx-2 ": true,
            })}
          >
            {item.icon} {!minimized && item.label}
          </li>
        </Link>
            );
          })}


        </ul>
        

      </nav>
      {/* Project details  */}
      <div className="p-2">
        <div className="border-t-2 border-hover-white mx-2"></div>
        <div className="flex gap-4 items-center mt-4">
          <div className="flex flex-col ">
            <Link href="/ProjectInformation" className="text-friendly-black text-sm font-semibold mx-2 px-3 hover:underline hover:text-blue-500">
              Project Information
            </Link>

            <Link href="/GroupMemberList" className="text-friendly-black text-sm font-semibold mx-2 px-3 hover:underline hover:text-blue-500">
              Group Member List
            </Link>

            <Link href="/WebsiteRepository" className="text-friendly-black text-sm font-semibold mx-2 px-3 hover:underline hover:text-blue-500">
              Website Repository
            </Link>

            <span className="text-friendly-black2 my-0 text-md mt-4 mx-2 mb-3 px-3 font-semibold">@ 2023 Group 10</span>
          </div>
          
        </div>
        
      </div>
      
    </div>
    </>
  );
};

export default Sidebar;
