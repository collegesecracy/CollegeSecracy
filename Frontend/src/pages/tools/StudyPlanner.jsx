import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiBook,
  FiCheck,
  FiTrash2,
  FiPlus,
  FiClock,
  FiBookmark,
  FiEdit2,
  FiSearch,
  FiFilter,
  FiHome,
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiFlag,
  FiAlertTriangle,
  FiUser
} from "react-icons/fi";
import useAuthStore from "@/store/useAuthStore.js";
import { toast } from "react-hot-toast";
import Chart from "react-apexcharts";
import SEO from "@/components/SEO.jsx";
import { format, parseISO, differenceInMinutes, addDays, isToday, isAfter, isBefore, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from "date-fns";

// SVG Background Component
const StudyBackground = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-5">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={darkMode ? "#4ade80" : "#10b981"}
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white dark:to-gray-900"></div>
      {/* Floating study items */}
      <div className="absolute top-1/4 left-10 w-24 h-24 opacity-20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={darkMode ? "#4ade80" : "#10b981"}
          strokeWidth="1"
          className="w-full h-full"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-20 w-20 h-20 opacity-20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={darkMode ? "#4ade80" : "#10b981"}
          strokeWidth="1"
          className="w-full h-full"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 opacity-20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={darkMode ? "#4ade80" : "#10b981"}
          strokeWidth="1"
          className="w-full h-full"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
    </div>
  );
};

const StudyPlanner = () => {
  const {
    user,
    sessions,
    fetchSession,
    addSession,
    deleteSession,
    updateSession,
    toggleSession,
    markSession,
  } = useAuthStore();
  const navigate = useNavigate();
  
  const [studySessions, setStudySessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    topics: "",
    priority: "medium",
    status: "planned",
    notes: "",
    bookmarked: false,
  });
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("planner");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: "all",
    status: "all",
    bookmarked: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Stats state
  const [studyStats, setStudyStats] = useState({
    weeklyHours: 0,
    streak: 0,
    milestones: [],
    todaysSessions: [],
    upcomingDeadlines: [],
    weeklyData: [],
    subjectDistribution: [],
  });

  // Load data from Zustand store
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSession();
        toast.success("Sessions loaded successfully");
      } catch (error) {
        toast.error("Failed to load sessions");
        console.error("Error loading sessions:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setStudySessions(sessions.filter(session => session.status !== "completed"));
    setCompletedSessions(sessions.filter(session => session.status === "completed"));
    calculateStudyStats();
  }, [sessions]);

  // Calculate study statistics
  const calculateStudyStats = () => {
    // Calculate weekly study time
    const now = new Date();
    const oneWeekAgo = addDays(now, -7);
    
    const weeklySessions = sessions.filter(session => {
      if (!session.completionDate) return false;
      const sessionDate = parseISO(session.completionDate);
      return sessionDate >= oneWeekAgo && session.status === "completed";
    });

    // Calculate total study time for the week
    let totalMinutes = 0;
    weeklySessions.forEach(session => {
      if (session.startTime && session.endTime) {
        const start = new Date(`2000-01-01T${session.startTime}`);
        const end = new Date(`2000-01-01T${session.endTime}`);
        totalMinutes += (end - start) / (1000 * 60);
      }
    });

    // Calculate study time per day for the chart
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weeklyData = weekDays.map(day => {
      const daySessions = sessions.filter(session => {
        if (!session.completionDate) return false;
        const sessionDate = parseISO(session.completionDate);
        return isSameDay(sessionDate, day) && session.status === "completed";
      });
      
      let dayMinutes = 0;
      daySessions.forEach(session => {
        if (session.startTime && session.endTime) {
          const start = new Date(`2000-01-01T${session.startTime}`);
          const end = new Date(`2000-01-01T${session.endTime}`);
          dayMinutes += (end - start) / (1000 * 60);
        }
      });
      
      return {
        date: day,
        hours: (dayMinutes / 60).toFixed(2),
        sessions: daySessions.length
      };
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const hasSession = sessions.some(session => {
        if (!session.completionDate) return false;
        const sessionDate = parseISO(session.completionDate);
        return isSameDay(sessionDate, date) && session.status === "completed";
      });
      
      if (hasSession) streak++;
      else break;
    }

    // Get today's sessions
    const todaysSessions = sessions.filter(session => {
      if (!session.date) return false;
      const sessionDate = parseISO(session.date);
      return isToday(sessionDate) && session.status !== "completed";
    });

    // Get upcoming deadlines (sessions due in next 3 days)
    const upcomingDeadlines = sessions.filter(session => {
      if (!session.date || session.status === "completed") return false;
      const sessionDate = parseISO(session.date);
      const daysUntil = differenceInMinutes(sessionDate, now) / (60 * 24);
      return daysUntil > 0 && daysUntil <= 3;
    }).sort((a, b) => {
      return parseISO(a.date) - parseISO(b.date);
    });

    // Subject distribution
    const subjectMap = new Map();
    sessions.forEach(session => {
      if (session.status === "completed" && session.subject) {
        const subject = session.subject;
        const duration = calculateDurationMinutes(session.startTime, session.endTime);
        
        if (subjectMap.has(subject)) {
          subjectMap.set(subject, subjectMap.get(subject) + duration);
        } else {
          subjectMap.set(subject, duration);
        }
      }
    });
    
    const subjectDistribution = Array.from(subjectMap.entries()).map(([subject, minutes]) => ({
      subject,
      hours: (minutes / 60).toFixed(1)
    })).sort((a, b) => b.hours - a.hours);

    // Milestones
    const milestones = [];
    if (streak >= 3) milestones.push(`🔥 ${streak}-day streak!`);
    if (streak >= 7) milestones.push(`🚀 1-week streak!`);
    if (weeklySessions.length >= 5) milestones.push(`📚 ${weeklySessions.length} sessions this week!`);
    if (totalMinutes >= 10 * 60) milestones.push(`🎯 ${(totalMinutes/60).toFixed(1)} study hours this week!`);

    setStudyStats({
      weeklyHours: (totalMinutes / 60).toFixed(1),
      streak,
      milestones,
      todaysSessions,
      upcomingDeadlines,
      weeklyData,
      subjectDistribution,
    });
  };

  // Calculate duration in minutes
  const calculateDurationMinutes = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return differenceInMinutes(endTime, startTime);
  };

  // Format time display
  const formatTimeDisplay = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  // Calculate Session Duration
  const calculateDuration = (start, end) => {
    const minutes = calculateDurationMinutes(start, end);
    if (minutes <= 0) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format Date (e.g., "Mon, Jan 15")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return format(date, "EEE, MMM d");
  };

  // Days Until Session with urgency indicator
  const daysUntilSession = (sessionDate) => {
    if (!sessionDate) return "N/A";
    const today = new Date();
    const session = parseISO(sessionDate);
    const diffDays = Math.ceil(differenceInMinutes(session, today) / (60 * 24));
    
    if (diffDays < 0) return "Past due";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  // Get urgency color for upcoming sessions
  const getUrgencyColor = (sessionDate) => {
    if (!sessionDate) return "";
    const today = new Date();
    const session = parseISO(sessionDate);
    const diffDays = Math.ceil(differenceInMinutes(session, today) / (60 * 24));
    
    if (diffDays < 0) return "text-red-500 dark:text-red-400";
    if (diffDays === 0) return "text-orange-500 dark:text-orange-400";
    if (diffDays <= 2) return "text-yellow-500 dark:text-yellow-400";
    return "";
  };

  // Add New Session
  const addStudySession = async () => {
    if (!newSession.title || !newSession.date) {
      toast.error("Title and date are required");
      return;
    }

    try {
      const session = {
        ...newSession,
        duration: calculateDuration(newSession.startTime, newSession.endTime),
      };

      await addSession(session);
      await fetchSession();
      resetNewSessionForm();
      toast.success("Study session added successfully");
    } catch (error) {
      toast.error("Failed to add session");
      console.error("Error adding session:", error);
    }
  };

  // Update Session
  const updateStudySession = async () => {
    if (!selectedSession) return;

    try {
      const updatedSession = {
        ...selectedSession,
        duration: calculateDuration(
          selectedSession.startTime,
          selectedSession.endTime
        ),
      };
      await updateSession(selectedSession._id, updatedSession);
      await fetchSession();
      setSelectedSession(null);
      setEditMode(false);
      toast.success("Session updated successfully");
    } catch (error) {
      toast.error("Failed to update session");
      console.error("Error updating session:", error);
    }
  };

  // Delete Session
  const deleteStudySession = async (id) => {
    if (!id) return;

    try {
      await deleteSession(id);
      await fetchSession();
      toast.success("Session deleted successfully");
      
      if (selectedSession?._id === id) {
        setSelectedSession(null);
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Failed to delete session");
      console.error("Error deleting session:", error);
    }
  };

  // Mark as Completed
  const completeStudySession = async (id) => {
    if (!id) {
      toast.error("Invalid session ID");
      return;
    }

    try {
      await markSession(id);
      await fetchSession();
      toast.success("Session marked as completed");
      
      if (selectedSession?._id === id) {
        setSelectedSession(null);
      }
    } catch (error) {
      toast.error("Failed to complete session");
      console.error("Error completing session:", error);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = async (id) => {
    if (!id) {
      toast.error("Invalid session ID");
      return;
    }

    try {
      await toggleSession(id);
      await fetchSession();
      const freshSession = sessions.find((s) => s._id === id);
      if (freshSession) {
        setSelectedSession((prev) => (prev && prev._id === id ? freshSession : prev));
        toast.success(
          freshSession.bookmarked 
            ? "Session bookmarked" 
            : "Bookmark removed"
        );
      }
    } catch (error) {
      toast.error("Failed to toggle bookmark");
      console.error("Error toggling bookmark:", error);
    }
  };

  // Reset Form
  const resetNewSessionForm = () => {
    setNewSession({
      title: "",
      subject: "",
      date: "",
      startTime: "",
      endTime: "",
      topics: "",
      priority: "medium",
      status: "planned",
      notes: "",
      bookmarked: false,
    });
  };

  // Clear All Completed Sessions
  const clearAllCompletedSessions = async () => {
    if (window.confirm("Are you sure? This will delete ALL your completed sessions.")) {
      try {
        const completedIds = completedSessions.map(session => session._id);
        for (const id of completedIds) {
          await deleteSession(id);
        }
        await fetchSession();
        toast.success("All completed sessions deleted");
      } catch (error) {
        toast.error("Failed to delete completed sessions");
        console.error("Error deleting completed sessions:", error);
      }
    }
  };

  // Priority Colors (for UI)
  const priorityColors = {
    high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  };

  const priorityBorderColors = {
    high: "border-red-200 dark:border-red-800",
    medium: "border-yellow-200 dark:border-yellow-800",
    low: "border-green-200 dark:border-green-800",
  };

  // Filter sessions based on search and filters
  const filteredSessions = studySessions.filter((session) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.subject &&
        session.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.topics &&
        session.topics.toLowerCase().includes(searchTerm.toLowerCase()));

    // Priority filter
    const matchesPriority =
      filters.priority === "all" || session.priority === filters.priority;

    // Status filter
    const matchesStatus =
      filters.status === "all" || session.status === filters.status;

    // Bookmarked filter
    const matchesBookmark = !filters.bookmarked || session.bookmarked;

    return matchesSearch && matchesPriority && matchesStatus && matchesBookmark;
  });

  // Weekly chart options for ApexCharts
  const weeklyChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
      foreColor: darkMode ? '#fff' : '#374151'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: studyStats.weeklyData.map(day => format(day.date, 'EEE')),
    },
    yaxis: {
      title: {
        text: 'Hours'
      },
      labels: {
        formatter: function(value) {
          return value + 'h';
        }
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#10B981'],
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " hours";
        }
      }
    },
    grid: {
      borderColor: darkMode ? '#4B5563' : '#E5E7EB'
    }
  };

  const weeklyChartSeries = [{
    name: 'Study Hours',
    data: studyStats.weeklyData.map(day => parseFloat(day.hours))
  }];

  // Subject distribution chart
  const subjectChartOptions = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
      foreColor: darkMode ? '#fff' : '#374151'
    },
    labels: studyStats.subjectDistribution.map(item => item.subject),
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return opts.w.config.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " hours";
        }
      }
    }
  };

  const subjectChartSeries = studyStats.subjectDistribution.map(item => parseFloat(item.hours));

  return (
    <>
    <SEO
  title="Study Planner for JEE/NEET Aspirants"
  description="Create your personalized study plan with our smart planner tool – stay consistent, track progress, and reach your exam goals."
/>
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative`}>
      <StudyBackground darkMode={darkMode} />
      
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/mentee-dashboard")}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              title="Back to Dashboard"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Study Planner
              </h1>
              <p className="text-xs hidden sm:block">Powered by CollegeSecracy</p>
            </div>
            <div className="flex items-center gap-3">
              {user?.profilePic?.url ? (
                <img 
                  src={user.profilePic.url} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-green-500">
                  <FiUser className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Upcoming Deadlines Alerts */}
        {studyStats.upcomingDeadlines.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-2 md:p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Upcoming deadlines
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {studyStats.upcomingDeadlines.slice(0, 3).map((session, idx) => (
                    <p key={idx}>
                      <span className="font-medium">{session.title}</span> due in{' '}
                      <span className={`font-bold ${getUrgencyColor(session.date)}`}>
                        {daysUntilSession(session.date)}
                      </span>{' '}
                      ({formatDate(session.date)})
                    </p>
                  ))}
                  {studyStats.upcomingDeadlines.length > 3 && (
                    <p className="text-yellow-600 dark:text-yellow-400">
                      +{studyStats.upcomingDeadlines.length - 3} more upcoming sessions
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Weekly Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 md:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Weekly Progress</h3>
            </div>
            <div className="h-40">
              <Chart
                options={weeklyChartOptions}
                series={weeklyChartSeries}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Total Study Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 md:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 md:gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <FiClock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Total Study Time</h3>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl md:text-3xl font-bold">{studyStats.weeklyHours}</span>
              <span className="text-gray-500 dark:text-gray-400 md:text-base text-sm mb-1">hours this week</span>
            </div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formatTimeDisplay(studyStats.weeklyHours)} total
            </p>
          </div>

          {/* Streak Tracker */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 md:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <FiAward className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Study Streak</h3>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl md:text-3xl font-bold">{studyStats.streak}</span>
              <span className="text-gray-500 dark:text-gray-400 mb-1 md:text-base text-sm">days</span>
            </div>
            <p className="md:text-sm text-xs text-gray-500 dark:text-gray-400 mt-2">
              {studyStats.streak > 0 ? "Keep it going!" : "Start a new streak!"}
            </p>
          </div>

          {/* Today's Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 md:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Today's Sessions</h3>
            </div>
            {studyStats.todaysSessions.length > 0 ? (
              <div>
                <p className="text-lg font-bold">{studyStats.todaysSessions.length} sessions</p>
                <ul className="mt-2 space-y-1">
                  {studyStats.todaysSessions.slice(0, 2).map((session, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      • {session.title}
                    </li>
                  ))}
                  {studyStats.todaysSessions.length > 2 && (
                    <li className="text-sm text-gray-500 dark:text-gray-400">
                      +{studyStats.todaysSessions.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 md:text-base text-sm dark:text-gray-400">No sessions scheduled</p>
            )}
          </div>
        </div>

        {/* Second Row of Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Subject Distribution */}
          {studyStats.subjectDistribution.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 lg:col-span-2">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiBook className="text-blue-500" />
                Subject Distribution
              </h3>
              <div className="h-64">
                <Chart
                  options={subjectChartOptions}
                  series={subjectChartSeries}
                  type="pie"
                  height="100%"
                />
              </div>
            </div>
          )}

          {/* Milestones Section */}
          {studyStats.milestones.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiAward className="text-yellow-500" />
                Your Milestones
              </h3>
              <div className="space-y-3">
                {studyStats.milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-green-100 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <FiCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {milestone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs (Planner/History) */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 font-medium ${
              activeTab === "planner"
                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Planner
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-medium ${
              activeTab === "history"
                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            History
          </button>
        </div>

{/* *Planner Tab* */}
{activeTab === "planner" ? (
  <div className="space-y-4 md:space-y-6">
    {/* *Add/Edit Session Form* */}
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
        {editMode ? (
          <FiEdit2 className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
        )}
        <span>{editMode ? "Edit Session" : "Add New Session"}</span>
      </h2>

      {/* *Form Inputs* */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">Title*</label>
          <input
            type="text"
            name="title"
            value={
              editMode ? selectedSession?.title || "" : newSession.title
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      title: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      title: e.target.value,
                    })
            }
            className="w-full p-2 md:p-2.5 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Calculus Chapter 3"
            required
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={
              editMode
                ? selectedSession?.subject || ""
                : newSession.subject
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      subject: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      subject: e.target.value,
                    })
            }
            className="w-full p-2 md:p-2.5 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Mathematics"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">Date*</label>
          <input
            type="date"
            name="date"
            value={
              editMode ? selectedSession?.date || "" : newSession.date
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      date: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      date: e.target.value,
                    })
            }
            className="w-full p-2 md:p-2.5 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={
                editMode
                  ? selectedSession?.startTime || ""
                  : newSession.startTime
              }
              onChange={
                editMode
                  ? (e) =>
                      setSelectedSession({
                        ...selectedSession,
                        startTime: e.target.value,
                      })
                  : (e) =>
                      setNewSession({
                        ...newSession,
                        startTime: e.target.value,
                      })
              }
              className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={
                editMode
                  ? selectedSession?.endTime || ""
                  : newSession.endTime
              }
              onChange={
                editMode
                  ? (e) =>
                      setSelectedSession({
                        ...selectedSession,
                        endTime: e.target.value,
                      })
                  : (e) =>
                      setNewSession({
                        ...newSession,
                        endTime: e.target.value,
                      })
              }
              className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs md:text-sm font-medium mb-1">Topics</label>
          <textarea
            name="topics"
            value={
              editMode
                ? selectedSession?.topics || ""
                : newSession.topics
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      topics: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      topics: e.target.value,
                    })
            }
            className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Separate topics with commas"
            rows="2"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={
              editMode
                ? selectedSession?.priority || "medium"
                : newSession.priority
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      priority: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      priority: e.target.value,
                    })
            }
            className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={
              editMode
                ? selectedSession?.status || "planned"
                : newSession.status
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      status: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      status: e.target.value,
                    })
            }
            className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs md:text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={
              editMode ? selectedSession?.notes || "" : newSession.notes
            }
            onChange={
              editMode
                ? (e) =>
                    setSelectedSession({
                      ...selectedSession,
                      notes: e.target.value,
                    })
                : (e) =>
                    setNewSession({
                      ...newSession,
                      notes: e.target.value,
                    })
            }
            className="w-full p-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Additional notes..."
            rows="2"
          />
        </div>

        {editMode && (
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="bookmarked"
              name="bookmarked"
              checked={selectedSession?.bookmarked || false}
              onChange={() =>
                setSelectedSession((prev) => ({
                  ...prev,
                  bookmarked: !prev.bookmarked,
                }))
              }
              className="h-3 w-3 md:h-4 md:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="bookmarked"
              className="ml-2 text-xs md:text-sm text-gray-700 dark:text-gray-300"
            >
              Bookmark this session
            </label>
          </div>
        )}
      </div>

      {/* *Form Buttons* */}
      <div className="mt-4 md:mt-6 flex justify-end gap-2 md:gap-3">
        {editMode && (
          <button
            onClick={() => {
              setEditMode(false);
              setSelectedSession(null);
            }}
            className="px-3 py-1.5 md:px-4 md:py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-md md:rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={editMode ? updateStudySession : addStudySession}
          className="px-4 py-1.5 md:px-6 md:py-2.5 text-xs md:text-sm bg-green-600 hover:bg-green-700 text-white rounded-md md:rounded-lg font-medium transition-colors focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:ring-offset-1 md:focus:ring-offset-2 flex items-center gap-1 md:gap-2"
        >
          {editMode ? (
            <>
              <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" />
              <span>Update</span>
            </>
          ) : (
            <>
              <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
              <span>Add Session</span>
            </>
          )}
        </button>
      </div>
    </div>

    {/* *Filter & Search* */}
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-2.5 top-2.5 md:left-3 md:top-3 text-gray-400 text-sm md:text-base" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 md:pl-10 md:py-2 text-sm md:text-base rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-gray-100 dark:bg-gray-700 rounded-md md:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FiFilter className="text-gray-600 dark:text-gray-300 text-xs md:text-sm" />
          <span>Filters</span>
        </button>
      </div>

      {/* *Advanced Filters* */}
      {showFilters && (
        <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full p-1.5 md:p-2 text-xs md:text-sm rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full p-1.5 md:p-2 text-xs md:text-sm rounded-md md:rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-1 md:focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="bookmarked-filter"
              checked={filters.bookmarked}
              onChange={(e) =>
                setFilters({ ...filters, bookmarked: e.target.checked })
              }
              className="h-3 w-3 md:h-4 md:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="bookmarked-filter"
              className="ml-2 text-xs md:text-sm text-gray-700 dark:text-gray-300"
            >
              Bookmarked only
            </label>
          </div>
        </div>
      )}
    </div>

    {/* *Sessions List* */}
    <div>
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-1.5 md:gap-2 text-green-700 dark:text-green-400">
          <FiBook className="w-4 h-4 md:w-5 md:h-5" />
          <span>Upcoming Sessions ({filteredSessions.length})</span>
        </h2>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-sm md:text-base bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ||
            filters.priority !== "all" ||
            filters.status !== "all" ||
            filters.bookmarked
              ? "No matching sessions found. Adjust your filters."
              : "No study sessions planned yet. Add your first session!"}
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-400px)] md:max-h-[calc(100vh-450px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className={`p-3 md:p-5 rounded-lg md:rounded-xl border ${
                  priorityBorderColors[session.priority]
                } shadow-xs md:shadow-sm hover:shadow-sm md:hover:shadow-md transition-all cursor-pointer ${
                  session.bookmarked ? "ring-1 ring-green-500" : ""
                }`}
                onClick={() => {
                  setSelectedSession(session);
                  setEditMode(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm md:text-base truncate max-w-[70%] md:max-w-[80%]">
                        {session.title}
                      </h3>
                      {session.bookmarked && (
                        <FiBookmark className="text-green-500 w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      )}
                    </div>
                    {session.subject && (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1 truncate">
                        {session.subject}
                      </p>
                    )}

                    <div className="mt-2 md:mt-3 space-y-1 md:space-y-1.5 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 dark:text-gray-300">
                        <FiCalendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span>
                          {formatDate(session.date)} •{" "}
                          {daysUntilSession(session.date)}
                        </span>
                      </div>

                      {session.startTime && session.endTime && (
                        <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 dark:text-gray-300">
                          <FiClock className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span>
                            {session.startTime} - {session.endTime} •{" "}
                            {session.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-2">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                          priorityColors[session.priority]
                        }`}
                      >
                        {session.priority} priority
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        {session.status}
                      </span>
                    </div>

                    {session.topics && (
                      <div className="mt-2 md:mt-3">
                        <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 md:mb-1">
                          Topics:
                        </p>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {session.topics}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-3 flex justify-end gap-1 md:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(session._id);
                    }}
                    className={`p-1 md:p-1.5 rounded md:rounded-full ${
                      session.bookmarked
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={
                      session.bookmarked
                        ? "Remove bookmark"
                        : "Bookmark"
                    }
                  >
                    <FiBookmark
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        session.bookmarked ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      completeStudySession(session._id);
                    }}
                    className="p-1 md:p-1.5 bg-green-600 hover:bg-green-700 rounded md:rounded-full text-white"
                    title="Mark Complete"
                  >
                    <FiCheck className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStudySession(session._id);
                    }}
                    className="p-1 md:p-1.5 bg-red-600 hover:bg-red-700 rounded md:rounded-full text-white"
                    title="Delete Session"
                  >
                    <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
) : (
  /* *History Tab* */
  <div>
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-1.5 md:gap-2 text-green-700 dark:text-green-400">
        <FiClock className="w-4 h-4 md:w-5 md:h-5" />
        <span>Completed Sessions ({completedSessions.length})</span>
      </h2>
      {completedSessions.length > 0 && (
        <button
          onClick={clearAllCompletedSessions}
          className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-red-600 hover:bg-red-700 rounded-md md:rounded-lg text-white flex items-center gap-1 md:gap-2 transition-colors"
        >
          <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
          <span>Clear All</span>
        </button>
      )}
    </div>

    {completedSessions.length === 0 ? (
      <div className="text-center py-6 md:py-8 text-sm md:text-base bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No completed sessions yet. Complete a session to see it here.
        </p>
      </div>
    ) : (
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-350px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {completedSessions.map((session) => (
            <div
              key={session._id}
              className="p-3 md:p-5 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm md:hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-sm md:text-base flex items-center gap-1.5 md:gap-2">
                {session.title}
                {session.bookmarked && (
                  <FiBookmark className="text-green-500 w-3 h-3 md:w-4 md:h-4" />
                )}
              </h3>
              {session.subject && (
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1">
                  {session.subject}
                </p>
              )}

              <div className="mt-2 md:mt-3 space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <FiFlag className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                  <span className="capitalize">{session.priority} priority</span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  <FiCalendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                  <span>Scheduled: {formatDate(session.date)}</span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  <FiCheck className="w-3 h-3 md:w-4 md:h-4 text-green-500 dark:text-green-400" />
                  <span>
                    Completed: {formatDate(session.completionDate)}
                  </span>
                </div>

                {session.startTime && session.endTime && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <FiClock className="w-3 h-3 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                    <span>Duration: {session.duration}</span>
                  </div>
                )}

                {session.topics && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                      Topics covered:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {session.topics}
                    </p>
                  </div>
                )}

                {session.notes && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                      Notes:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {session.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
      </main>
    </div>
    </>
  );
};

export default StudyPlanner;