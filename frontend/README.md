# AI-Powered News Analysis System

A modern, responsive React frontend for analyzing news articles using AI-powered insights. The application provides comprehensive analysis including sentiment detection, bias analysis, stance classification, and automatic topic clustering.

## 🚀 Features

### Core Functionality
- **Multi-Input Support**: Upload files (TXT, PDF, HTML, JSON) or analyze URLs
- **AI Analysis**:
  - Sentiment Analysis with confidence scores
  - Bias Detection with direction indicators
  - Stance Classification on topics
  - AI-powered summarization
  - Automatic topic clustering

### User Interface
- **Modern Design**: Clean, responsive interface built with TailwindCSS
- **Interactive Dashboard**: View all articles with filtering and search
- **Detailed Analysis Panel**: Comprehensive breakdown of AI insights
- **Topic Clustering**: Visual organization of articles by themes
- **Real-time Search**: Filter articles by content, source, or topics

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Performance Optimized**: Fast loading with efficient state management
- **Accessibility**: WCAG compliant with proper focus management
- **Mock API**: Fully functional with realistic data simulation

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Styling**: TailwindCSS 3.4.17
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AnalysisPanel.js     # Detailed analysis display
│   ├── ArticleCard.js       # Article preview cards
│   ├── ClusterFilter.js     # Topic filtering sidebar
│   ├── Header.js            # Navigation header
│   ├── LoadingSpinner.js    # Loading states
│   ├── SearchBar.js         # Search functionality
│   └── UploadSection.js     # File/URL upload interface
├── pages/                # Main application pages
│   ├── HomePage.js          # Landing page with features
│   ├── UploadPage.js        # Upload and analysis page
│   └── DashboardPage.js     # Article dashboard
├── hooks/                # Custom React hooks
│   └── useArticles.js       # Article state management
├── utils/                # Utility functions
│   └── api.js              # Mock API and helpers
├── data/                 # Mock data
│   └── mockData.js         # Sample articles and clusters
├── App.js               # Main application component
├── App.css              # Global styles
└── index.css            # TailwindCSS imports
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and branding
- **Secondary**: Gray scale for text and backgrounds
- **Semantic Colors**: Green (positive), Red (negative), Yellow (neutral), Orange (warnings)

### Components
- **Cards**: Consistent shadow and border styling
- **Buttons**: Primary and secondary variants with hover states
- **Forms**: Consistent input styling with focus states
- **Loading States**: Spinner components for async operations

## 📊 Mock Data Structure

### Article Object
```javascript
{
  id: number,
  title: string,
  source: string,
  url: string,
  publishedAt: string,
  content: string,
  imageUrl: string,
  analysis: {
    sentiment: { score: number, label: string, confidence: number },
    bias: { score: number, label: string, confidence: number, direction: string },
    stance: { topic: string, position: string, confidence: number },
    summary: string,
    topics: string[]
  },
  cluster: string
}
```

### Cluster Object
```javascript
{
  id: string,
  name: string,
  color: string,
  count: number,
  articles: number[]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🎯 Usage Guide

### 1. Homepage
- View feature overview and system capabilities
- Navigate to upload or dashboard sections
- See system statistics and benefits

### 2. Upload & Analysis
- **URL Analysis**: Paste any news article URL
- **File Upload**: Upload text files, PDFs, HTML, or JSON
- **Real-time Results**: See analysis appear instantly
- **Detailed Breakdown**: View sentiment, bias, stance, and summary

### 3. Dashboard
- **Article Grid**: Browse all analyzed articles
- **Search**: Find articles by content, source, or topics
- **Filter by Topic**: View articles in specific clusters
- **Quick Stats**: See sentiment distribution at a glance
- **Detailed Analysis**: Click any article for full AI breakdown

### 4. Analysis Features

#### Sentiment Analysis
- **Score Range**: -1 (very negative) to +1 (very positive)
- **Visual Indicators**: Color-coded with trending icons
- **Confidence Levels**: AI confidence in the analysis

#### Bias Detection
- **Bias Score**: 0 (neutral) to 1 (highly biased)
- **Direction**: Indicates the bias direction
- **Visual Progress**: Color-coded progress bars

#### Stance Classification
- **Topic Identification**: What the article is about
- **Position**: The stance taken on the topic
- **Confidence**: How certain the AI is about the stance

#### Topic Clustering
- **Automatic Grouping**: Articles grouped by similar themes
- **Visual Organization**: Color-coded clusters
- **Easy Filtering**: Click to view cluster contents

## 🔧 Customization

### Adding New Analysis Types
1. Update the mock data structure in `src/data/mockData.js`
2. Modify the `AnalysisPanel.js` component to display new analysis
3. Update the API utilities in `src/utils/api.js`

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update component classes for specific styling
- Add custom CSS in `src/App.css` for complex animations

### API Integration
- Replace mock API calls in `src/utils/api.js`
- Update error handling for real API responses
- Modify data structures to match your API

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The build folder can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

### Environment Variables
Create a `.env` file for production settings:
```
REACT_APP_API_URL=your-api-url
REACT_APP_ENVIRONMENT=production
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Testing Strategy
- Component unit tests
- Integration tests for user flows
- Mock API testing
- Accessibility testing

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live analysis
- **Export Functionality**: PDF/CSV export of analysis results
- **User Authentication**: Personal dashboards and saved articles
- **Advanced Filtering**: Date ranges, sentiment thresholds
- **Batch Processing**: Multiple file uploads
- **Analytics Dashboard**: Trend analysis over time

### Technical Improvements
- **Performance**: Virtual scrolling for large datasets
- **Offline Support**: Service worker for offline functionality
- **Internationalization**: Multi-language support
- **Advanced Search**: Full-text search with highlighting
- **Data Visualization**: Charts and graphs for analysis trends

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React and TailwindCSS**
