# The Develop Mastermind® Roadmap

A beautiful, interactive roadmap application designed to help businesses track their growth journey from £500K to £5M in revenue. This responsive web application provides a structured approach to business development across five key areas: Plan, Attract, Convert, Deliver, and Scale.

![Roadmap Preview](./roadmap-preview.png)

---

## 📋 Features

- **Interactive Checklist**: Track your progress with checkboxes that persist in local storage
- **Progress Tracking**: 
  - Overall progress bar in the header
  - Individual progress bars for each column
  - Real-time percentage calculations
- **Revenue-Based Organization**: Tasks organized by revenue milestones (£500K, £1M, £2M, £3M, £5M)
- **Video Integration**: Clickable task titles that link to tutorial videos
- **Responsive Design**: 
  - Desktop-first approach with full feature display
  - Tablet-optimized layout
  - Mobile-friendly vertical stack design
- **Persistent State**: Your progress is automatically saved to browser local storage
- **Beautiful UI**: Modern design with brand colors and smooth animations

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
- `src/Roadmap.jsx` - Contains all task data and logic
- `src/Roadmap.css` - Contains all visual styling

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

The application automatically saves your progress using the browser's localStorage:
- **Storage Key**: `roadmapChecks`
- **Data Format**: JSON object with task names as keys and boolean values
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

### Version 1.0.0
- Initial release
- 5 columns with revenue-based task organization
- Progress tracking and persistence
- Video link integration
- Fully responsive design

---




