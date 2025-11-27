# GitHub Profile Dashboard - Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- GitHub Personal Access Token

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Mostafa-SAID7/Mostafa-SAID7.git
cd Mostafa-SAID7
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your GitHub credentials:

```env
GITHUB_USERNAME=Mostafa-SAID7
GITHUB_TOKEN=your_personal_access_token_here
PORT=3000
NODE_ENV=development
```

#### Getting a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "GitHub Dashboard")
4. Select scopes:
   - `public_repo` (for accessing public repositories)
   - `read:user` (for reading user profile data)
5. Click "Generate token"
6. Copy the token and paste it in your `.env` file

> ⚠️ **Important**: Never commit your `.env` file to version control!

## Running the Application

### Development Mode

Start the server with auto-reload:

```bash
npm run dev
```

### Production Mode

Start the server normally:

```bash
npm start
```

The server will start on `http://localhost:3000`

## Accessing the Dashboard

Once the server is running, you can access:

- **Main Page**: http://localhost:3000/
- **Analytics Dashboard**: http://localhost:3000/dashboard.html
- **API Endpoints**:
  - http://localhost:3000/api/commits?days=30
  - http://localhost:3000/api/stats
  - http://localhost:3000/api/repos
  - http://localhost:3000/health

## Project Structure

```
Mostafa-SAID7/
├── src/                     # Backend source code
│   ├── config/             # Configuration files
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
│
├── public/                  # Frontend static files
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   ├── index.html          # Main page
│   └── dashboard.html      # Dashboard page
│
├── docs/                    # Documentation
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── package.json            # Dependencies
```

## Features

### Backend Features
- RESTful API for GitHub data
- Intelligent caching system (5-minute default)
- Rate limiting protection
- Error handling and logging
- CORS enabled for local development

### Frontend Features
- Modern, responsive design
- Dark/Light theme toggle
- Real-time data visualization with Chart.js
- Interactive charts and statistics
- Skeleton loaders for better UX
- Premium glassmorphism effects

## Troubleshooting

### Server won't start

**Problem**: `Missing required environment variables`

**Solution**: Make sure you've created a `.env` file with all required variables from `.env.example`

### API returns 403 errors

**Problem**: GitHub API rate limiting or invalid token

**Solution**: 
1. Check that your token is valid
2. Wait a few minutes if rate limited
3. The application automatically retries requests

### Charts not loading

**Problem**: CORS or network errors

**Solution**:
1. Make sure the backend server is running
2. Check browser console for errors
3. Verify API endpoints are accessible

### Empty data or zero commits

**Problem**: No recent activity or private repos

**Solution**:
1. Make sure you have some activity in the selected timeframe
2. If using private repos, ensure token has `repo` scope

## Performance Tips

1. **Caching**: Data is cached for 5 minutes by default. Adjust `CACHE_DURATION` in `.env`
2. **Rate Limiting**: Be mindful of GitHub API rate limits (5000 requests/hour for authenticated users)
3. **Optimize Requests**: Use the cache clear endpoint sparingly: `POST /api/cache/clear`

## Development Tips

### Adding New API Endpoints

1. Create route handler in `src/routes/github.routes.js`
2. Add business logic in `src/services/github.service.js`  
3. Update frontend API client in `public/js/api.js`

### Customizing Themes

Edit `public/css/variables.css` to customize colors, spacing, and typography.

### Adding New Charts

1. Create chart function in `public/js/charts.js`
2. Add canvas element to HTML
3. Initialize chart in your page script

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this project for your own GitHub profile!

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: m.ssaid356@gmail.com
