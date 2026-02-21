import { useState, useEffect, useRef } from 'react';
import { saveCalculation, getCalculations } from '../../utils/tools.js';
import { 
  CalculatorIcon, 
  ClipboardIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO.jsx';

const MarkingSchemeTool = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [examType, setExamType] = useState('JEE');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState('');
  const [unattempted, setUnattempted] = useState('');
  const [totalMarks, setTotalMarks] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [showTutorial, setShowTutorial] = useState(false);

  const examConfigs = {
    JEE: {
      correctMark: 4,
      incorrectMark: -1,
      description: 'JEE Main Marking Scheme',
      maxQuestions: 90,
      color: 'blue',
      bgFrom: 'from-blue-600',
      bgTo: 'to-blue-400',
      name: 'JEE Main',
      icon: <AcademicCapIcon className="w-5 h-5" />,
    },
    NEET: {
      correctMark: 4,
      incorrectMark: -1,
      description: 'NEET Marking Scheme',
      maxQuestions: 200,
      color: 'green',
      bgFrom: 'from-green-600',
      bgTo: 'to-green-400',
      name: 'NEET',
      icon: <AcademicCapIcon className="w-5 h-5" />,
    },
    OTHER: {
      correctMark: 1,
      incorrectMark: -0.25,
      description: 'General Marking Scheme',
      maxQuestions: 100,
      color: 'purple',
      bgFrom: 'from-purple-600',
      bgTo: 'to-purple-400',
      name: 'Other Exams',
      icon: <AcademicCapIcon className="w-5 h-5" />,
    },
  };

  useEffect(() => {
    const savedHistory = getCalculations('marking-scheme');
    setHistory(savedHistory ? savedHistory.slice(0, 5) : []);
    
    // Check if first time user
    if (!localStorage.getItem('markingToolViewed')) {
      setShowTutorial(true);
      localStorage.setItem('markingToolViewed', 'true');
    }
  }, []);

  const calculateMarks = () => {
    const config = examConfigs[examType];
    const correct = parseInt(correctAnswers) || 0;
    const incorrect = parseInt(incorrectAnswers) || 0;
    const unattemptedCount = parseInt(unattempted) || 0;

    if (correct < 0 || incorrect < 0 || unattemptedCount < 0) {
      alert('Please enter positive numbers');
      return;
    }

    const totalAnswered = correct + incorrect;
    if (totalAnswered + unattemptedCount > config.maxQuestions) {
      alert(`Total questions cannot exceed ${config.maxQuestions} for ${examType}`);
      return;
    }

    const marks = correct * config.correctMark + incorrect * config.incorrectMark;
    setTotalMarks(marks);

    const calculation = {
      examType,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unattempted: unattemptedCount,
      totalMarks: marks,
      timestamp: new Date().toISOString(),
    };

    const currentHistory = getCalculations('marking-scheme');
    saveCalculation('marking-scheme', calculation);
    setHistory([calculation, ...currentHistory.slice(0, 4)]);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const copyResults = () => {
    const config = examConfigs[examType];
    const text = `${config.description}\nCorrect: ${correctAnswers}\nIncorrect: ${incorrectAnswers}\nUnattempted: ${unattempted}\nTotal Marks: ${totalMarks}`;
    navigator.clipboard.writeText(text);
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.textContent = 'Results copied to clipboard!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const deleteHistoryItem = (index) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      localStorage.setItem('marking-scheme-history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const resetCalculator = () => {
    setCorrectAnswers('');
    setIncorrectAnswers('');
    setUnattempted('');
    setTotalMarks(null);
    formRef.current?.reset();
  };

  const currentConfig = examConfigs[examType];

  // Calculate accuracy percentage
  const accuracy = correctAnswers && incorrectAnswers 
    ? Math.round((parseInt(correctAnswers) / (parseInt(correctAnswers) + parseInt(incorrectAnswers))) * 100)
    : 0;

  return (
    <>
    <SEO
  title="JEE/NEET Marking Scheme Guide"
  description="Understand the complete marking scheme for JEE and NEET. Negative marking, subject-wise breakdown, and scoring insights included."
/>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} shadow-md`}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-black/10 transition text-white"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Marking Scheme Analyzer</h1>
              <p className="text-sm text-white/90">Powered by CollegeSecracy</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTutorial(true)}
            className="p-2 rounded-full hover:bg-black/10 transition text-white"
          >
            <InformationCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${activeTab === 'calculator' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('calculator')}
          >
            <CalculatorIcon className="w-5 h-5" />
            Calculator
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            <ClockIcon className="w-5 h-5" />
            History
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${activeTab === 'schemes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('schemes')}
          >
            <ChartBarIcon className="w-5 h-5" />
            Marking Schemes
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {currentConfig.icon}
                    {currentConfig.description}
                  </h2>
                  <p className="text-sm opacity-90 mt-1">Enter your response details below</p>
                </div>
                <div className="p-6">
                  <form ref={formRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                        <select
                          value={examType}
                          onChange={(e) => {
                            setExamType(e.target.value);
                            resetCalculator();
                          }}
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Object.entries(examConfigs).map(([key, config]) => (
                            <option key={key} value={key} className="flex items-center gap-2">
                              {config.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answers</label>
                        <input
                          type="number"
                          value={correctAnswers}
                          onChange={(e) => setCorrectAnswers(e.target.value)}
                          min="0"
                          max={currentConfig.maxQuestions}
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Incorrect Answers</label>
                        <input
                          type="number"
                          value={incorrectAnswers}
                          onChange={(e) => setIncorrectAnswers(e.target.value)}
                          min="0"
                          max={currentConfig.maxQuestions}
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unattempted Questions</label>
                        <input
                          type="number"
                          value={unattempted}
                          onChange={(e) => setUnattempted(e.target.value)}
                          min="0"
                          max={currentConfig.maxQuestions}
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={calculateMarks}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition flex items-center gap-2"
                      >
                        <CalculatorIcon className="w-5 h-5" /> Calculate Score
                      </button>
                      <button
                        type="button"
                        onClick={resetCalculator}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Results Sidebar */}
            <div>
              <div id="results-section" className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
                <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
                  <h2 className="text-xl font-bold">Results</h2>
                </div>
                {totalMarks !== null ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Marks:</span>
                        <span className="text-2xl font-bold text-gray-900">{totalMarks}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-blue-600 font-medium">Correct</p>
                          <p className="text-lg font-bold text-gray-900">{correctAnswers}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-red-600 font-medium">Incorrect</p>
                          <p className="text-lg font-bold text-gray-900">{incorrectAnswers}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-600 font-medium">Unattempted</p>
                          <p className="text-lg font-bold text-gray-900">{unattempted}</p>
                        </div>
                      </div>

                      {accuracy > 0 && (
                        <div className="pt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Accuracy</span>
                            <span className="text-sm font-medium text-gray-700">{accuracy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-500 h-2.5 rounded-full" 
                              style={{ width: `${accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          onClick={copyResults}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <ClipboardIcon className="w-5 h-5" /> Copy Results
                        </button>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mt-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              These results are estimates only. Always refer to official sources for final marks.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <CalculatorIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Enter your details and click "Calculate Score"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Calculation History
              </h2>
            </div>
            <div className="p-6">
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item, index) => {
                    const itemConfig = examConfigs[item.examType];
                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition group"
                        onClick={() => {
                          setExamType(item.examType);
                          setCorrectAnswers(item.correctAnswers);
                          setIncorrectAnswers(item.incorrectAnswers);
                          setUnattempted(item.unattempted || '');
                          setTotalMarks(item.totalMarks);
                          setActiveTab('calculator');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${itemConfig.color ? `text-${itemConfig.color}-600` : 'text-gray-600'}`}>
                                {itemConfig.name}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                              <span className="text-green-600">✓ {item.correctAnswers}</span>
                              <span className="text-red-600">✗ {item.incorrectAnswers}</span>
                              <span className="text-gray-600">⎯ {item.unattempted || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">{item.totalMarks} marks</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHistoryItem(index);
                              }}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No history yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your calculations will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Marking Schemes Tab */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                Exam Marking Schemes
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correct Answer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Incorrect Answer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Questions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(examConfigs).map(([key, config]) => (
                      <tr 
                        key={key} 
                        className={`hover:bg-gray-50 cursor-pointer ${examType === key ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setExamType(key);
                          setActiveTab('calculator');
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-5 w-5 text-${config.color}-500`}>
                              {config.icon}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{config.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">+{config.correctMark} marks</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600 font-medium">{config.incorrectMark} marks</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{config.maxQuestions}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${currentConfig.bgFrom} ${currentConfig.bgTo} p-6 text-white`}>
              <h2 className="text-xl font-bold">How to use this calculator</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enter Your Responses</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Fill in the number of correct, incorrect, and unattempted questions based on your exam attempt.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full">
                  <CalculatorIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Calculate Your Score</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Click "Calculate Score" to see your estimated marks based on the selected exam's marking scheme.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Marking Schemes</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Check the "Marking Schemes" tab to see different exam patterns and scoring systems.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-yellow-100 p-1 rounded-full">
                  <InformationCircleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Important Note</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    These results are estimates only. Always refer to official sources for final marks and rankings.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowTutorial(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} CollegeSecracy. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left">
            <p className="text-xs text-gray-400">
              Disclaimer: This tool provides estimates only. We are not affiliated with any official examination bodies.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default MarkingSchemeTool;