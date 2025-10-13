import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup, 
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app); 

// ----------------------------------------------------------------------
// PRE-PROCESSED DATA (Roadmap Content) - Organized by Revenue Tiers
// ----------------------------------------------------------------------
const BASE_URL = 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7';

const ROADMAP_CONTENT = {
    Plan: {
        '£500K': [
            { text: '1 Year Forecast', link: `${BASE_URL}` },
            { text: 'Asana Task Management', link: `${BASE_URL}` },
            { text: 'Xero/Quickbooks Setup - Templates & Projects', link: `${BASE_URL}` },
        ],
        '£1M': [
            { text: 'Software Tracking', link: `${BASE_URL}` },
            { text: '5 Year BHAG (Big Hairy Audacious Goal)', link: `${BASE_URL}` },
            { text: 'KPIs', link: `${BASE_URL}` },
            { text: 'Individual Job Profitability', link: `${BASE_URL}` },
        ],
        '£2M': [
            { text: 'Monthly P&Ls', link: `${BASE_URL}` },
            { text: 'Lead Source Reports', link: `${BASE_URL}` },
            { text: 'Monthly Income Forecast', link: `${BASE_URL}` },
        ],
        '£3M': [
            { text: 'Cashflow Forecast', link: `${BASE_URL}` },
            { text: 'Pipeline', link: `${BASE_URL}` },
        ],
        '£5M': []
    },
    Attract: {
        '£500K': [
            { text: 'USP (Unique Selling Proposition)', link: `${BASE_URL}` },
            { text: 'Brand Guidelines', link: `${BASE_URL}` },
            { text: 'Staff Uniform', link: `${BASE_URL}` },
            { text: 'Vans Signwritten', link: `${BASE_URL}` },
            { text: 'Signboards / Banners', link: `${BASE_URL}` },
        ],
        '£1M': [
            { text: 'Website on Brand', link: `${BASE_URL}` },
            { text: 'Social Media Profiles Active', link: `${BASE_URL}` },
            { text: 'Reviews online', link: `${BASE_URL}` },
        ],
        '£2M': [
            { text: 'Automated Social Posts', link: `${BASE_URL}` },
            { text: 'Outbound Marketing', link: `${BASE_URL}` },
            { text: 'LinkedIn Connection & Campaigns', link: `${BASE_URL}` },
        ],
        '£3M': [
            { text: 'Page 1 Google key search terms', link: `${BASE_URL}` },
            { text: 'Blogs/Vlogs', link: `${BASE_URL}` },
            { text: 'Paid Ads', link: `${BASE_URL}` },
            
        ],
        '£5M': []
    },
    Convert: {
        '£500K': [
            { text: 'Call Handlers', link: `${BASE_URL}` },
            { text: 'Telephone Sales Script', link: `${BASE_URL}` },
            { text: 'Accurate Pricing', link: `${BASE_URL}` },
            { text: 'Quality Estimate Presentation', link: `${BASE_URL}` },
        ],
        '£1M': [
            { text: 'Tracked Follow Up Process', link: `${BASE_URL}` },
            { text: 'Professional Photos', link: `${BASE_URL}` },
            { text: 'Case Studies', link: `${BASE_URL}` },
        ],
        '£2M': [
            { text: 'Client Needs USP Generic Replies', link: `${BASE_URL}` },
            { text: 'Know, Like, Trust', link: `${BASE_URL}` },
            { text: 'Awards', link: `${BASE_URL}` },
        ],
        '£3M': [
            { text: 'Quote to Convert Campaign', link: `${BASE_URL}` },
            { text: 'Long Term Nurture', link: `${BASE_URL}` },
            
        ],
        '£5M': []
    },
    Deliver: {
        '£500K': [
            { text: '10min Daily Huddle', link: `${BASE_URL}` },
            { text: 'Gantt Charts', link: `${BASE_URL}` },
            { text: 'Client Meeting Minutes', link: `${BASE_URL}` },
        ],
        '£1M': [
            { text: 'Pre-Site Set Up', link: `${BASE_URL}` },
            { text: 'Site Set Up', link: `${BASE_URL}` },
            { text: 'Health & Safety', link: `${BASE_URL}` },
            { text: 'Track Workers', link: `${BASE_URL}` },
            { text: 'Variation Orders', link: `${BASE_URL}` },
        ],
        '£2M': [
            { text: 'Contractor/Project Manager', link: `${BASE_URL}` },
            { text: 'Weekly PM Review', link: `${BASE_URL}` },
        ],
        '£3M': [
            { text: 'Project Sign Off Snagging/Quality Control', link: `${BASE_URL}` },
            { text: 'Documentation Control', link: `${BASE_URL}` },
        ],
        '£5M': []
    },
    Scale: {
        '£500K': [
            { text: 'Organisation Chart', link: `${BASE_URL}` },
            { text: 'Supplier Terms Negotiated', link: `${BASE_URL}` },
            { text: 'Project Contracts', link: `${BASE_URL}` },
            { text: 'VOIP Phone System', link: `${BASE_URL}` },
        ],
        '£1M': [
            { text: 'Holiday/Sickness Management', link: `${BASE_URL}` },
            { text: 'Client Satisfaction Surveys', link: `${BASE_URL}` },
            { text: 'Solids/Prepayment cards', link: `${BASE_URL}` },
        ],
        '£2M': [
            { text: 'Company Bible / Training Videos', link: `${BASE_URL}` },
            { text: 'Partnerships', link: `${BASE_URL}` },
            { text: 'Job Roles Defined', link: `${BASE_URL}` },
        ],
        '£3M': [
            { text: 'HR Contracts', link: `${BASE_URL}` },
            { text: 'Job Adverts', link: `${BASE_URL}` },
            { text: 'Pension, Benefits & Rewards', link: `${BASE_URL}` },
            { text: 'Training Matrix', link: `${BASE_URL}` },
        ],
        '£5M': [
            { text: 'Reports Dashboard', link: `${BASE_URL}` },
        ]
    }
};

const columns = Object.keys(ROADMAP_CONTENT);
const revenueRows = ['£500K', '£1M', '£2M', '£3M', '£5M'];

// Find the maximum number of tasks in any column for a given revenue slab
const getMaxTasksInSlab = (slab) => {
    let max = 0;
    columns.forEach(col => {
        const tasks = ROADMAP_CONTENT[col][slab];
        if (tasks && tasks.length > max) {
            max = tasks.length;
        }
    });
    return max;
};

// Flat list for progress calculation
const roadmapDataFlat = columns.reduce((acc, stage) => {
    revenueRows.forEach(slab => {
        if (ROADMAP_CONTENT[stage][slab]) {
            ROADMAP_CONTENT[stage][slab].forEach(item => acc.push(item));
        }
    });
    return acc;
}, []);

// ----------------------------------------------------------------------
// ROADMAP COMPONENT (Protected Content)
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
    }, [userId]); 

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

    // --- Progress Calculation ---
    const calculateColumnProgress = (stage) => {
        const stageTasks = roadmapDataFlat.filter(item => 
            Object.keys(ROADMAP_CONTENT[stage]).some(slab => 
                ROADMAP_CONTENT[stage][slab].some(taskItem => taskItem.text === item.text)
            )
        );
        const total = stageTasks.length;
        if (total === 0) return { checked: 0, total: 0, percentage: 0 };
        
        const checked = stageTasks.filter(item => checkedItems[item.text]).length;
        const percentage = Math.round((checked / total) * 100);
        
        return { checked, total, percentage };
    };

    const overallProgress = useMemo(() => {
        let totalItems = roadmapDataFlat.length;
        let checkedItemsCount = roadmapDataFlat.filter(item => checkedItems[item.text]).length;

        const percentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);
        
        return { checked: checkedItemsCount, total: totalItems, percentage };
    }, [checkedItems]);

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
                {/* Sign Out Button */}
                <button 
                    onClick={handleSignOut} 
                    className="sign-out-button"
                    style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 10 }}
                >
                    Sign Out
                </button>

                {/* Roadmap Columns */}
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

                                {/* Task List with Revenue Sections */}
                                <ul className="aligned-task-list">
                                    {revenueRows.map((slab, slabIndex) => {
                                        const slabTasks = ROADMAP_CONTENT[stage][slab] || [];
                                        const maxTasks = getMaxTasksInSlab(slab);
                                        const numTasks = slabTasks.length;
                                        const numPlaceholders = maxTasks - numTasks;
                                        
                                        return (
                                            <React.Fragment key={slab}>
                                                {/* Render divider before new slab (except the first one) */}
                                                {slabIndex > 0 && (
                                                    <li className="revenue-divider-container-aligned">
                                                        <hr className="revenue-divider-aligned" />
                                                    </li>
                                                )}

                                                {/* Render actual tasks */}
                                                {slabTasks.map((item) => (
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

                                                {/* Render placeholders to maintain vertical alignment */}
                                                {Array.from({ length: numPlaceholders }).map((_, i) => (
                                                    <li key={`placeholder-${slab}-${i}`} className="task-placeholder">
                                                        {/* Empty placeholder for spacing */}
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

                {/* Vertical Scale */}
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

// ----------------------------------------------------------------------
// AUTH VIEWS & LOGIC 
// ----------------------------------------------------------------------

const AuthApp = () => {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('login'); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tempUserData, setTempUserData] = useState({}); 
    const [passwordShown, setPasswordShown] = useState(false);
    
    // otpEmail is used to display the email during the reset flow
    const [otpEmail, setOtpEmail] = useState('');

    const initDatabase = useCallback(async () => {
        // Initialization handled globally
    }, []); 

    // --- Firebase Auth State Listener ---
    useEffect(() => {
        initDatabase(); 
        let isInitialLoad = true;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (isInitialLoad || currentPage === 'login') {
                if (currentUser) {
                    if (currentPage !== 'register_step2') {
                        // User is authenticated, route to protected content
                        setCurrentPage('roadmap');
                    }
                } else {
                    // No user, stay on login page
                    setCurrentPage('login');
                }
            }
            isInitialLoad = false;
        });

        return () => unsubscribe();
    }, [initDatabase]); 

    // --- Auth Handlers (Sign Out) ---
    const handleSignOut = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
            setCurrentPage('login');
        } catch (e) {
            setError("Failed to sign out.");
            console.error(e);
        }
    }, []);

    // --- Register Step 1 ---
    const handleEmailPasswordRegister = async (e) => {
        e.preventDefault();
        setError('');
        const { name, email, password } = tempUserData;
        
        if (!name || !email || !password || password.length < 8) {
            setError("Please ensure all fields are filled and the password is at least 8 characters.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // On successful creation, proceed to Step 2
            setTempUserData(prev => ({ ...prev, userId: userCredential.user.uid, email: email, name: name }));
            setCurrentPage('register_step2');
        } catch (e) {
            let message = e.message.replace('Firebase: ', '');
            setError(message);
            console.error(e);
        }
    };

    // --- Sign In ---
    const handleEmailPasswordSignIn = async (e) => {
        e.preventDefault();
        setError('');
        const { email, password } = tempUserData;

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect handled by onAuthStateChanged listener
        } catch (e) {
            setError(e.message.replace('Firebase: Error (auth/', 'Invalid credentials. Please check your email and password. (').replace(/\)\./g, ')'));
            console.error(e);
        }
    };

    // --- Google Sign-In with Profile Check ---
    const handleGoogleSignIn = async () => {
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userUid = user.uid;

            // Check for profile data in Firestore (to ensure Step 2 completion)
            const userProfileRef = doc(db, 'artifacts', appId, 'users', userUid, 'profile_data', 'info');
            const docSnap = await getDoc(userProfileRef);

            if (!docSnap.exists()) {
                // If profile data is missing, force Step 2 registration
                setTempUserData({
                    userId: userUid,
                    name: user.displayName || '',
                    email: user.email || ''
                });
                setCurrentPage('register_step2');
            } else {
                // Profile exists: Sign-in complete, redirects to roadmap
                setUser(user);
            }
        } catch (e) {
            setError(e.message.replace('Firebase: ', ''));
            console.error("Google Sign-In Popup Error:", e);
        }
    };

    // --- Complete Registration (Step 2: Firestore Save) ---
    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setError('');
        const { companyName, phoneNumber, userId, name, email } = tempUserData;
        
        if (!companyName || !phoneNumber || !userId || !email) {
            setError("Missing data. Please try registering again.");
            return;
        }
        
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            setError("Please use the correct international phone format (e.g., +447700900000).");
            return;
        }
        window.location.reload(true);

        try {
            // Save Profile Data to Firestore
            const userRef = doc(db, 'artifacts', appId, 'users', userId, 'profile_data', 'info');
            await setDoc(userRef, {
                name: name,
                email: email,
                companyName: companyName,
                phoneNumber: phoneNumber,
                registrationDate: new Date().toISOString(),
            });
            if (auth.currentUser) {
                setUser(auth.currentUser); // <-- This forces the immediate re-render as a logged-in user
            }
            // Redirect to roadmap
           
            setCurrentPage('roadmap'); 
        } catch (e) {
            setError("Failed to save profile data. Please try again.");
            console.error("Firestore Save Error:", e);
        }
    };

    // --- Password Reset: Send Email (Firebase Auth) ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        const email = e.target.email.value;
        setOtpEmail(email); 
        
        try {
            // Firebase Auth automatically checks if the email exists
            await sendPasswordResetEmail(auth, email);
            
            setError("A password reset link has been sent to your email. Please check your inbox and spam folder.");
            // Send user to an informational screen before routing to login
            setCurrentPage('verify_otp'); 
            
        } catch (e) {
            let message = e.message.replace('Firebase: ', '');
            if (message.includes('auth/user-not-found')) {
                // This is generally hidden from the user for security, but we show a gentle error here
                message = "The email address is not registered in our system.";
            } else if (message.includes('auth/missing-android-pkg-name') || message.includes('auth/missing-ios-bundle-id')) {
                message = "The password reset link requires proper domain/package configuration in your Firebase project.";
            }
            setError(message);
            console.error("Password Reset Error:", e);
        }
    };
    
    // --- Redundant Step Cleanup ---
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        // Since we send a link directly, this screen is just to confirm the email was sent.
        setCurrentPage('login'); 
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');
        // This screen is also just for flow consistency after the email is sent.
        setCurrentPage('login'); 
    };


    // --- Render Functions ---
    const renderAuthForm = () => {
        switch (currentPage) {
            case 'register_step1':
                return <RegisterStep1 setTempUserData={setTempUserData} tempUserData={tempUserData} setError={setError} setCurrentPage={setCurrentPage} handleGoogleSignIn={handleGoogleSignIn} handleEmailPasswordRegister={handleEmailPasswordRegister} />;
            case 'register_step2':
                return <RegisterStep2 setTempUserData={setTempUserData} tempUserData={tempUserData} setError={setError} handleCompleteRegistration={handleCompleteRegistration} />;
            case 'forgot_password':
                return <ForgotPassword handleSendOtp={handleSendOtp} setError={setError} setCurrentPage={setCurrentPage} />;
            case 'verify_otp':
                return <VerifyOtp handleVerifyOtp={handleVerifyOtp} setError={setError} setCurrentPage={setCurrentPage} otpEmail={otpEmail} />;
            case 'reset_password':
                return <ResetPassword handleResetPassword={handleResetPassword} setError={setError} setCurrentPage={setCurrentPage} passwordShown={passwordShown} setPasswordShown={setPasswordShown} />;
            case 'roadmap':
                return user ? <Roadmap userId={user.uid} handleSignOut={handleSignOut} /> : null;
            case 'login':
            default:
                return <Login setTempUserData={setTempUserData} tempUserData={tempUserData} setError={setError} setCurrentPage={setCurrentPage} handleEmailPasswordSignIn={handleEmailPasswordSignIn} handleGoogleSignIn={handleGoogleSignIn} passwordShown={passwordShown} setPasswordShown={setPasswordShown} />;
        }
    };

    if (loading) {
        return (
            <div className="auth-wrapper">
                <div className="loading-spinner"></div>
                <p className="loading-text">Authenticating...</p>
            </div>
        );
    }

    if (currentPage === 'roadmap') {
        return renderAuthForm();
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-header">
                    <span className="logo-text">DEVE<span class='L'>L</span>OP</span>
                    <h2 className="auth-title">Welcome to Mastermind</h2>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="auth-content">
                    {renderAuthForm()}
                </div>
                
                {/* Footer Link for navigation */}
                <div className="auth-footer">
                    {currentPage === 'login' && <p>Don't have an account? <span onClick={() => { setCurrentPage('register_step1'); setError(''); }} className="link-text">Sign up</span></p>}
                    {currentPage === 'register_step1' && <p>Already registered? <span onClick={() => { setCurrentPage('login'); setError(''); }} className="link-text">Sign in</span></p>}
                    {(currentPage === 'forgot_password' || currentPage === 'verify_otp' || currentPage === 'reset_password') && <span onClick={() => { setCurrentPage('login'); setError(''); }} className="link-text back-link">← Back to Login</span>}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components for Views (No change needed) ---

const Login = ({ setTempUserData, tempUserData, setError, setCurrentPage, handleEmailPasswordSignIn, handleGoogleSignIn, passwordShown, setPasswordShown }) => (
    <form onSubmit={handleEmailPasswordSignIn} className="form-content">
        <input 
            type="email" 
            placeholder="Email (Organizational or Gmail)" 
            value={tempUserData.email || ''} 
            onChange={(e) => setTempUserData(p => ({ ...p, email: e.target.value }))}
            required
        />
        <div className="password-input-group">
            <input 
                type={passwordShown ? 'text' : 'password'} 
                placeholder="Password (Min 8 characters)" 
                value={tempUserData.password || ''} 
                onChange={(e) => setTempUserData(p => ({ ...p, password: e.target.value }))}
                minLength="8"
                required
            />
            <span className="password-toggle" onClick={() => setPasswordShown(!passwordShown)}>
                {passwordShown ? '🙈' : '👁️'}
            </span>
        </div>
        
        <div className="auth-options-divider">
            <span className="link-text" onClick={() => { setCurrentPage('forgot_password'); setError(''); }}>Forgot Password?</span>
        </div>

        <button type="submit" className="primary-button">Sign In</button>
        
        <div className="auth-options-or">OR</div>
        
        <button type="button" onClick={handleGoogleSignIn} className="secondary-button google-button">Sign In with Google</button>
    </form>
);

const RegisterStep1 = ({ setTempUserData, tempUserData, setCurrentPage, handleGoogleSignIn, handleEmailPasswordRegister }) => {
    const [passwordShown, setPasswordShown] = useState(false);
    
    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        setTempUserData(p => ({ ...p, name, email, password }));
        handleEmailPasswordRegister(e); 
    };

    return (
        <form onSubmit={handleLocalSubmit} className="form-content">
            <input 
                type="text" 
                placeholder="Full Name" 
                name="name"
                value={tempUserData.name || ''} 
                onChange={(e) => setTempUserData(p => ({ ...p, name: e.target.value }))}
                required
            />
            <input 
                type="email" 
                placeholder="Email (Organizational or Gmail)" 
                name="email"
                value={tempUserData.email || ''} 
                onChange={(e) => setTempUserData(p => ({ ...p, email: e.target.value }))}
                required
            />
            <div className="password-input-group">
                <input 
                    type={passwordShown ? 'text' : 'password'} 
                    placeholder="Password (Min 8 characters)" 
                    name="password"
                    value={tempUserData.password || ''} 
                    onChange={(e) => setTempUserData(p => ({ ...p, password: e.target.value }))}
                    minLength="8"
                    required
                />
                <span className="password-toggle" onClick={() => setPasswordShown(!passwordShown)}>
                    {passwordShown ? '🙈' : '👁️'}
                </span>
            </div>
            
            <button type="submit" className="primary-button">Sign Up</button> 
            
            <div className="auth-options-or">OR</div>
            
            <button type="button" onClick={handleGoogleSignIn} className="secondary-button google-button">Sign Up with Google</button>
        </form>
    );
};

const RegisterStep2 = ({ setTempUserData, tempUserData, handleCompleteRegistration }) => (
    <form onSubmit={handleCompleteRegistration} className="form-content">
        <h3 className="step-title">Profile Details (Step 2/2)</h3>
        <input 
            type="text" 
            placeholder="Company Name" 
            value={tempUserData.companyName || ''} 
            onChange={(e) => setTempUserData(p => ({ ...p, companyName: e.target.value }))}
            required
        />
        <input 
            type="tel" 
            placeholder="Phone Number" 
            value={tempUserData.phoneNumber || ''} 
            onChange={(e) => setTempUserData(p => ({ ...p, phoneNumber: e.target.value }))}
            pattern="\+\d{10,15}"
            required
        />
        <p className="input-hint">Format: +[Country Code][Number] (e.g., +447700900000)</p>

        <button type="submit" className="primary-button">Complete Registration</button>
    </form>
);

const ForgotPassword = ({ handleSendOtp }) => (
    <form onSubmit={handleSendOtp} className="form-content">
        <h3 className="step-title">Reset Password</h3>
        <input type="email" name="email" placeholder="Enter your registered email" required />
        <button type="submit" className="primary-button">Send Reset Link</button>
        <p className="input-hint">A password reset link will be sent directly to your email.</p>
    </form>
);

const VerifyOtp = ({ handleVerifyOtp, otpEmail }) => (
    <form onSubmit={handleVerifyOtp} className="form-content">
        <h3 className="step-title">Code Sent</h3>
        <p>A password reset link has been sent to **{otpEmail}**. Check your email and spam folder to proceed.</p>
        <button type="submit" className="primary-button">Back to Login</button>
    </form>
);

const ResetPassword = ({ handleResetPassword }) => (
    <form onSubmit={handleResetPassword} className="form-content">
        <h3 className="step-title">Password Reset Complete</h3>
        <p>The password reset process is handled via the link sent to your email. You can now return to the login screen.</p>
        <button type="submit" className="primary-button">Return to Login</button>
    </form>
);

// Export the main component
export default AuthApp;