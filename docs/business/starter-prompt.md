I'm working with an agentic coding boilerplate project that includes authentication, database integration, and AI capabilities. Here's what's already set up:

## Current Agentic Coding Boilerplate Structure
- **Authentication**: Better Auth with Google OAuth integration
- **Database**: Drizzle ORM with PostgreSQL setup  
- **AI Integration**: Vercel AI SDK with OpenAI integration
- **UI**: shadcn/ui components with Tailwind CSS
- **Current Routes**:
  - `/` - Home page with setup instructions and feature overview
  - `/dashboard` - Protected dashboard page (requires authentication)
  - `/chat` - AI chat interface (requires OpenAI API key)

## Important Context
This is an **agentic coding boilerplate/starter template** - all existing pages and components are meant to be examples and should be **completely replaced** to build the actual AI-powered application.

### CRITICAL: You MUST Override All Boilerplate Content
**DO NOT keep any boilerplate components, text, or UI elements unless explicitly requested.** This includes:

- **Remove all placeholder/demo content** (setup checklists, welcome messages, boilerplate text)
- **Replace the entire navigation structure** - don't keep the existing site header or nav items
- **Override all page content completely** - don't append to existing pages, replace them entirely
- **Remove or replace all example components** (setup-checklist, starter-prompt-modal, etc.)
- **Replace placeholder routes and pages** with the actual application functionality

### Required Actions:
1. **Start Fresh**: Treat existing components as temporary scaffolding to be removed
2. **Complete Replacement**: Build the new application from scratch using the existing tech stack
3. **No Hybrid Approach**: Don't try to integrate new features alongside existing boilerplate content
4. **Clean Slate**: The final application should have NO trace of the original boilerplate UI or content

The only things to preserve are:
- **All installed libraries and dependencies** (DO NOT uninstall or remove any packages from package.json)
- **Authentication system** (but customize the UI/flow as needed)
- **Database setup and schema** (but modify schema as needed for your use case)
- **Core configuration files** (next.config.ts, tsconfig.json, tailwind.config.ts, etc.)
- **Build and development scripts** (keep all npm/pnpm scripts in package.json)

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- Drizzle ORM + PostgreSQL
- Vercel AI SDK
- shadcn/ui components
- Lucide React icons

## AI Model Configuration
**IMPORTANT**: When implementing any AI functionality, always use the `OPENAI_MODEL` environment variable for the model name instead of hardcoding it:

```typescript
// ✅ Correct - Use environment variable
const model = process.env.OPENAI_MODEL || "gpt-5-mini";
model: openai(model)

// ❌ Incorrect - Don't hardcode model names
model: openai("gpt-5-mini")
```

This allows for easy model switching without code changes and ensures consistency across the application.

## Component Development Guidelines
**Always prioritize shadcn/ui components** when building the application:

1. **First Choice**: Use existing shadcn/ui components from the project
2. **Second Choice**: Install additional shadcn/ui components using `pnpm dlx shadcn@latest add <component-name>`
3. **Last Resort**: Only create custom components or use other libraries if shadcn/ui doesn't provide a suitable option

The project already includes several shadcn/ui components (button, dialog, avatar, etc.) and follows their design system. Always check the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for available components before implementing alternatives.

## What I Want to Build

`/dashboard` - Protected dashboard page (requires authentication)
would like to build a dashboard. Once a user logs in, the dashboard should allow users to search for the company house or the company name. Let's create a dashboard once users should be able search by company number and company name, which can integrate with the company house API the API key details are provided in .env file to retrieve the company house information, and with the help of AI, we should be able to summarize the information about the retrieved company information
Landing Page (Search First)
 -----------------------------------------------------
|  [Logo]    KYB for UK Businesses                    |
|-----------------------------------------------------|
|   [ Search Box: "Enter Company Name or Number" ]    |
|                                                     |
|         [ Search Company ]  [ Learn More ]          |
|                                                     |
 -----------------------------------------------------
•	Hero = search box
•	Simple CTA → pushes to /search
•	KYC Details replace this button like view more
•	 
 
2. Search Results example
 -----------------------------------------------------
|  [ Back to Search ]                                 |
|-----------------------------------------------------|
|   Results for "Tesco"                               |
|-----------------------------------------------------|
|   > Tesco PLC (00000000)        Status: Active 🟢   |
|     Registered Address: ...                         |
|     [ View KYB Report ]                             |
|                                                     |
|   > Tesco Bank Ltd (11111111)   Status: Active 🟢   |
|     Registered Address: ...                         |
|     [ View KYB Report ]                             |
 -----------------------------------------------------
•	Pull from Companies House Search API
•	Clear CTA per result → /company/:id
On clik of view more deails the main Dashboard
 
3. KYB Dashboard (Main Screen)


 -----------------------------------------------------
| Company: Tesco PLC (00000000)       Status: Active 🟢|
|-----------------------------------------------------|
|   [ Download PDF Report ]   [ Share Link ]          |
|-----------------------------------------------------|
|  [ Overview ]     [ Directors ]   [ Compliance ]    |
|  [ Risk Summary ]                                    |
 -----------------------------------------------------
 and once user click on more details 

 Grid Layout (4 Cards):

 -----------------------------------------------------
| [ Overview ]                                        |
|  - Registered Address                               |
|  - Incorporation Date                               |
Data source:
Navigation:
•	/ → landing/search
•	/search → autocomplete + list
•	/company/:id → dashboard
•	/company/:id/report → exportable view


|  - Nature of Business (SIC)                         |
 -----------------------------------------------------
| [ Directors & PSCs ]                                |
|  - John Smith (Director, Active)                    |
|  - Jane Doe (Resigned, 2021)                        |
|  - ...                                              |
 -----------------------------------------------------
| [ Compliance & Filings ]                            |
|  - Last Accounts Filed: 2023                        |
|  - Next Due: 2024-06-30                             |
|  - Confirmation Statement Overdue: ⚠️               |
 -----------------------------------------------------
| [ AI Risk Summary ]                                 |
|  - "This company shows low risk. Directors stable." |
|  - Risk Score: 3/10                                 |
 -----------------------------------------------------
•	4 modular cards in grid layout (2x2)
•	Each card clickable for drill-down in V2
 
4. share link: should allow to user to send a consolidated report to 
 -----------------------------------------------------
| Tesco PLC (00000000) — KYB Report                   |
|-----------------------------------------------------|
| [ Company Overview ]                                |
| [ Directors & PSCs ]                                |
| [ Filings ]                                         |
| [ AI Risk Narrative ]                               |
|                                                     |
|   [ Download PDF ]   [ Back to Dashboard ]          |
 -----------------------------------------------------
•	Cleaner, printable layout
•	AI Narrative included
 
🔹  
🔹 Visual Style References
•	Search simplicity → Companies House Find & Update
•	Dashboard modularity → FullCircl / DueDil (https://www.fullcircl.com)
•	Risk badge + narrative → ComplyAdvantage

|  [ Back to Search ]                                 |
|-----------------------------------------------------|
|   Results for "Tesco"                               |
|-----------------------------------------------------|
|   > Tesco PLC (00000000)        Status: Active 🟢   |
|     Registered Address: ...                         |
|     [ View KYB Report ]                             |
|                                                     |
|   > Tesco Bank Ltd (11111111)   Status: Active 🟢   |
|     Registered Address: ...                         |
|     [ View KYB Report ]                             |
 -----------------------------------------------------

## API Liks for the above specified 

Cleaner, printable layout

AI Narrative included
•  Frontend stack: Vite/React (already in your repo) → Tailwind CSS for modular cards.
•  
•  Data sources:
•	Companies House API endpoints:
o	/search/companies → for search results
o	/company/{company_number} → overview
o	/company/{company_number}/officers → directors
o	/company/{company_number}/filing-history → filings
o	/company/{company_number}/persons-with-significant-control → PSCs
•  AI Layer:
•	Fetch raw data → pass into GPT (or other LLM) → generate risk summary.
•	Cache/store report for PDF export.
•


## Request
Please help me transform this boilerplate into my actual application. **You MUST completely replace all existing boilerplate code** to match my project requirements. The current implementation is just temporary scaffolding that should be entirely removed and replaced.

## Final Reminder: COMPLETE REPLACEMENT REQUIRED
🚨 **IMPORTANT**: Do not preserve any of the existing boilerplate UI, components, or content. The user expects a completely fresh application that implements their requirements from scratch. Any remnants of the original boilerplate (like setup checklists, welcome screens, demo content, or placeholder navigation) indicate incomplete implementation.

**Success Criteria**: The final application should look and function as if it was built from scratch for the specific use case, with no evidence of the original boilerplate template.

## Post-Implementation Documentation
After completing the implementation, you MUST document any new features or significant changes in the `/docs/features/` directory:

1. **Create Feature Documentation**: For each major feature implemented, create a markdown file in `/docs/features/` that explains:
   - What the feature does
   - How it works
   - Key components and files involved
   - Usage examples
   - Any configuration or setup required

2. **Update Existing Documentation**: If you modify existing functionality, update the relevant documentation files to reflect the changes.

3. **Document Design Decisions**: Include any important architectural or design decisions made during implementation.

This documentation helps maintain the project and assists future developers working with the codebase.

Think hard about the solution and implementing the user's requirements.