import React, { useState, useMemo } from 'react';
import './Roadmap.css'; // Import the CSS file

// --- NEW STRUCTURE: Store tasks in a map for easy lookup ---
// This map stores the data for easy lookup by column and revenue.
const taskMap = {
  Plan: {
    '£500K': [
      { task: '1 Year Forecast' },
      { task: 'Asana Task Management' },
      { task: 'Xero/Quickbooks Setup - Templates & Projects' },
    ],
    '£1M': [
      { task: 'Software Tracking' },
      { task: '5 Year BHAG (Big Hairy Audacious Goal)' },
      { task: 'KPIs' },
      { task: 'Individual Job Profitability' },
    ],
    '£2M': [
      { task: 'Monthly P&Ls' },
      { task: 'Lead Source Reports' },
      { task: 'Monthly Income Forecast' },
    ],
    '£3M': [
      { task: 'Cashflow Forecast' },
      { task: 'Pipeline' },
    ],
    '£5M': [] // Empty for padding alignment
  },
  Attract: {
    '£500K': [
      { task: 'USP (Unique Selling Proposition)' },
      { task: 'Brand Guidelines' },
      { task: 'Staff Uniform' },
      { task: 'Vans Signwritten' },
      { task: 'Signboards / Banners' },
    ],
    '£1M': [
      { task: 'Website on Brand' },
      { task: 'Social Media Profiles Active' },
      { task: 'Reviews online' },
    ],
    '£2M': [
      { task: 'Automated Social Posts' },
      { task: 'Outbound Marketing' },
      { task: 'LinkedIn Connection & Campaigns' },
    ],
    '£3M': [
      { task: 'Page 1 Google key search terms' },
      { task: 'Blogs/Vlogs' },
      { task: 'Paid Ads' },
    ],
    '£5M': []
  },
  Convert: {
    '£500K': [
      { task: 'Call Handlers' },
      { task: 'Telephone Sales Script' },
      { task: 'Accurate Pricing' },
      { task: 'Quality Estimate Presentation' },
    ],
    '£1M': [
      { task: 'Tracked Follow Up Process' },
      { task: 'Professional Photos' },
      { task: 'Case Studies' },
    ],
    '£2M': [
      { task: 'Client Needs USP Generic Replies' },
      { task: 'Know, Like, Trust' },
      { task: 'Awards' },
    ],
    '£3M': [
      { task: 'Quote to Convert Campaign' },
      { task: 'Long Term Nurture' },
    ],
    '£5M': []
  },
  Deliver: {
    '£500K': [
      { task: '10min Daily Huddle' },
      { task: 'Gantt Charts' },
      { task: 'Client Meeting Minutes' },
    ],
    '£1M': [
      { task: 'Pre-Site Set Up' },
      { task: 'Site Set Up' },
      { task: 'Health & Safety' },
      { task: 'Track Workers' },
      { task: 'Variation Orders' },
    ],
    '£2M': [
      { task: 'Contractor/Project Manager' },
      { task: 'Weekly PM Review' },
    ],
    '£3M': [
      { task: 'Project Sign Off Snagging/Quality Control' },
      { task: 'Documentation Control' },
    ],
    '£5M': []
  },
  Scale: {
    '£500K': [
      { task: 'Organisation Chart' },
      { task: 'Supplier Terms Negotiated' },
      { task: 'Project Contracts' },
      { task: 'VOIP Phone System' },
    ],
    '£1M': [
      { task: 'Holiday/Sickness Management' },
      { task: 'Client Satisfaction Surveys' },
      { task: 'Solids/Prepayment cards' },
    ],
    '£2M': [
      { task: 'Company Bible / Training Videos' },
      { task: 'Partnerships' },
      { task: 'Job Roles Defined' },
    ],
    '£3M': [
      { task: 'HR Contracts' },
      { task: 'Job Adverts' },
      { task: 'Pension, Benefits & Rewards' },
      { task: 'Training Matrix' },
    ],
    '£5M': [
      { task: 'Reports Dashboard' },
    ]
  }
};

const columns = Object.keys(taskMap);
const revenueRows = ['£500K', '£1M', '£2M', '£3M', '£5M'];

// Find the maximum number of tasks in any column for a given revenue slab.
// This is critical for generating the correct number of task placeholders.
const getMaxTasksInSlab = (slab) => {
    let max = 0;
    columns.forEach(col => {
        const tasks = taskMap[col][slab];
        if (tasks && tasks.length > max) {
            max = tasks.length;
        }
    });
    return max;
};

// --- DATA RECONSTRUCTION FOR PROGRESS CALCULATION ---
// We need a flat list for calculating progress correctly.
const roadmapDataFlat = columns.reduce((acc, stage) => {
    revenueRows.forEach(slab => {
        if (taskMap[stage][slab]) {
            taskMap[stage][slab].forEach(item => acc.push(item));
        }
    });
    return acc;
}, []);


const Roadmap = () => {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('roadmapChecks');
    return saved ? JSON.parse(saved) : {};
  });

  const handleCheck = (item) => {
    const newCheckedItems = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('roadmapChecks', JSON.stringify(newCheckedItems));
  };

  // Function to calculate progress (Updated to use the flat data)
  const calculateColumnProgress = (stage) => {
    const stageTasks = roadmapDataFlat.filter(item => 
        Object.keys(taskMap[stage]).some(slab => 
            taskMap[stage][slab].some(taskItem => taskItem.task === item.task)
        )
    );
    const total = stageTasks.length;
    if (total === 0) return { checked: 0, total: 0, percentage: 0 };
    
    const checked = stageTasks.filter(item => checkedItems[item.task]).length;
    const percentage = Math.round((checked / total) * 100);
    
    return { checked, total, percentage };
  };

  // Memoized value for overall progress (Uses the flat data)
  const overallProgress = useMemo(() => {
    let totalItems = roadmapDataFlat.length;
    let checkedItemsCount = roadmapDataFlat.filter(item => checkedItems[item.task]).length;

    const percentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);
    
    return { checked: checkedItemsCount, total: totalItems, percentage };
  }, [checkedItems]);


  return (
    <div className="roadmap-container">
      {/* Header (unchanged) */}
      <div className="roadmap-header">
        <div className="logo-section">
          <span className="logo-text">DEVELOP</span>
        </div>
        <h1 className="title">The Develop Mastermind® Roadmap</h1>
        <div className="overall-progress">
          <span className="progress-text">Overall Progress: {overallProgress.checked}/{overallProgress.total} ({overallProgress.percentage}%)</span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${overallProgress.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content: Columns and Scale */}
      <div className="roadmap-content">
        {/* Roadmap Columns */}
        <div className="roadmap-columns">
          {columns.map((stage) => {
            const { checked, total, percentage } = calculateColumnProgress(stage);

            return (
              <div key={stage} className={`stage-column stage-${stage.toLowerCase()}`}>
                
                {/* Column Header with Progress (unchanged) */}
                <div className="column-header-progress">
                  <h2>{stage}</h2>
                  <div className="progress-info">
                    <span className="progress-number">{checked}/{total} ({percentage}%)</span>
                    <div className="progress-bar-small">
                      <div 
                        className="progress-bar-fill-small" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Task List - RENDER ALIGNED SLABS */}
                <ul className="aligned-task-list">
                    {revenueRows.map((slab, slabIndex) => {
                        const slabTasks = taskMap[stage][slab] || [];
                        const maxTasks = getMaxTasksInSlab(slab);
                        const numTasks = slabTasks.length;

                        // Calculate number of placeholders needed for this column/slab combination
                        const numPlaceholders = maxTasks - numTasks;
                        
                        return (
                            <React.Fragment key={slab}>
                                {/* RENDER DIVIDER BEFORE NEW SLAB (except the first one) */}
                                {slabIndex > 0 && (
                                    <li className="revenue-divider-container-aligned">
                                        <hr className="revenue-divider-aligned" />
                                    </li>
                                )}

                                {/* Render Actual Tasks */}
                                {slabTasks.map((item) => (
                                    <li key={item.task} className="task-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!checkedItems[item.task]}
                                                onChange={() => handleCheck(item.task)}
                                            />
                                            <span className="task-text">{item.task}</span>
                                        </label>
                                    </li>
                                ))}

                                {/* Render Placeholders to maintain vertical alignment */}
                                {Array.from({ length: numPlaceholders }).map((_, i) => (
                                    <li key={`placeholder-${slab}-${i}`} className="task-placeholder">
                                        {/* This is an empty list item used for spacing */}
                                    </li>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Vertical Scale (Remaining the same) */}
        <div className="roadmap-scale">
       
     <br /><br /><br /><br /><br />
          <div className="scale-label">£500K</div>
          <br /><br />
          <div className="scale-label">£1M</div>
          <br /><br /><br /><br />
          <div className="scale-label">£2M</div>
          <div className="scale-label">£3M</div>
          <div className="scale-label">£5M</div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;