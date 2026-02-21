import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import {
  SunIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const AdminSettings = () => {
  const [theme, setTheme] = useState("light");
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [fullSiteDown, setFullSiteDown] = useState(true);
  const [selectedPage, setSelectedPage] = useState("");

  const pages = [
    "Home",
    "Dashboard",
    "Login",
    "Register",
    "Audit Logs",
    "Profile",
  ];

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } min-h-screen p-6 transition-all duration-300`}
    >
      <h1 className="text-3xl font-semibold mb-6">⚙️ Admin Settings</h1>

      {/* Theme Toggle */}
      <div
        className={`mb-6 rounded-xl p-5 shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
          <SunIcon className="w-5 h-5" />
          Theme Settings
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Dark Mode</span>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            className={`${
              theme === "dark" ? "bg-blue-600" : "bg-gray-400"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div
        className={`rounded-xl p-5 shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
          <WrenchScrewdriverIcon className="w-5 h-5" />
          Maintenance Mode
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-400">Enable Maintenance Mode</span>
          <Switch
            checked={maintenanceEnabled}
            onChange={setMaintenanceEnabled}
            className={`${
              maintenanceEnabled ? "bg-red-600" : "bg-gray-400"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                maintenanceEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>

        {maintenanceEnabled && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="mode"
                checked={fullSiteDown}
                onChange={() => setFullSiteDown(true)}
              />
              <label>Put whole site under maintenance</label>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="mode"
                checked={!fullSiteDown}
                onChange={() => setFullSiteDown(false)}
              />
              <label>Put only a specific page under maintenance</label>
            </div>

            {!fullSiteDown && (
              <div className="mt-2">
                <label className="block mb-1 text-sm text-gray-400">
                  Select Page
                </label>
                <select
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  <option value="">-- Select a Page --</option>
                  {pages.map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold shadow-md transition"
          onClick={() => {
            const data = {
              theme,
              maintenanceEnabled,
              fullSiteDown,
              selectedPage,
            };
            console.log("Settings to save:", data);
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
