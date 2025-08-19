# Application Architecture Overview

## Project Transformation

This application was transformed from an agentic coding boilerplate into a specialized **Company Insights** platform. All boilerplate content has been completely replaced with purpose-built functionality for UK company research and analysis.

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for server-side logic
- **Better Auth** for authentication with Google OAuth
- **Drizzle ORM** with PostgreSQL database
- **Companies House API** integration
- **Vercel AI SDK** with OpenAI for AI summaries

### External APIs
- **Companies House API** - UK company data
- **OpenAI API** - AI-powered analysis and summaries

## Application Structure

```
src/
├── app/
│   ├── api/
│   │   └── companies/
│   │       ├── search/
│   │       └── [companyNumber]/
│   │           └── summarize/
│   ├── dashboard/           # Main company search interface
│   ├── page.tsx            # Landing page
│   └── layout.tsx          # Root layout with branding
├── components/
│   ├── company-search.tsx   # Company search component
│   ├── company-details.tsx  # Company details view
│   ├── site-header.tsx     # Updated navigation
│   └── ui/                 # shadcn/ui components
└── lib/
    └── companies-house.ts   # API service and types
```

## Core Features Implemented

### 1. Landing Page (`/`)
- **Purpose**: Brand introduction and user onboarding
- **Features**: 
  - Company Insights branding with Building2 icon
  - Feature highlights (Smart Search, Company Data, AI Insights)
  - Conditional authentication display
  - Direct dashboard access for authenticated users

### 2. Company Search Dashboard (`/dashboard`)
- **Purpose**: Main application interface for company research
- **Features**:
  - Protected route requiring authentication
  - Company search by name or registration number
  - Real-time search results with company details
  - Navigation between search and company details views

### 3. Company Search Component
- **Purpose**: Interactive search interface
- **Features**:
  - Input field with search validation
  - Real-time API integration
  - Results display with company cards
  - Loading states and error handling
  - Company status badges and formatting

### 4. Company Details Component
- **Purpose**: Comprehensive company information display
- **Features**:
  - Detailed company profile information
  - Status indicators and compliance data
  - AI summary generation with OpenAI integration
  - Structured data presentation
  - Navigation back to search results

## API Architecture

### Companies House Integration (`/lib/companies-house.ts`)

**Service Class**: `CompaniesHouseAPI`
- Handles authentication with API key
- Provides methods for:
  - Company search
  - Company profile retrieval
  - Officer information
  - Filing history

**TypeScript Interfaces**:
- `CompanySearchResult` - Search result structure
- `CompanyProfile` - Detailed company data
- `SearchResponse` - API response wrapper

### API Routes

1. **`/api/companies/search`**
   - Method: GET
   - Purpose: Search companies by name or number
   - Parameters: `q` (query), `items_per_page` (optional)

2. **`/api/companies/[companyNumber]`**
   - Method: GET
   - Purpose: Get detailed company profile
   - Parameters: Company number in URL path

3. **`/api/companies/[companyNumber]/summarize`**
   - Method: POST
   - Purpose: Generate AI-powered company analysis
   - Features: Combines company data with OpenAI analysis

## AI Integration

### OpenAI Service Integration
- **Model**: Configurable via `OPENAI_MODEL` environment variable
- **Provider**: Uses `@ai-sdk/openai` for consistent API access
- **Function**: `generateText` for comprehensive company analysis

### AI Analysis Features
- Company overview and business activity interpretation
- Corporate structure analysis
- Compliance status assessment
- Financial health indicators
- Risk assessment and red flags
- Business intelligence insights

## Authentication & Security

### Better Auth Integration
- **Google OAuth** for user authentication
- **Protected Routes** for dashboard access
- **Session Management** with client-side hooks

### API Security
- **Server-side API calls** to protect credentials
- **Environment variables** for sensitive data
- **Input validation** on all endpoints
- **Error handling** with appropriate status codes

## Data Flow

### Company Search Flow
1. User enters search query
2. Frontend validates input
3. API call to `/api/companies/search`
4. Server calls Companies House API
5. Results formatted and returned
6. Frontend displays searchable results

### Company Details Flow
1. User selects company from results
2. Frontend fetches detailed data via `/api/companies/[companyNumber]`
3. Server retrieves comprehensive company information
4. Data presented in structured cards
5. Optional AI summary generation available

### AI Summary Flow
1. User requests AI analysis
2. API collects all available company data
3. Data sent to OpenAI with structured prompt
4. AI generates comprehensive business analysis
5. Summary displayed with insights and recommendations

## Design Principles

### User Experience
- **Clean, professional interface** suitable for business research
- **Responsive design** for desktop and mobile
- **Clear information hierarchy** with structured data presentation
- **Loading states** and error handling for smooth interaction

### Performance
- **Server-side API calls** for better security and performance
- **Optimized component rendering** with React best practices
- **Error boundaries** and fallback states
- **Efficient state management** with minimal re-renders

### Scalability
- **Modular component architecture** for easy maintenance
- **TypeScript interfaces** for consistent data handling
- **Configurable AI models** via environment variables
- **Extensible API structure** for additional features

## Removed Boilerplate Elements

The following elements were completely removed and replaced:

- ❌ Setup checklists and welcome messages
- ❌ Demo content and placeholder text
- ❌ Example components (setup-checklist, starter-prompt-modal)
- ❌ Boilerplate navigation and branding
- ❌ Tutorial videos and setup instructions
- ❌ AI chat functionality (replaced with company analysis)

## Environment Configuration

### Required Variables
```bash
# Database
POSTGRES_URL=your_database_url

# Authentication
BETTER_AUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Company Data
COMPANIES_HOUSE_API_KEY=your_companies_house_key

# AI Analysis
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL="gpt-4o-mini"
```

This architecture provides a solid foundation for company research and analysis, with clear separation of concerns, robust error handling, and scalable design patterns.