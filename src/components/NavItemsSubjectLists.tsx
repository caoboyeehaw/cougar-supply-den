import React from "react";
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  BanknotesIcon,
  ChartBarIcon,
  ChartPieIcon,
  ShoppingBagIcon,
  RectangleGroupIcon

} from "@heroicons/react/24/outline";
import { NavItem } from "./Sidebar";

export const NavItemsSubjectLists: NavItem[] = [
  {
    label: "Product List",
    href: "/ProductList",
    icon: <ClipboardDocumentIcon className="w-5 h-5" />,
  },
  {
    label: "Supplier List",
    href: "/SupplierList",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
  },
];

