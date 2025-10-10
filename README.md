# The Develop Mastermind® Roadmap

A beautiful, interactive roadmap application designed to help businesses track their growth journey from £500K to £5M in revenue. This responsive web application provides a structured approach to business development across five key areas: Plan, Attract, Convert, Deliver, and Scale.

![Roadmap Preview](./roadmap-preview.png)

---

## 🌐 Live Deployment

**Live Website**: [https://pages.develop-coaching.co.uk/new-roadmap](https://pages.develop-coaching.co.uk/new-roadmap)

**React App URL**: [https://interactive-roadmap-umber.vercel.app/](https://interactive-roadmap-umber.vercel.app/)

### Deployment Details

The application is deployed on **Firebase** and can be accessed through your Firebase account:
- **Account Email**: hello@developcoaching.co.uk
- **Managed by**: [developcoaching.co.uk](https://developcoaching.co.uk)
- **Platform**: Firebase Hosting & Firestore Database
- **User Progress Storage**: All user progress is automatically saved and synced via Firebase Firestore

### How to Access

This roadmap is integrated with the **Develop Coaching** GoHighLevel (GHL) workflow system. To access the interactive roadmap:

1. **Navigate to the GHL Workflow**:
   - Go to the **Sites** tab in your GHL dashboard
   - Select the **Websites** tab
   - Locate the **Roadmap Interactive** folder
   - Open the file named **"New Roadmap"**

2. **Automatic Login**:
   - If you are an **existing customer**, the system will automatically log you in
   - Your progress is **automatically saved and synced** to Firebase Firestore
   - Each user's progress is stored separately and persists across sessions and devices
   - No manual authentication required!

3. **Access Method**:
   - The roadmap can **only be opened through the GHL workflow** called **"Flow build"**
   - This ensures secure, authenticated access for Develop Coaching members
   - Direct URL access requires authentication via the workflow

### Iframe Integration Code

The React app is embedded in the GHL page using the following iframe code:

```html
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .iframe-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    z-index: 999;
  }
  .iframe-container {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>

<div class="iframe-wrapper">
  <iframe
    id="myReactIframe"
    class="iframe-container"
    src="https://interactive-roadmap-umber.vercel.app/"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
<script>
  const IFRAME_ID = 'myReactIframe';
  const REACT_APP_ORIGIN = 'https://interactive-roadmap-umber.vercel.app';

  // Replace this with actual logic to get the logged-in user ID from FlowBuild or GHL
  const LOGGED_IN_USER_ID = '{{contact.id}}'; // GHL merge field example

  const iframe = document.getElementById(IFRAME_ID);

  if (iframe && LOGGED_IN_USER_ID) {
    const sendUserIdToIframe = () => {
      iframe.contentWindow.postMessage(
        {
          type: 'USER_LOGIN',
          userId: LOGGED_IN_USER_ID
        },
        REACT_APP_ORIGIN
      );
      console.log("Sent USER_LOGIN message to React iframe:", LOGGED_IN_USER_ID);
    };

    if (iframe.contentWindow) {
      sendUserIdToIframe();
    }

    iframe.onload = sendUserIdToIframe;

    window.addEventListener('message', (event) => {
      if (event.origin !== REACT_APP_ORIGIN) return;

      if (event.data.type === 'IFRAME_LOGOUT') {
        console.log("Received LOGOUT signal from iframe. Reloading parent.");
        window.location.reload();
      }
    });
  } else {
    console.error("IFRAME EMBED ERROR: Could not find element with ID:", IFRAME_ID, "or User ID is missing.");
  }
</script>
```

---

## 📋 Features

- **Secure Authentication**: 
  - Firebase-based authentication system
  - Automatic login for existing Develop Coaching customers
  - Secure user session management via GHL integration
- **Interactive Checklist**: Track your progress with checkboxes that sync to your account
- **Progress Tracking**: 
  - Overall progress bar in the header
  - Individual progress bars for each column (Plan, Attract, Convert, Deliver, Scale)
  - Real-time percentage calculations
- **Revenue-Based Organization**: 
  - Tasks organized by revenue milestones (£500K, £1M, £2M, £3M, £5M)
  - Visual dividers separating each revenue tier
  - Aligned layout for easy comparison across columns
- **Course Integration**: 
  - Clickable task titles that link to tutorial videos and courses
  - Direct access to Develop Coaching membership content
  - Seamless integration with the learning platform
- **Responsive Design**: 
  - Desktop-first approach with full feature display
  - Tablet-optimized layout
  - Mobile-friendly vertical stack design
  - Revenue scale sidebar (hidden on mobile)
- **Cloud Sync**: Your progress is automatically saved to Firebase and synced across devices
- **Beautiful UI**: Modern design with brand colors (#fdce36 gold, #414042 dark grey) and smooth animations

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the repository**

2. **Navigate to the project directory**
   ```bash
   cd "Roadmap (DEVELOP COACHING)"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The application will open at `http://localhost:5173` (or another port if 5173 is busy)

#### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

#### Preview Production Build
```bash
npm run preview
```

---

## 🎥 Adding Video Links

To add video tutorial links to tasks, you need to edit the `taskMap` object in `src/Roadmap.jsx`:

### Step 1: Locate the Task Map

Open `src/Roadmap.jsx` and find the `taskMap` object (starts around line 8).

### Step 2: Add Your Video URLs

Each task object has a `videoUrl` property. Simply add your video URL:

```javascript
const taskMap = {
  Plan: {
    '£500K': [
      { task: '1 Year Forecast', videoUrl: 'https://youtu.be/your-video-id' },
      { task: 'Asana Task Management', videoUrl: 'https://vimeo.com/your-video' },
      // ... more tasks
    ],
    // ... more revenue levels
  },
  // ... more columns
};
```

### Step 3: Video URL Format

You can use any video platform:
- **YouTube**: `https://youtu.be/VIDEO_ID` or `https://www.youtube.com/watch?v=VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Custom hosting**: Any direct video URL
- **Leave empty**: Tasks without a URL (`videoUrl: ''`) will display as plain text

### Example

```javascript
Attract: {
  '£500K': [
    { 
      task: 'USP', 
      videoUrl: 'https://youtu.be/abc123xyz' 
    },
    { 
      task: 'Brand Guidelines', 
      videoUrl: '' // No video yet
    },
  ],
}
```

When a task has a video URL, the title becomes a clickable link that opens the video in a new tab.

---

## 📁 Project Structure

```
Roadmap (DEVELOP COACHING)/
├── public/
│   └── vite.svg              # Favicon
├── src/
│   ├── assets/               # Static assets (images, icons)
│   ├── App.jsx               # Main App component (router)
│   ├── App.css               # App styles
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   ├── Roadmap.jsx           # Standalone Roadmap component (demo) ⭐
│   ├── AuthRoadmap.jsx       # Authenticated Roadmap component (production) ⭐⭐
│   ├── Roadmap.css           # Roadmap styles (shared) ⭐
│   ├── AuthApp.jsx           # Authentication wrapper component
│   └── AuthApp.css           # Authentication styles
├── dist/                     # Production build output
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

**⭐⭐ Production Component**:
- `src/AuthRoadmap.jsx` - The main authenticated roadmap used in production
  - Integrates with Firebase for authentication
  - Syncs progress to cloud database
  - Receives user ID from GHL workflow
  - Contains all task data organized by revenue slabs
  - Links to Develop Coaching course content

**⭐ Development/Demo Component**:
- `src/Roadmap.jsx` - Standalone version for local development
  - Uses localStorage instead of Firebase
  - No authentication required
  - Same UI and features as AuthRoadmap
  
**Shared Resources**:
- `src/Roadmap.css` - All visual styling for both components

---

## 🎨 Customization Guide

### Changing Brand Colors

Edit `src/Roadmap.css` - The color palette is defined at the top:

```css
/* Color Palette:
 * #fdce36 (Primary Yellow/Gold)
 * #fbaa35 (Secondary Orange/Yellow)
 * #414042 (Dark Grey - Text & Headers)
 * #d2d2d2 (Light Grey - Borders & Backgrounds)
 * #f7f7f7 (Background Grey)
 */
```

Use Find & Replace to update colors throughout the file.

### Adding New Tasks

1. Open `src/Roadmap.jsx`
2. Find the appropriate column and revenue level in `taskMap`
3. Add your task object:
   ```javascript
   { task: 'Your New Task', videoUrl: 'optional-url' }
   ```

### Adding New Columns

1. Add a new key to `taskMap` with the column name
2. Define tasks for each revenue level
3. The application will automatically render the new column

### Changing Revenue Levels

1. Modify the `revenueRows` array in `src/Roadmap.jsx`:
   ```javascript
   const revenueRows = ['£500K', '£1M', '£2M', '£3M', '£5M'];
   ```
2. Update all revenue levels in `taskMap` to match

---

## 🛠 Technologies Used

### Frontend
- **React 19.0** - UI framework with hooks (useState, useEffect, useMemo, useCallback)
- **Vite 6.3** - Lightning-fast build tool and dev server
- **CSS3** - Custom styling with responsive design and CSS Grid/Flexbox

### Backend & Services
- **Firebase** - Cloud services platform
  - Firestore - Real-time NoSQL database for progress storage
  - Authentication - User session management
- **Vercel** - Serverless deployment platform
- **GoHighLevel (GHL)** - Workflow integration and user management

### Data Storage
- **LocalStorage API** - Client-side progress persistence (demo mode)
- **Firebase Firestore** - Cloud-based progress sync (production mode)

### Integration
- **postMessage API** - Secure iframe communication with GHL workflow
- **Develop Coaching Membership Platform** - Course content integration

---

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Full layout with side scale)
- **Tablet**: 768px - 1024px (Adjusted layout, side scale visible)
- **Mobile**: < 768px (Vertical stack, side scale hidden)

---

## 💾 Data Persistence

### Production Mode (AuthRoadmap.jsx)
The application saves your progress to **Firebase Firestore**:
- **Database**: Cloud Firestore
- **Storage Path**: `artifacts/{appId}/users/{userId}/roadmap_progress/checks`
- **Data Format**: JSON object with task names as keys and boolean values
- **Auto-Sync**: Progress automatically syncs across all your devices
- **User-Specific**: Each user's progress is stored separately and securely

### Demo Mode (Roadmap.jsx)
Uses **browser's localStorage** for offline persistence:
- **Storage Key**: `roadmapChecks`
- **Data Format**: JSON object with task names as keys and boolean values
- **Device-Specific**: Progress saved locally on current browser only
- **Clearing Progress**: Clear browser data or localStorage to reset

---

## 🔧 Common Tasks

### Reset All Progress
```javascript
// In browser console:
localStorage.removeItem('roadmapChecks');
location.reload();
```

### Export Current Progress
```javascript
// In browser console:
console.log(localStorage.getItem('roadmapChecks'));
```

---

## 📝 License

This project is proprietary software owned by Develop Coaching. All rights reserved.

---

## 👥 Support

For questions or support regarding The Develop Mastermind® Roadmap, please contact:
- **Website**: [Add your website URL]
- **Email**: [Add your support email]

---

## 🔄 Version History

### Version 2.0.0 (Current)
- **Authentication System**: Full Firebase integration with automatic login
- **GHL Workflow Integration**: Seamless integration with Develop Coaching workflow
- **Cloud Sync**: Progress saved to Firestore and synced across devices
- **Course Links**: Direct integration with Develop Coaching membership platform
- **Revenue Slab UI**: Visual dividers separating revenue tiers (£500K, £1M, £2M, £3M, £5M)
- **AuthRoadmap Component**: Production-ready authenticated roadmap
- **Vercel Deployment**: Live at https://interactive-roadmap-umber.vercel.app/
- **Enhanced Security**: iframe-based secure access through GHL

### Version 1.0.0
- Initial release
- 5 columns with revenue-based task organization (Plan, Attract, Convert, Deliver, Scale)
- Progress tracking and persistence with localStorage
- Video link integration
- Fully responsive design (Desktop, Tablet, Mobile)

---




