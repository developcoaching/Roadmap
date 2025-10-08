import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; 
import './AuthApp.css'

// --- MOCK CONFIGURATION ---
const MOCK_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCz1NAJzZxtG65sRUN2NfgIOH3rWL-yZKQ", 
    authDomain: "roadmap-webpage-6b7e4.firebaseapp.com",
    projectId: "roadmap-webpage-6b7e4",
    storageBucket: "roadmap-webpage-6b7e4.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:mockwebid"
};

// --- GLOBAL VARIABLES (Provided by Environment or Mock) ---
const FIREBASE_CONFIG = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : MOCK_FIREBASE_CONFIG;
const appId = 'default-app-id'; 

// Initialize Firebase App and Services
const app = initializeApp(FIREBASE_CONFIG);
// Removed: const auth = getAuth(app); 
const db = getFirestore(app); 

// ----------------------------------------------------------------------
// PRE-PROCESSED DATA (Roadmap Content) - UNCHANGED
// ----------------------------------------------------------------------
const ROADMAP_CONTENT = {
    Plan: [
        { text: '1 Year Forecast', link: 'https://developcoaching.memberships.msgsndr.com/1-year-forecast-video' },
        { text: 'Asana Task Management', link: 'https://developcoaching.memberships.msgsndr.com/asana-task-management-video' },
        { text: 'Xero/Quickbooks Setup - Templates & Projects', link: 'https://developcoaching.memberships.msgsndr.com/xero-quickbooks-setup-video' },
        { text: 'Software Tracking', link: 'https://developcoaching.memberships.msgsndr.com/software-tracking-video' },
        { text: '5 Year BHAG (Big Hairy Audacious Goal)', link: 'https://developcoaching.memberships.msgsndr.com/bhag-video' },
        { text: 'KPIs', link: 'https://developcoaching.memberships.msgsndr.com/kpis-video' },
        { text: 'Individual Job Profitability', link: 'https://developcoaching.memberships.msgsndr.com/job-profitability-video' },
        { text: 'Monthly P&Ls', link: 'https://developcoaching.memberships.msgsndr.com/monthly-p&ls-video' },
        { text: 'Lead Source Reports', link: 'https://developcoaching.memberships.msgsndr.com/lead-source-reports-video' },
        { text: 'Monthly Income Forecast', link: 'https://developcoaching.memberships.msgsndr.com/monthly-income-forecast-video' },
        { text: 'Cashflow Forecast', link: 'https://developcoaching.memberships.msgsndr.com/cashflow-forecast-video' },
        { text: 'Pipeline', link: 'https://developcoaching.memberships.msgsndr.com/pipeline-video' }
    ],
    Attract: [
        { text: 'USP (Unique Selling Proposition)', link: 'https://developcoaching.memberships.msgsndr.com/usp-video' },
        { text: 'Brand Guidelines', link: 'https://developcoaching.memberships.msgsndr.com/brand-guidelines-video' },
        { text: 'Staff Uniform', link: 'https://developcoaching.memberships.msgsndr.com/staff-uniform-video' },
        { text: 'Vans Signwritten', link: 'https://developcoaching.memberships.msgsndr.com/vans-signwritten-video' },
        { text: 'Signboards / Banners', link: 'https://developcoaching.memberships.msgsndr.com/signboards-banners-video' },
        { text: 'Website on Brand', link: 'https://developcoaching.memberships.msgsndr.com/website-on-brand-video' },
        { text: 'Social Media Profiles Active', link: 'https://developcoaching.memberships.msgsndr.com/social-media-active-video' },
        { text: 'Reviews online', link: 'https://developcoaching.memberships.msgsndr.com/reviews-online-video' },
        { text: 'Automated Social Posts', link: 'https://developcoaching.memberships.msgsndr.com/automated-social-posts-video' },
        { text: 'Outbound Marketing', link: 'https://developcoaching.memberships.msgsndr.com/outbound-marketing-video' },
        { text: 'LinkedIn Connection & Campaigns', link: 'https://developcoaching.memberships.msgsndr.com/linkedin-campaigns-video' },
        { text: 'Page 1 Google key search terms', link: 'https://developcoaching.memberships.msgsndr.com/google-search-terms-video' },
        { text: 'Blogs/Vlogs', link: 'https://developcoaching.memberships.msgsndr.com/blogs-vlogs-video' },
        { text: 'Paid Ads', link: 'https://developcoaching.memberships.msgsndr.com/paid-ads-video' }
    ],
    Convert: [
        { text: 'Call Handlers', link: 'https://developcoaching.memberships.msgsndr.com/call-handlers-video' },
        { text: 'Telephone Sales Script', link: 'https://developcoaching.memberships.msgsndr.com/sales-script-video' },
        { text: 'Accurate Pricing', link: 'https://developcoaching.memberships.msgsndr.com/accurate-pricing-video' },
        { text: 'Quality Estimate Presentation', link: 'https://developcoaching.memberships.msgsndr.com/estimate-presentation-video' },
        { text: 'Tracked Follow Up Process', link: 'https://developcoaching.memberships.msgsndr.com/follow-up-process-video' },
        { text: 'Professional Photos', link: 'https://developcoaching.memberships.msgsndr.com/professional-photos-video' },
        { text: 'Case Studies', link: 'https://developcoaching.memberships.msgsndr.com/case-studies-video' },
        { text: 'Client Needs USP Generic Replies', link: 'https://developcoaching.memberships.msgsndr.com/generic-replies-video' },
        { text: 'Know, Like, Trust', link: 'https://developcoaching.memberships.msgsndr.com/know-like-trust-video' },
        { text: 'Awards', link: 'https://developcoaching.memberships.msgsndr.com/awards-video' },
        { text: 'Quote to Convert Campaign', link: 'https://developcoaching.memberships.msgsndr.com/quote-convert-campaign-video' },
        { text: 'Long Term Nurture', link: 'https://developcoaching.memberships.msgsndr.com/long-term-nurture-video' }
    ],
    Deliver: [
        { text: '10min Daily Huddle', link: 'https://developcoaching.memberships.msgsndr.com/daily-huddle-video' },
        { text: 'Gantt Charts', link: 'https://developcoaching.memberships.msgsndr.com/gantt-charts-video' },
        { text: 'Client Meeting Minutes', link: 'https://developcoaching.memberships.msgsndr.com/client-meeting-minutes-video' },
        { text: 'Pre-Site Set Up', link: 'https://developcoaching.memberships.msgsndr.com/pre-site-setup-video' },
        { text: 'Site Set Up', link: 'https://developcoaching.memberships.msgsndr.com/site-setup-video' },
        { text: 'Health & Safety', link: 'https://developcoaching.memberships.msgsndr.com/health-safety-video' },
        { text: 'Track Workers', link: 'https://developcoaching.memberships.msgsndr.com/track-workers-video' },
        { text: 'Variation Orders', link: 'https://developcoaching.memberships.msgsndr.com/variation-orders-video' },
        { text: 'Contractor/Project Manager', link: 'https://developcoaching.memberships.msgsndr.com/contractor-pm-video' },
        { text: 'Weekly PM Review', link: 'https://developcoaching.memberships.msgsndr.com/weekly-pm-review-video' },
        { text: 'Project Sign Off Snagging/Quality Control', link: 'https://developcoaching.memberships.msgsndr.com/sign-off-qc-video' },
        { text: 'Documentation Control', link: 'https://developcoaching.memberships.msgsndr.com/documentation-control-video' }
    ],
    Scale: [
        { text: 'Organisation Chart', link: 'https://developcoaching.memberships.msgsndr.com/organisation-chart-video' },
        { text: 'Supplier Terms Negotiated', link: 'https://developcoaching.memberships.msgsndr.com/supplier-terms-video' },
        { text: 'Project Contracts', link: 'https://developcoaching.memberships.msgsndr.com/project-contracts-video' },
        { text: 'VOIP Phone System', link: 'https://developcoaching.memberships.msgsndr.com/voip-system-video' },
        { text: 'Holiday/Sickness Management', link: 'https://developcoaching.memberships.msgsndr.com/holiday-sickness-management-video' },
        { text: 'Client Satisfaction Surveys', link: 'https://developcoaching.memberships.msgsndr.com/client-surveys-video' },
        { text: 'Solids/Prepayment cards', link: 'https://developcoaching.memberships.msgsndr.com/solids-prepayment-cards-video' },
        { text: 'Company Bible / Training Videos', link: 'https://developcoaching.memberships.msgsndr.com/company-bible-training-videos-video' },
        { text: 'Partnerships', link: 'https://developcoaching.memberships.msgsndr.com/partnerships-video' },
        { text: 'Job Roles Defined', link: 'https://developcoaching.memberships.msgsndr.com/job-roles-defined-video' },
        { text: 'HR Contracts', link: 'https://developcoaching.memberships.msgsndr.com/hr-contracts-video' },
        { text: 'Job Adverts', link: 'https://developcoaching.memberships.msgsndr.com/job-adverts-video' },
        { text: 'Pension, Benefits & Rewards', link: 'https://developcoaching.memberships.msgsndr.com/pension-benefits-rewards-video' },
        { text: 'Training Matrix', link: 'https://developcoaching.memberships.msgsndr.com/training-matrix-video' },
        { text: 'Reports Dashboard', link: 'https://developcoaching.memberships.msgsndr.com/reports-dashboard-video' }
    ]
};

// ----------------------------------------------------------------------
// ROADMAP COMPONENT (Protected Content) - UNCHANGED LOGIC
// ----------------------------------------------------------------------

const Roadmap = ({ userId, handleSignOut }) => {
    const [checkedItems, setCheckedItems] = useState({});
    const [isDataLoading, setIsDataLoading] = useState(true);
    
    // Firestore Path for Progress: artifacts/{appId}/users/{userId}/roadmap_progress/checks
    const roadmapProgressRef = doc(db, 'artifacts', appId, 'users', userId, 'roadmap_progress', 'checks');
    
    const columns = Object.keys(ROADMAP_CONTENT);
    
    // --- Data Loading (Firestore) ---
    useEffect(() => {
        if (!userId) return;

        const loadProgress = async () => {
            setIsDataLoading(true);
            try {
                const docSnap = await getDoc(roadmapProgressRef);
                if (docSnap.exists()) {
                    setCheckedItems(docSnap.data().items || {});
                } else {
                    console.log("No existing roadmap progress found, starting fresh.");
                    setCheckedItems({});
                }
            } catch (error) {
                console.error("Error loading progress from Firestore:", error);
            } finally {
                setIsDataLoading(false);
            }
        };
        loadProgress();
    }, [userId]); // Dependency is now just userId 

    // --- Data Saving (Firestore) ---
    const saveProgress = useCallback(async (newCheckedItems) => {
        try {
            await setDoc(roadmapProgressRef, { 
                items: newCheckedItems, 
                updatedAt: new Date().toISOString() 
            });
        } catch (e) {
            console.error("Error saving progress:", e);
        }
    }, [roadmapProgressRef]); 

    // --- Checkbox Handler ---
    const handleCheck = (itemText) => {
        const newCheckedItems = { 
            ...checkedItems, 
            [itemText]: !checkedItems[itemText] 
        };
        
        setCheckedItems(newCheckedItems);
        saveProgress(newCheckedItems);
    };

    // --- Progress Calculation (unchanged) ---
    const calculateColumnProgress = (stage) => {
        const items = ROADMAP_CONTENT[stage];
        const total = items.length;
        if (total === 0) return { checked: 0, total: 0, percentage: 0 };
        
        const checked = items.filter(item => checkedItems[item.text]).length;
        const percentage = Math.round((checked / total) * 100);
        
        return { checked, total, percentage };
    };

    const overallProgress = useMemo(() => {
        let totalItems = 0;
        let checkedItemsCount = 0;

        columns.forEach(stage => {
            const { checked, total } = calculateColumnProgress(stage);
            checkedItemsCount += checked;
            totalItems += total;
        });

        const percentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);
        
        return { checked: checkedItemsCount, total: totalItems, percentage };
    }, [checkedItems, columns]);

    if (isDataLoading) {
        return (
            <div className="auth-wrapper roadmap-loading-overlay">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading Roadmap Progress...</p>
            </div>
        );
    }

    return (
        <div className="roadmap-container">
            {/* ... (Roadmap UI) ... */}
            <div className="roadmap-header">
                <div className="logo-section">
                    <span className="logo-text">DEVELOP</span>
                </div>
                <h1 className="title">The Develop Mastermind® Roadmap</h1>
                
                {/* OVERALL PROGRESS BAR */}
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

            <div className="roadmap-content">
                {/* Sign Out Button - Now just reloads the parent page, clearing session */}
                <button 
                    onClick={handleSignOut} 
                    className="sign-out-button"
                    style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 10 }}
                >
                    Sign Out
                </button>

                {/* Roadmap Columns (unchanged) */}
                <div className="roadmap-columns">
                    {columns.map((stage, index) => {
                        const { checked, total, percentage } = calculateColumnProgress(stage);
                        return (
                            <div key={stage} className={`stage-column stage-${stage.toLowerCase()}`}>
                                
                                {/* Column Header with Progress */}
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

                                {/* Task List */}
                                <ul className="task-list">
                                    {ROADMAP_CONTENT[stage].map((item) => (
                                        <li key={item.text} className="task-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={!!checkedItems[item.text]}
                                                    onChange={() => handleCheck(item.text)}
                                                />
                                                <a 
                                                    href={item.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="task-text-link"
                                                >
                                                    {item.text}
                                                </a>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Vertical Scale (unchanged) */}
                <div className="roadmap-scale">
                    <div className="scale-label">£500K</div>
                    <div className="scale-bar"></div>
                    <div className="scale-label">£1M</div>
                    <div className="scale-label">£2M</div>
                    <div className="scale-label">£3M</div>
                    <div className="scale-label">£5M</div>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// AUTH APP (Entry Component) - MODIFIED FOR IFRAME COMMUNICATION
// ----------------------------------------------------------------------

const AuthApp = () => {
    // We now use this to store the user ID received from the parent
    const [receivedUserId, setReceivedUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- postMessage Listener for User ID ---
    useEffect(() => {
        const handleMessage = (event) => {
            // **SECURITY CHECK**: Replace 'https://your-non-react-domain.com' with the actual parent site URL
            // if (event.origin !== 'https://your-non-react-domain.com') {
            //     console.warn('Received message from unknown origin:', event.origin);
            //     return;
            // }

            const data = event.data;

            if (data.type === 'USER_LOGIN' && data.userId) {
                console.log("User ID received from parent:", data.userId);
                setReceivedUserId(data.userId);
                setLoading(false);
                setError(''); // Clear any previous errors
            } else if (data.type === 'USER_LOGOUT') {
                // Optional: Handle a logout signal from the parent
                setReceivedUserId(null);
                setLoading(false);
            }
        };

        // Attach the event listener
        window.addEventListener('message', handleMessage);

        // Simulate a timeout if no user ID is received within a few seconds
        const timeoutId = setTimeout(() => {
            if (receivedUserId === null) {
                setLoading(false);
                setError("Waiting for user ID from parent site. Ensure you are logged in.");
            }
        }, 5000); 

        // Clean up the listener and timeout
        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeoutId);
        };
    }, [receivedUserId]); 

    // --- Sign Out Handler (Reloads the Page) ---
    // The parent site is responsible for ending the session/clearing cookies.
    const handleSignOut = useCallback(() => {
        // Send a message to the parent for it to handle the logout (e.g., redirect)
        window.parent.postMessage({ type: 'IFRAME_LOGOUT' }, '*'); 
        // Simple fallback: reload the page (will likely revert to the 'waiting' state)
        window.location.reload();
    }, []);

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="auth-wrapper">
                <div className="loading-spinner"></div>
                <p className="loading-text">Awaiting User Authentication from Parent Site...</p>
            </div>
        );
    }

    // If no ID is received after loading, display an error
    if (receivedUserId === null || error) {
        return (
            <div className="auth-wrapper">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Authentication Required</h2>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="auth-content">
                        <p>This content requires a successful login from the main website.</p>
                        <p>Please ensure you are logged in and try refreshing the page.</p>
                    </div>
                </div>
            </div>
        );
    }
    
    // User ID received, render the content
    return <Roadmap userId={receivedUserId} handleSignOut={handleSignOut} />;
};

// Export the main component
export default AuthApp;