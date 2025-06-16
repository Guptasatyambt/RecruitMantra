// NotificationDropdown.jsx

import { useEffect, useRef } from "react";
import { Bell } from "lucide-react"; // or any icon
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({
  stats,
  notifications,
  ongoingMenuOpen,
  setOngoingMenuOpen,
}) {
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOngoingMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOngoingMenuOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
        onClick={() => setOngoingMenuOpen(!ongoingMenuOpen)}
      >
        <Bell className="h-6 w-6" />
        {notifications > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            {notifications}
          </span>
        )}
      </button>

      {ongoingMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2 max-h-60 overflow-y-auto">
            {stats.onGoing.length > 0 ? (
              stats.onGoing.map((company, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setOngoingMenuOpen(false);
                    navigate(`/company/${company.companyId}`)
                  }}
                >
                    Fill new Form: 
                    <h3 className="text-lg font-medium text-gray-900">{company.companyName}</h3>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No ongoing companies</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
