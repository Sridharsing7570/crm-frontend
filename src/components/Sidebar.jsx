import { useTheme } from "@/context/theme-context";
import { Home, User, Calendar, Mail, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Dashboard", to: "/dashboard" },
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Calendar, label: "Calendar", to: "/calendar" },
  { icon: Mail, label: "Messages", to: "/messages" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar({ open, onClose }) {
  const { darkMode } = useTheme();

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div
          className={`flex h-full w-64 flex-col ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-r`}
        >
          <div className="flex h-16 shrink-0 items-center px-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ` +
                    (isActive
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-blue-50 text-blue-700"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                  }
                  end={item.to === "/dashboard"}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
