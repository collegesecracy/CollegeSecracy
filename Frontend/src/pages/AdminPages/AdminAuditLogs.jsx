import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore.js";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdminAuditLogs = () => {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { adminAuditLogs, getAllLogs, isLoading } = useAuthStore();

  useEffect(() => {
    getAllLogs();
    setIsDarkMode(theme === "dark");
  }, [theme]);

  useEffect(() => {
    setFilteredLogs(adminAuditLogs);
  }, [adminAuditLogs]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = adminAuditLogs.filter((log) =>
      log.userId?.fullName?.toLowerCase().includes(value) ||
      log.action?.toLowerCase().includes(value) ||
      log.reason?.toLowerCase().includes(value)
    );
    setFilteredLogs(filtered);
  };

  const handleRefresh = () => {
    getAllLogs();
  };

  // Theme-based styling
  const bgMain = isDarkMode ? "bg-[#0e0e1b]" : "bg-gray-100";
  const textMain = isDarkMode ? "text-white" : "text-gray-900";
  const inputBg = isDarkMode ? "bg-[#1a1a2e] text-white border-gray-600" : "bg-white text-black border-gray-400";
  const inputFocus = isDarkMode ? "focus:ring-blue-500" : "focus:ring-blue-400";
  const tableHeadBg = isDarkMode ? "bg-[#1a1a2e] text-blue-300" : "bg-blue-100 text-blue-800";
  const rowHover = isDarkMode ? "hover:bg-[#202040]" : "hover:bg-blue-50";
  const borderColor = isDarkMode ? "border-[#222244]" : "border-gray-300";
  const logReasonColor = isDarkMode ? "text-red-400" : "text-red-600";
  const logActionColor = isDarkMode ? "text-yellow-300" : "text-yellow-600";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} px-4 py-6 md:px-6 md:py-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-semibold text-blue-400 flex items-center gap-3">
            📝 Audit Logs
            <ArrowPathIcon
              className={`w-6 h-6 cursor-pointer ${isLoading ? "animate-spin" : ""} text-blue-300 hover:text-blue-500 transition`}
              onClick={handleRefresh}
              title="Refresh Logs"
            />
          </h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by user or action..."
            value={search}
            onChange={handleSearch}
            className={`w-full md:w-96 px-4 py-2 rounded-xl ${inputBg} border focus:outline-none focus:ring-2 ${inputFocus}`}
          />
        </div>

        {/* Logs Table */}
        <div className={`overflow-x-auto rounded-xl shadow-xl border ${borderColor}`}>
          <table className="min-w-full text-sm md:text-base border-collapse">
            <thead className={tableHeadBg}>
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Device/IP</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className={`border-t ${borderColor}`}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton
                          height={20}
                          baseColor={isDarkMode ? "#1a1a2e" : "#e0e0e0"}
                          highlightColor={isDarkMode ? "#2a2a3e" : "#f0f0f0"}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                    No logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr
                    key={i}
                    className={`border-t ${borderColor} ${rowHover} transition duration-150`}
                  >
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      {log.userId?.fullName || "Unknown"}
                    </td>
                    <td className={`px-4 py-3 ${logActionColor}`}>{log.action}</td>
                    <td className={`px-4 py-3 ${logReasonColor}`}>
                      {log.reason || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-xs">{log.ip}</div>
                      <div className="text-[11px] text-gray-500 truncate w-48 md:w-auto">
                        {log.deviceInfo?.slice(0, 100) || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
