# The Develop Mastermind® Roadmap

A beautiful, interactive roadmap application designed to help businesses track their growth journey from £500K to £5M in revenue. This responsive web application provides a structured approach to business development across five key areas: Plan, Attract, Convert, Deliver, and Scale.

![Roadmap Preview](./roadmap-preview.png)
Deployed site-https://roadmap-6gmk.vercel.app/
---

## 📋 Features

- **Firebase Authentication**: Secure user authentication with email/password and Google Sign-In
- **Cloud-Based Progress**: User progress synced with Firestore database
- **Interactive Checklist**: Track your progress with checkboxes that persist across devices
- **Progress Tracking**: 
  - Overall progress bar in the header
  - Individual progress bars for each column
  - Real-time percentage calculations
- **Revenue-Based Organization**: Tasks organized by revenue milestones (£500K, £1M, £2M, £3M, £5M)
  - Visual revenue dividers for clear section separation
  - Aligned task lists across all columns
- **Video Integration**: All tasks link to centralized video course platform
- **Responsive Design**: 
  - Desktop-first approach with full feature display
  - Tablet-optimized layout
  - Mobile-friendly vertical stack design
- **Persistent State**: Your progress is automatically saved to Firestore and synced across devices
- **Beautiful UI**: Modern design with brand colors, smooth animations, and revenue tier separators

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

## 🎥 Video Integration

All tasks are now linked to a centralized video course platform. The base URL for all videos is configured in `src/AuthApp.jsx`:

### Current Video Platform

```javascript
const BASE_URL = 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7';
```

### Changing the Video Base URL

To update the video platform URL:

1. Open `src/AuthApp.jsx`
2. Locate the `BASE_URL` constant (around line 40)
3. Update it to your new platform URL:

```javascript
const BASE_URL = 'https://your-new-video-platform.com/course-id';
```

All task links will automatically use this base URL.

### Task Structure with Revenue Tiers

Tasks are organized by revenue milestones with visual separators:

```javascript
const ROADMAP_CONTENT = {
  Plan: {
    '£500K': [
      { text: '1 Year Forecast', link: `${BASE_URL}` },
      { text: 'Asana Task Management', link: `${BASE_URL}` },
    ],
    '£1M': [
      { text: 'Software Tracking', link: `${BASE_URL}` },
      // ... more tasks
    ],
    // ... more revenue levels
  },
  // ... more columns
};
```

Each task link opens the video course in a new tab when clicked.

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
│   ├── Roadmap.jsx           # Main Roadmap component ⭐
│   ├── Roadmap.css           # Roadmap styles ⭐
│   ├── AuthApp.jsx           # Authentication component
│   └── AuthApp.css           # Authentication styles
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

**⭐ Key Files for Customization**:
- `src/AuthApp.jsx` - Main roadmap component with authentication, task data, and logic
- `src/AuthApp.css` - Main roadmap styles with revenue section styling
- `src/Roadmap.jsx` - Alternative standalone roadmap component (localStorage-based)
- `src/Roadmap.css` - Alternative roadmap styles

---

## 🎨 Customization Guide

### Changing Brand Colors

Edit `src/AuthApp.css` - The color palette is defined at the top:

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

1. Open `src/AuthApp.jsx`
2. Find the appropriate column and revenue level in `ROADMAP_CONTENT`
3. Add your task object:
   ```javascript
   { text: 'Your New Task', link: `${BASE_URL}` }
   ```

### Adding New Columns

1. Add a new key to `ROADMAP_CONTENT` with the column name
2. Define tasks for each revenue level (£500K, £1M, £2M, £3M, £5M)
3. The application will automatically render the new column

### Changing Revenue Levels

1. Modify the `revenueRows` array in `src/AuthApp.jsx`:
   ```javascript
   const revenueRows = ['£500K', '£1M', '£2M', '£3M', '£5M'];
   ```
2. Update all revenue levels in `ROADMAP_CONTENT` to match

### Customizing Revenue Dividers

The yellow dividers between revenue sections can be styled in `src/AuthApp.css`:

```css
.revenue-divider-aligned {
    border: none;
    border-top: 2px solid #fdce36; /* Change color/thickness here */
    width: 100%;
    margin: 0;
}
```

---

## 🛠 Technologies Used

- **React 19.0** - UI framework
- **Vite 6.3** - Build tool and dev server
- **CSS3** - Styling with custom properties
- **LocalStorage API** - Progress persistence
- **Firebase** - Authentication (via AuthApp component)

---

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Full layout with side scale)
- **Tablet**: 768px - 1024px (Adjusted layout, side scale visible)
- **Mobile**: < 768px (Vertical stack, side scale hidden)

---

## 💾 Data Persistence

The application uses **Firebase Firestore** for cloud-based data persistence:

### User Authentication
- Email/Password authentication
- Google Sign-In integration
- Password reset functionality
- Profile data collection (name, company, phone)

### Progress Storage
- **Storage Location**: Firebase Firestore database
- **Path**: `artifacts/{appId}/users/{userId}/roadmap_progress/checks`
- **Data Format**: JSON object with task names as keys and boolean values
- **Sync**: Progress automatically syncs across all devices where user is logged in

### Profile Data
- **Storage Location**: `artifacts/{appId}/users/{userId}/profile_data/info`
- **Data**: Name, email, company name, phone number, registration date

### Alternative: Local Storage Version
The `Roadmap.jsx` component provides a simpler, localStorage-based version without authentication for standalone use.

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

### Version 2.0.0 (Latest)
- **Firebase Integration**: Full authentication system with email/password and Google Sign-In
- **Firestore Database**: Cloud-based progress storage that syncs across devices
- **Revenue Section Dividers**: Visual yellow dividers between revenue tiers (£500K, £1M, £2M, £3M, £5M)
- **Aligned Task Lists**: Tasks vertically aligned across all columns using placeholders
- **Centralized Video Platform**: All video links now point to unified course URL
- **Enhanced UI**: Improved styling with revenue-based organization and visual separators
- **Profile Management**: User profile data collection and storage

### Version 1.0.0
- Initial release
- 5 columns with revenue-based task organization
- Progress tracking and persistence (localStorage)
- Video link integration
- Fully responsive design

---
➡️ See [CONTRIBUTING.md](./CONTRIBUTING.md) for how development updates and Loom demos should be submitted.



