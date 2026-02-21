import { useState, useEffect } from "react";
import { 
  TrashIcon, 
  ClipboardIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  TrophyIcon,
  CalculatorIcon,
  ArrowPathIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { marksToPercentile } from "../../utils/CollegeData.js";
import PageWrapper from "@/components/PageWrapper.jsx";
import SEO from "@/components/SEO.jsx";


const jeeHeroImage = "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80";
const successImage = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

const RankCalculator = () => {
  // State variables
  const [inputType, setInputType] = useState("score");
  const [score, setScore] = useState("");
  const [percentileInput, setPercentileInput] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [rank, setRank] = useState(null);
  const [percentile, setPercentile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Candidates Appeared
  //const candidatesAppeared = 1475103; // Total candidates appeared in JEE Main 2025
    const candidatesAppeared = 1600000; // Total candidate appeared in JEE 2026

  // Load saved history
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('jee-rank-history')) || [];
    setHistory(savedHistory);
  }, []);

  // Calculate percentile from marks using exact data
  const calculateExactPercentile = (marks) => {
    const entry = marksToPercentile.find(
      e => marks >= e.minMarks && marks <= e.maxMarks
    );
    
    if (!entry) return 0;
    
    // Linear interpolation within the range
    if (entry.minMarks === entry.maxMarks) {
      return entry.minPercentile;
    }
    
    const rangeRatio = (marks - entry.minMarks) / (entry.maxMarks - entry.minMarks);
    const percentile = entry.minPercentile + rangeRatio * (entry.maxPercentile - entry.minPercentile);
    
    return Math.min(100, Math.max(0, percentile));
  };

  // Calculate rank from percentile
  const calculateRank = (percentile) => {
    const rank = Math.round(((100 - percentile) * candidatesAppeared) / 100);
    return Math.max(1, rank);
  };

  // Main calculation function
  const calculateJeeRank = () => {
    setLoading(true);
    
    try {
      let calculatedPercentile;

      if (inputType === "score") {
        const marks = parseFloat(score);
        if (isNaN(marks) || marks < 0 || marks > 300) {
          alert("Please enter valid marks between 0 and 300");
          return;
        }
        calculatedPercentile = calculateExactPercentile(marks);
      } else {
        calculatedPercentile = parseFloat(percentileInput);
        if (isNaN(calculatedPercentile) || calculatedPercentile < 0 || calculatedPercentile > 100) {
          alert("Please enter valid percentile between 0 and 100");
          return;
        }
      }

      const calculatedRank = calculateRank(calculatedPercentile);
      
      setRank(calculatedRank);
      setPercentile(calculatedPercentile);
      
      const calculation = { 
        inputType,
        ...(inputType === "score" && { marks: parseFloat(score) }),
        percentile: calculatedPercentile,
        rank: calculatedRank,
        applicationNo,
        mobile,
        dob,
        timestamp: new Date().toISOString()
      };
      
      // Update local history
      const updatedHistory = [calculation, ...history.slice(0, 4)];
      setHistory(updatedHistory);
      localStorage.setItem('jee-rank-history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy results to clipboard
  const copyResult = () => {
    const text = `JEE Main Rank Prediction\n` +
      `${inputType === "score" ? `Score: ${score}/300\n` : `Percentile: ${percentileInput}%\n`}` +
      `Predicted Rank: ${rank.toLocaleString()}\n` +
      `Percentile: ${percentile.toFixed(2)}%\n` +
      `Application No: ${applicationNo || 'Not specified'}\n` +
      `Mobile: ${mobile || 'Not specified'}\n` +
      `DOB: ${dob || 'Not specified'}`;
    
    navigator.clipboard.writeText(text);
    
    // Show temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm';
    notification.textContent = 'Results copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  // Delete a history item
  const deleteHistoryItem = (index) => {
    if (window.confirm("Are you sure you want to delete this calculation?")) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      setHistory(updatedHistory);
      localStorage.setItem('jee-rank-history', JSON.stringify(updatedHistory));
    }
  };

  // Clear all history
  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('jee-rank-history');
    }
  };

  // Load a calculation from history
  const loadCalculation = (calc) => {
    if (calc.inputType === "score") {
      setScore(calc.marks?.toString() || "");
    } else {
      setPercentileInput(calc.percentile?.toString() || "");
    }
    setPercentile(calc.percentile);
    setRank(calc.rank);
    setApplicationNo(calc.applicationNo || "");
    setMobile(calc.mobile || "");
    setDob(calc.dob || "");
    setInputType(calc.inputType || "score");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="JEE Rank Calculator | CollegeSecretary"
        description="Estimate your JEE rank instantly using our easy-to-use rank calculator. Accurate results based on percentile and sessional trends."
      />
      <PageWrapper>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header with back button */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <h1 className="text-lg font-bold">JEE Rank Calculator</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="rounded-xl p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  JEE Main Rank Predictor
                </h1>
                <p className="text-sm md:text-base text-blue-100">
                  Get accurate rank predictions based on your score or percentile
                </p>
                <div className="flex items-center mt-3">
                  <TrophyIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-white text-sm md:text-base font-medium">Instant Results</span>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src={jeeHeroImage} 
                  alt="Students preparing for JEE" 
                  className="h-32 md:h-40 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <div className="rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 bg-white">
            <h2 className="text-xl font-bold mb-4 md:mb-6 flex items-center text-blue-600">
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Enter Your Details
            </h2>
            
            {/* Input Type Toggle */}
            <div className="mb-4 md:mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Input Type
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={inputType === "score"}
                    onChange={() => setInputType("score")}
                  />
                  <span className="text-sm text-gray-700">Score (0-300)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={inputType === "percentile"}
                    onChange={() => setInputType("percentile")}
                  />
                  <span className="text-sm text-gray-700">Percentile (0-100)</span>
                </label>
              </div>
            </div>

            {/* Score/Percentile Input */}
            <div className="mb-4 md:mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {inputType === "score" ? "Enter Your JEE Main Score" : "Enter Your Percentile"}
              </label>
              <input
                type="number"
                value={inputType === "score" ? score : percentileInput}
                onChange={(e) => inputType === "score" 
                  ? setScore(e.target.value) 
                  : setPercentileInput(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 border bg-gray-50 border-gray-300 text-gray-900"
                min="0"
                max={inputType === "score" ? 300 : 100}
                step={inputType === "percentile" ? "0.01" : "1"}
                placeholder={inputType === "score" ? "e.g., 185" : "e.g., 97.5"}
              />
            </div>

            {/* Application Number (Optional) */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Application Number (Optional)
              </label>
              <input
                type="text"
                value={applicationNo}
                onChange={(e) => setApplicationNo(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 border bg-gray-50 border-gray-300 text-gray-900"
                placeholder="e.g., 123456789"
              />
            </div>

            {/* Mobile Number (Optional) */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 border bg-gray-50 border-gray-300 text-gray-900"
                placeholder="10-digit mobile number"
              />
            </div>

            {/* Date of Birth (Optional) */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 border bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateJeeRank}
              disabled={loading || (inputType === "score" ? !score : !percentileInput)}
              className={`w-full py-3 px-4 rounded-lg text-sm font-bold text-white transition-colors flex items-center justify-center bg-orange-500 hover:bg-orange-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Predict My Rank
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {rank !== null && (
            <div className="rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 bg-white">
              <div className="flex items-center mb-4 md:mb-6">
                <img 
                  src={successImage} 
                  alt="Success" 
                  className="h-12 w-12 mr-3 rounded-full" 
                  loading="lazy"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-600">
                    Prediction Results
                  </h3>
                  <p className="text-xs text-gray-600">
                    Based on your {inputType === "score" ? "score" : "percentile"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="p-4 rounded-xl border bg-blue-50 border-blue-300">
                  <h4 className="text-base font-semibold mb-2 flex items-center text-blue-600">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Predicted Rank
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {rank.toLocaleString()}
                    </span>
                    <span className="text-xs mb-1 text-gray-600">
                      out of {candidatesAppeared.toLocaleString()} candidates
                    </span>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border bg-purple-50 border-purple-300">
                  <h4 className="text-base font-semibold mb-2 flex items-center text-purple-600">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Percentile
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {percentile.toFixed(2)}%
                    </span>
                    <span className="text-xs mb-1 text-gray-600">
                      Top {percentile.toFixed(2)}% students
                    </span>
                  </div>
                </div>
              </div>

              {/* JEE Insights */}
              <div className="p-3 rounded-lg mb-4 md:mb-6 bg-blue-50 border-blue-200 border">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-600">
                  <AcademicCapIcon className="h-4 w-4" />
                  JEE Main Insights
                </h4>
                <p className="mt-1 text-xs text-gray-700">
                  Rank ≤ {(rank * 0.8).toLocaleString()} might qualify for JEE Advanced
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Based on previous year trends (approx.)
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  Copy Results
                </button>
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="rounded-xl shadow-lg p-4 md:p-6 bg-white">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg font-bold flex items-center text-blue-600">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Previous Calculations
                </h3>
                <button 
                  onClick={clearAllHistory}
                  className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <div 
                    key={`${item.timestamp}-${index}`} 
                    onClick={() => loadCalculation(item)}
                    className="p-3 rounded-lg cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100 border-gray-200 border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-blue-600">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            Rank: {item.rank.toLocaleString()}
                          </span>
                          <span className="text-xs text-blue-500">
                            {item.percentile.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-1 text-xs">
                          <span className="text-gray-600">
                            {item.inputType === "score" ? `Score: ${item.marks?.toFixed(0) || 0}/300` : `Percentile Input`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(index);
                        }}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </PageWrapper>
    </>
  );
};

export default RankCalculator;