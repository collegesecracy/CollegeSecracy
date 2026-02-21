import { useState, useEffect } from "react";
import { ClipboardIcon, CalculatorIcon, ChartBarIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SEO from "@/components/SEO.jsx";
import { marksToPercentile } from "@/utils/CollegeData.js";

const jeeHeroImage = "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80";
const successImage = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// Local storage helper functions
const saveCalculation = (key, calculation) => {
  const history = JSON.parse(localStorage.getItem(key)) || [];
  const updatedHistory = [calculation, ...history.slice(0, 4)];
  localStorage.setItem(key, JSON.stringify(updatedHistory));
};

const getCalculations = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

const clearAllHistory = (key) => {
  localStorage.removeItem(key);
};

const deleteHistoryItem = (key, index) => {
  const history = getCalculations(key);
  history.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(history));
};


const PercentileCalculator = () => {
  const [marks, setMarks] = useState("");
  const [percentile, setPercentile] = useState(null);
  const [rank, setRank] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalCandidates = 1475103;

  useEffect(() => {
    setHistory(getCalculations('jee-percentile'));
  }, []);

  const calculateExactPercentile = (marks) => {
    const entry = marksToPercentile.find(
      e => marks >= e.minMarks && marks <= e.maxMarks
    );
    
    if (!entry) return 0;
    
    if (entry.minMarks === entry.maxMarks) {
      return entry.minPercentile;
    }
    
    const rangeRatio = (marks - entry.minMarks) / (entry.maxMarks - entry.minMarks);
    const percentile = entry.minPercentile + rangeRatio * (entry.maxPercentile - entry.minPercentile);
    
    return Math.min(100, Math.max(0, percentile));
  };

  const calculateRank = (percentile) => {
    const rank = Math.round(((100 - percentile) * totalCandidates) / 100);
    return Math.max(1, rank);
  };

  const calculateJeePercentile = () => {
    setLoading(true);
    try {
      const marksValue = parseFloat(marks);
      if (isNaN(marksValue) || marksValue < 0 || marksValue > 300) {
        alert("Please enter valid marks between 0 and 300");
        return;
      }

      const calculatedPercentile = calculateExactPercentile(marksValue);
      const calculatedRank = calculateRank(calculatedPercentile);

      setPercentile(calculatedPercentile);
      setRank(calculatedRank);

      const calculation = {
        marks: marksValue,
        percentile: calculatedPercentile,
        rank: calculatedRank,
        timestamp: new Date().toISOString()
      };

      saveCalculation('jee-percentile', calculation);
      setHistory(getCalculations('jee-percentile'));
    } catch (error) {
      console.error("Calculation error:", error);
      alert("An error occurred during calculation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    const text = `JEE Main Percentile Prediction\n` +
      `Marks: ${marks}/300\n` +
      `Predicted Percentile: ${percentile.toFixed(2)}%\n` +
      `Estimated Rank: ${rank.toLocaleString()}\n` +
      `Top ${percentile.toFixed(2)}% of candidates`;
    
    navigator.clipboard.writeText(text);
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm';
    notification.textContent = 'Results copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  const resetCalculator = () => {
    setMarks("");
    setPercentile(null);
    setRank(null);
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      clearAllHistory('jee-percentile');
      setHistory([]);
    }
  };

  const handleDeleteHistoryItem = (index) => {
    if (window.confirm("Are you sure you want to delete this calculation?")) {
      deleteHistoryItem('jee-percentile', index);
      setHistory(getCalculations('jee-percentile'));
    }
  };

  return (
    <>
      <SEO
        title="JEE Main Percentile Calculator | CollegeSecretary"
        description="Calculate your JEE Main percentile and rank based on your marks. Get accurate predictions instantly."
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <h1 className="text-lg font-bold">JEE Percentile Calculator</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="rounded-xl p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  JEE Main Percentile Predictor
                </h1>
                <p className="text-sm md:text-base text-blue-100">
                  Get accurate percentile and rank predictions based on your marks
                </p>
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

          {/* Calculator Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 md:mb-6 flex items-center text-blue-600">
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Enter Your Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Enter Your JEE Main Marks (0-300)
                </label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  min="0"
                  max="300"
                  placeholder="e.g. 185"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={calculateJeePercentile}
                  disabled={loading || !marks}
                  className={`bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center ${loading ? 'opacity-75' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <CalculatorIcon className="w-5 h-5 mr-2" />
                      Calculate Percentile
                    </>
                  )}
                </button>

                {percentile !== null && (
                  <button
                    onClick={resetCalculator}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {percentile !== null && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-200"
            >
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
                    Based on your marks
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 md:p-5 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg md:text-xl font-bold text-blue-700 mb-2 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Your Percentile
                  </h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl md:text-4xl font-bold text-blue-800">
                      {percentile.toFixed(2)}%
                    </span>
                    <span className="text-gray-500 text-sm">
                      Top {percentile.toFixed(2)}% candidates
                    </span>
                  </div>
                </div>
                
                <div className="p-4 md:p-5 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="text-lg md:text-xl font-bold text-orange-700 mb-2 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Estimated Rank
                  </h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl md:text-4xl font-bold text-orange-800">
                      {rank.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Out of ~1.5M candidates
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <h4 className="text-gray-700 mb-2 font-medium">JEE Main Insights</h4>
                <p className="text-gray-600 text-sm">
                  Based on previous year trends, a rank ≤ {(rank * 0.8).toLocaleString()} might qualify for JEE Advanced.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={copyResult}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <ClipboardIcon className="w-5 h-5 mr-2" />
                  Copy Results
                </button>
              </div>
            </motion.div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Previous Calculations
                </h3>
                <button
                  onClick={handleClearAllHistory}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-3 md:p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 relative group"
                  >
                    <div className="flex justify-between items-center">
                      <div 
                        className="flex-grow"
                        onClick={() => {
                          setMarks(item.marks);
                          setPercentile(item.percentile);
                          setRank(item.rank);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className="font-medium text-gray-800">
                          {item.percentile.toFixed(2)}% ({item.marks} marks)
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Rank: {item.rank.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 whitespace-nowrap mr-3">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHistoryItem(index);
                          }}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete this calculation"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PercentileCalculator;