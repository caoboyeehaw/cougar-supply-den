import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type Props = {
  onMenuButtonClick(): void;
  open: boolean;
  navItems?: NavItem[];
  setOpen(open: boolean): void;
  
};

const VisitorNavbar = (props: Props) => {
  const router = useRouter();

  const isLoginPage = router.pathname === "/LoginPage";
  const isSignupPage = router.pathname === "/SignupPage";


  if (isLoginPage || isSignupPage) {
    return null;
  }

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  const navigateToHomePage = () => {
    router.push("/");
  };

  return (
    <nav
      className={classNames({
        "bg-cougar-dark-red text-zinc-100": true, // colors
        "flex items-center": true, // layout
        "w-full fixed  shadow-xl h-16": true, //positioning & styling
        "z-50": true, //z plane
      })}
    >


      <button onClick={navigateToHomePage} className=" hover:bg-cougar-dark-red2 py-3.5 px-4">
        <div className="font-bold text-md py-2"></div>
        <div className="text-sm">
          {/* Replace with the 'your-image-url' with the actual image URL */}
          <Image
          className="max-w-[135px] max-h-[36px] -mt-4"
          src="https://i.postimg.cc/8CmrGW8J/cougar-supply-den-full-logo-alpha.png"
          alt=""
          width={135}
          height={36}
        />
        </div>
      </button>

      <div className="text-cougar-yellow font-bold text-xl py-4 px-6 mr-4">
          GUEST VISITOR
      </div>

      {/*Contact*/}
        <div className="flex-col">
          <div className="flex flex-col">
            <Link href="/" className="text-cougar-yellow font-bold text-md hover:bg-cougar-dark-red2 py-5 px-6">
            Store View
            </Link>
          </div>
        </div>

      {/*

      <Link href="/TerminalPage" className="text-cougar-yellow font-bold text-xl hover:bg-cougar-dark-red2 py-4 px-6">
          ADMINISTRATOR TERMINAL
      </Link>

      */}

  

  <div className="relative flex-1">

  {/*//the searchbar lol
  <div className="inline-flex items-stretch max-w-[400px] rounded shadow-lg border-1 border-transparent focus-within:border-blue-500">
        <div className="pointer-events-none absolute inset-y-0 right-[calc(84%-2.5rem)] flex items-center px-1.5 text-black"></div>
        <input
          type="text"
          placeholder="Search Contents"
          className="text-black px-4 py-1.5 max-w-[1000px] rounded-l border-transparent focus:border-blue-500 focus:ring-0 focus:outline-none"
        />
        <button className="inset-y-0 flex items-center px-3 rounded-r bg-cougar-gold hover:bg-cougar-gold-dark">
          <MagnifyingGlassIcon className="text-friendly-black fontbold h-6 w-6 " />
        </button>
        
      </div>
    */}

      
    </div>

    <div className="mx-2"></div>
      {/*Home*/}
        <div className="flex-col">
          <div className="flex flex-col">
            <Link href="/ProjectInformation" className="text-cougar-yellow font-bold text-md hover:bg-cougar-dark-red2 py-5 px-6">
            About
            </Link>
          </div>
        </div>

      {/*Source*/}
        <div className="flex-col">
          <div className="flex flex-col">
            <Link href="/WebsiteRepository" className="text-cougar-yellow font-bold text-md hover:bg-cougar-dark-red2 py-5 px-6">
            Source
            </Link>
          </div>
        </div>

      {/*Contact*/}
        <div className="flex-col">
          <div className="flex flex-col">
            <Link href="/GroupMemberList" className="text-cougar-yellow font-bold text-md hover:bg-cougar-dark-red2 py-5 px-6">
            Members
            </Link>
          </div>
        </div>




      <div className="p-4 flex">
        <div className="flex justify-end">
            <button onClick={handleLogout} className="flex items-center bg-cougar-teal hover:bg-cougar-dark-teal rounded px-2.5">
                <Link href="/LoginPage" className="text-white font-bold hidden lg:block text-sm md:text-md mx-2">
                    Log In
                </Link>
            </button>

            <button onClick={handleLogout} className="flex items-center bg-cougar-gold hover:bg-cougar-gold-dark rounded p-2 mx-6">
                <Link href="/SignupPage" className="text-friendly-black font-bold hidden lg:block text-sm md:text-md mx-1">
                    Sign Up
                </Link>
            </button>
        </div>
        </div>
    

    </nav>
  );
};

export default VisitorNavbar;