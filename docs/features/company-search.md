# Company Search Feature

## Overview

The Company Search feature enables users to search for UK companies using the Companies House API and get AI-powered insights about the companies they find. This is the core functionality of the Company Insights application.

## Key Features

- **Smart Search**: Search companies by name or registration number
- **Real-time Results**: Instant search results from Companies House API
- **Detailed Company Profiles**: Comprehensive company information display
- **AI-Powered Analysis**: Generate intelligent summaries and insights using OpenAI
- **Responsive Design**: Optimized for desktop and mobile devices

## How It Works

### 1. Company Search Process

1. User enters a company name or registration number in the search box
2. Application sends request to `/api/companies/search` endpoint
3. API calls Companies House API with the search query
4. Results are displayed in a searchable list format
5. User can click on any company to view detailed information

### 2. Company Details View

1. User selects a company from search results
2. Application fetches detailed company profile from `/api/companies/[companyNumber]`
3. Additional data (officers, filing history) is retrieved
4. Company information is displayed in structured cards
5. User can generate AI summary for deeper insights

### 3. AI Summary Generation

1. User clicks "Generate AI Summary" button
2. Application sends POST request to `/api/companies/[companyNumber]/summarize`
3. API collects comprehensive company data (profile, officers, filing history)
4. OpenAI analyzes the data and generates intelligent insights
5. Summary is displayed with actionable business intelligence

## Key Components

### Frontend Components

- **`CompanySearch`** (`src/components/company-search.tsx`)
  - Main search interface with input field and results display
  - Handles search state, loading states, and error handling
  - Displays search results in card format with key company information

- **`CompanyDetails`** (`src/components/company-details.tsx`)
  - Detailed company information view
  - Shows comprehensive company data in organized sections
  - Includes AI summary generation functionality
  - Displays status indicators and compliance information

### Backend Services

- **Companies House API Service** (`src/lib/companies-house.ts`)
  - TypeScript interfaces for API responses
  - Service class for making authenticated API calls
  - Methods for search, company profiles, officers, and filing history

- **API Routes**
  - `/api/companies/search` - Company search endpoint
  - `/api/companies/[companyNumber]` - Company profile endpoint
  - `/api/companies/[companyNumber]/summarize` - AI summary generation

### Dashboard Integration

- **`DashboardPage`** (`src/app/dashboard/page.tsx`)
  - Main dashboard with authentication protection
  - State management for selected company
  - Navigation between search and details views

## Data Sources

### Companies House API

The application integrates with the official UK Companies House API to retrieve:

- Company search results
- Detailed company profiles
- Officer information
- Filing history
- Compliance status

### AI Analysis

OpenAI integration provides:

- Comprehensive business analysis
- Risk assessment
- Financial health indicators
- Key insights and recommendations
- Compliance status interpretation

## Configuration

### Environment Variables

Required environment variables:

```bash
# Companies House API
COMPANIES_HOUSE_API_KEY=your_api_key_here

# OpenAI for AI summaries
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL="gpt-4o-mini"
```

### API Authentication

- **Companies House**: Uses API key authentication with Basic Auth
- **OpenAI**: Uses API key authentication with Bearer token

## Usage Examples

### Basic Company Search

```typescript
// Search for companies
const response = await fetch('/api/companies/search?q=Apple&items_per_page=20');
const data = await response.json();
```

### Get Company Details

```typescript
// Get detailed company information
const response = await fetch('/api/companies/12345678');
const companyProfile = await response.json();
```

### Generate AI Summary

```typescript
// Generate AI-powered analysis
const response = await fetch('/api/companies/12345678/summarize', {
  method: 'POST'
});
const summary = await response.json();
```

## Security Considerations

- API keys are stored securely in environment variables
- All API calls are server-side to protect credentials
- User authentication required to access company search functionality
- Input validation and sanitization on all search queries

## Performance Optimizations

- Debounced search to reduce API calls
- Loading states for better user experience
- Error handling with user-friendly messages
- Responsive design for optimal mobile experience

## Future Enhancements

Potential improvements for this feature:

1. **Search History**: Save user's recent searches
2. **Bookmarks**: Allow users to save favorite companies
3. **Bulk Analysis**: Compare multiple companies
4. **Export Features**: PDF or CSV export of company data
5. **Notifications**: Alerts for company changes
6. **Advanced Filters**: Filter search results by company type, status, etc.

## Troubleshooting

### Common Issues

1. **API Rate Limits**: Companies House API has rate limits
2. **Invalid Company Numbers**: Validation for UK company number format
3. **AI Summary Failures**: Fallback handling for OpenAI API issues
4. **Network Timeouts**: Proper error handling for slow API responses

### Debug Information

Check browser console and network tab for:
- API response status codes
- Error messages from Companies House API
- Network connectivity issues
- Authentication problems