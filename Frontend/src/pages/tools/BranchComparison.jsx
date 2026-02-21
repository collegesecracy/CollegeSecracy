import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiInfo, 
  FiBarChart2, 
  FiDollarSign, 
  FiBriefcase, 
  FiAward,
  FiCheck,
  FiX,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiShare2,
  FiArrowLeft
} from 'react-icons/fi';

import { branches, coreBranches } from "../../utils/EngineeringBranchesData.js";
import SEO from '@/components/SEO.jsx';

const BranchComparison = () => {
  const [selectedBranches, setSelectedBranches] = useState(['CSE', 'ECE']);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedRows, setExpandedRows] = useState({});
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const navigate = useNavigate();

  const allBranches = { ...branches, ...coreBranches };

  const toggleBranch = (branch) => {
    if (selectedBranches.includes(branch)) {
      if (selectedBranches.length > 1) {
        setSelectedBranches(selectedBranches.filter(b => b !== branch));
      }
    } else {
      if (selectedBranches.length < 3) {
        setSelectedBranches([...selectedBranches, branch]);
      }
    }
  };

  const toggleRowExpansion = (rowKey) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }));
  };

  const getDemandColor = (demand) => {
    switch(demand) {
      case 'Very High': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
      case 'High': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Moderate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <>
      <SEO
        title="Branch Comparison Tool | CollegeSecracy"
        description="Compare engineering branches based on placement, demand, and future scope. Make smart decisions for your career path."
      />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-5 sm:p-6">
          /<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FiArrowLeft className="mr-2" /> Back
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <FiBarChart2 className="mr-2 text-blue-600 dark:text-blue-400" />
                Engineering Branch Comparison
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Compare key metrics across different engineering disciplines
              </p>
            </div>
          </div>
          
          {/* Branch Selector - Mobile */}
          <div className="sm:hidden mb-4">
            <button 
              onClick={() => setShowBranchSelector(!showBranchSelector)}
              className="w-full flex justify-between items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <span>Selected Branches: {selectedBranches.join(', ')}</span>
              {showBranchSelector ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {showBranchSelector && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branches (2-3)</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(allBranches).map(branch => (
                    <button
                      key={branch}
                      onClick={() => toggleBranch(branch)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBranches.includes(branch)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Branch Selector - Desktop */}
          <div className="hidden sm:block mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branches to Compare (2-3)</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(allBranches).map(branch => (
                <button
                  key={branch}
                  onClick={() => toggleBranch(branch)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedBranches.includes(branch)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
          
          {selectedBranches.length > 0 && (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiInfo className="mr-2" /> Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('career')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'career'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiBriefcase className="mr-2" /> Career Prospects
                  </button>
                  <button
                    onClick={() => setActiveTab('colleges')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'colleges'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiAward className="mr-2" /> Top Colleges
                  </button>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'companies'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiBriefcase className="mr-2" /> Recruiting Companies
                  </button>
                </nav>
              </div>
              
              {/* Comparison Table */}
              <div className="overflow-hidden">
                <div className="min-w-full">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                            {allBranches[branch].name}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Overview</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            {allBranches[branch].overview}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Key Subjects</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            <ul className="space-y-1">
                              {allBranches[branch].subjects.slice(0, expandedRows['subjects'] ? allBranches[branch].subjects.length : 3).map(subject => (
                                <li key={subject} className="flex items-start">
                                  <span className="text-blue-500 mr-1.5">•</span> {subject}
                                </li>
                              ))}
                            </ul>
                            {allBranches[branch].subjects.length > 3 && (
                              <button 
                                onClick={() => toggleRowExpansion('subjects')}
                                className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                {expandedRows['subjects'] ? 'Show less' : `Show ${allBranches[branch].subjects.length - 3} more`}
                                {expandedRows['subjects'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Career Tab */}
                  {activeTab === 'career' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Career Metric</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                            {branch}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                          <FiDollarSign className="mr-1.5" /> Avg. Starting Salary
                        </div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            {allBranches[branch].salary}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Job Demand</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor(allBranches[branch].demand)}`}>
                              {allBranches[branch].demand}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Growth Potential</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            {allBranches[branch].growth}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Pros</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            <ul className="space-y-1.5">
                              {allBranches[branch].pros.slice(0, expandedRows['pros'] ? allBranches[branch].pros.length : 3).map(pro => (
                                <li key={pro} className="flex items-start">
                                  <span className="text-green-500 mr-1.5"><FiCheck /></span> {pro}
                                </li>
                              ))}
                            </ul>
                            {allBranches[branch].pros.length > 3 && (
                              <button 
                                onClick={() => toggleRowExpansion('pros')}
                                className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                {expandedRows['pros'] ? 'Show less' : `Show ${allBranches[branch].pros.length - 3} more`}
                                {expandedRows['pros'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3">
                        <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">Cons</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                            <ul className="space-y-1.5">
                              {allBranches[branch].cons.slice(0, expandedRows['cons'] ? allBranches[branch].cons.length : 3).map(con => (
                                <li key={con} className="flex items-start">
                                  <span className="text-red-500 mr-1.5"><FiX /></span> {con}
                                </li>
                              ))}
                            </ul>
                            {allBranches[branch].cons.length > 3 && (
                              <button 
                                onClick={() => toggleRowExpansion('cons')}
                                className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                {expandedRows['cons'] ? 'Show less' : `Show ${allBranches[branch].cons.length - 3} more`}
                                {expandedRows['cons'] ? <FiChevronUp className="ml-0.5" size={12} /> : <FiChevronDown className="ml-0.5" size={12} />}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Colleges Tab */}
                  {activeTab === 'colleges' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">College Ranking</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                            {branch}
                          </div>
                        ))}
                      </div>
                      
                      {[0, 1, 2, 3, 4, 5].map(index => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">
                            #{index + 1}
                          </div>
                          {selectedBranches.map(branch => (
                            <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                              {allBranches[branch].colleges[index] || '-'}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Companies Tab */}
                  {activeTab === 'companies' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="md:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Top Recruiters</div>
                        {selectedBranches.map(branch => (
                          <div key={branch} className="md:col-span-3 text-sm font-medium text-gray-900 dark:text-white">
                            {branch}
                          </div>
                        ))}
                      </div>
                      
                      {[0, 1, 2, 3, 4, 5].map(index => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">
                            #{index + 1}
                          </div>
                          {selectedBranches.map(branch => (
                            <div key={branch} className="md:col-span-3 text-sm text-gray-600 dark:text-gray-400">
                              {allBranches[branch].companies[index] || '-'}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Generate Detailed Report
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BranchComparison;