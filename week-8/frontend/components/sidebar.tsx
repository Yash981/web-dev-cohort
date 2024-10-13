"use client";
import { GraduationCap, House, LogOut, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useGlobalStateManagement } from "../state-management/use-global-state";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { onAdminRole, isAdminRole } = useGlobalStateManagement();
  return (
    <aside className="h-screen sticky top-0 bg-black text-white p-6 flex flex-col w-72 border-r border-gray-800 ">
      <div className="flex flex-col justify-between h-full">
        <nav className="space-y-1">
          <Link
            href="/"
            className={`flex items-center px-4 py-3 text-lg hover:bg-gray-800 rounded transition-colors ${
              pathname === "/" ? "bg-gray-800" : ""
            }`}
          >
            <House className="mr-3" />
            <span>Home</span>
          </Link>

          <Link
            href="/courses"
            className={`group flex items-center px-4 py-3 text-lg hover:bg-gray-800 rounded transition-colors ${
              pathname === "/courses" ? "bg-gray-800" : ""
            }`}
          >
            <GraduationCap className="mr-3 transition-transform duration-300 ease-in-out group-hover:rotate-40" />
            <span>Courses</span>
          </Link>

          {localStorage.getItem('course_selling_token') && <Link
            href="/purchases"
            className={`flex items-center px-4 py-3 text-lg hover:bg-gray-800 rounded transition-colors ${
              pathname === "/purchases" ? "bg-gray-800" : ""
            }`}
          >
            <ShoppingCart className="mr-3" />
            <span>Purchases</span>
          </Link>}

          {localStorage.getItem('course_selling_token') && <Link
            href="/profile"
            className={`flex items-center px-4 py-3 text-lg hover:bg-gray-800 rounded transition-colors ${
              pathname === "/profile" ? "bg-gray-800" : ""
            }`}
          >
            <User className="mr-3" />
            <span>Profile</span>
          </Link>}
        </nav>

        {localStorage.getItem('course_selling_token') &&<Button
          className={`flex items-center px-4 py-3 text-lg hover:bg-gray-800 rounded mt-4 transition-colors`}
          onClick={async () => {
            if(isAdminRole){
            try {
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/logout`, {
                method: 'POST',
                credentials: 'include',
              });
              localStorage.removeItem("course_selling_token");
              onAdminRole(false);
              router.push("/");
              router.refresh();
            } catch (error) {
              console.error("Error logging out:", error);
            }
          } else {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/logout`, {
                method: 'POST',
                credentials: 'include',
              });
              localStorage.removeItem("course_selling_token");
              router.push("/");
              router.refresh();
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }
          }}
        >
          <LogOut className="mr-3" />
          <span>Logout</span>
        </Button>}
      </div>
    </aside>
  );
};

export default Sidebar;
