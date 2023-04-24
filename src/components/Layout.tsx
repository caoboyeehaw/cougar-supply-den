import React, { PropsWithChildren, useState, useEffect } from "react";
import AdminNavbar from "./NavbarAdmin";
import CustomerNavbar from "./NavbarCustomer";
import VisitorNavbar from "./NavbarVisitor";
import Sidebar from "./Sidebar";

import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  useLayout: boolean;
}

const Layout = (props: PropsWithChildren) => {
const [renderContent, setRenderContent] = useState(false);


useEffect(() => {
  const timer = setTimeout(() => {
    setRenderContent(true);
  }, 1000);

  return () => {
    clearTimeout(timer);
  };
}, []);



  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAuth();

  const getUserNavbar = () => {
    if (auth.user === null) {
      return (
        <VisitorNavbar
          onMenuButtonClick={() => setSidebarOpen((prev) => !prev)}
          open={false}
          setOpen={function (open: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      );

    } else if (auth.user.userType == 'Admin') {
      return (
        <AdminNavbar
          onMenuButtonClick={() => setSidebarOpen((prev) => !prev)}
          open={false}
          setOpen={function (open: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      ); // Render the AdminNavbar for admin users
    } else if (auth.user.userType == 'Customer') {
      return (
        <CustomerNavbar
          onMenuButtonClick={() => setSidebarOpen((prev) => !prev)}
          open={false}
          setOpen={function (open: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      );
  } else {
    return (
      <VisitorNavbar
        onMenuButtonClick={() => setSidebarOpen((prev) => !prev)}
        open={false}
        setOpen={function (open: boolean): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }
  };

  return (
    <div className="grid min-h-screen grid-rows-header bg-friendly-grey">
      <div>{getUserNavbar()}</div>
          <div className={auth.user?.userType === "Admin" ? "grid md:grid-cols-sidebar" : "grid"}>
            {auth.user?.userType === "Admin" && (
              <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                toggleMinimized={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            )}
            {props.children}
          </div>
    </div>
  );
};

export default Layout;


