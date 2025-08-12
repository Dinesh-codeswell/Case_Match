# Case Competition Team Matching Feature

This feature provides an AI-powered team matching system for case competitions, integrated into the Beyond Career platform.

## Features

- **CSV Upload**: Upload participant data via drag-and-drop or file selection
- **AI-Powered Matching**: Advanced algorithm considers skills, experience, availability, and preferences
- **Team Visualization**: Interactive team cards with detailed member information
- **Statistics Dashboard**: Comprehensive matching statistics and efficiency metrics
- **Export Results**: Download team compositions as CSV files
- **Anti-Bias Algorithm**: Ensures fair team formation based on multiple criteria

## Architecture

### Self-Contained Next.js Application
- **Next.js 14** with App Router
- **API Routes** for CSV processing and team matching
- **React** components with TypeScript
- **Tailwind CSS** for styling
- **Responsive design** for all devices

### Core Libraries (`/lib/case-match`)
- **CSV Parser** - Processes uploaded CSV files
- **Matching Algorithm** - Advanced team formation logic
- **TypeScript Types** - Type definitions for all data structures

### API Routes (`/app/api/case-match`)
- `/upload` - Process CSV and return team matches
- `/analyze` - Analyze CSV without matching (statistics only)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

### Development

1. **Start the application**:
   ```bash
   npm run dev
   ```

   This will start the Next.js application at http://localhost:3000

### Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## Usage

1. **Navigate to Case Match**: Go to `/case-match` on the website
2. **Upload CSV**: Drag and drop or select a CSV file with participant data
3. **View Results**: See formed teams with compatibility scores
4. **Download Results**: Export team compositions as CSV

## CSV Format

The CSV file should include the following columns:

### Required Columns
- `Full Name` - Participant's full name
- `Email ID` - Email address
- `WhatsApp Number` - Contact number
- `College Name` - Institution name
- `Current Year of Study` - Academic year (e.g., "Second Year", "PG/MBA (1st Year)")

### Matching Criteria Columns
- `Top 3 Core Strengths` - Semicolon-separated skills
- `Preferred Role(s)` - Semicolon-separated preferred roles
- `Availability (next 2–4 weeks)` - Time commitment level
- `Previous Case Comp Experience` - Experience level
- `Case Comp Preferences` - Semicolon-separated case types
- `Preferred Team Size` - Number (2, 3, or 4)

### Optional Columns
- `Working Style Preferences` - Work style preferences
- `Ideal Team Structure` - Team structure preference
- `Looking For` - What they're looking for in a team
- `Work Style` - Structured vs flexible work style

## Matching Algorithm

The system uses a sophisticated multi-criteria matching algorithm:

### 1. Education Level Separation
- UG students matched with UG students
- PG/MBA students matched with PG/MBA students

### 2. Team Size Preferences
- Respects individual preferred team sizes
- Forms teams of exactly the preferred size when possible

### 3. Compatibility Scoring
- **Skills Complementarity** (20%): Diverse skill sets
- **Experience Balance** (15%): Mixed experience levels
- **Availability Matching** (15%): Compatible time commitments
- **Case Type Alignment** (25%): Common interests
- **Work Style Compatibility** (10%): Compatible work styles
- **Education Level Match** (10%): Same education level
- **Team Size Preference** (5%): Preferred size alignment

### 4. Anti-Bias Features
- Prevents clustering by similar backgrounds
- Ensures diverse team compositions
- Balances experience levels across teams

### 5. Iterative Optimization
- Multiple matching iterations for better results
- Strategic regrouping for unmatched participants
- Fallback strategies for edge cases

## API Endpoints

### POST `/api/case-match/upload`
Upload CSV file and get team matching results.

**Parameters:**
- `csvFile` (file): CSV file with participant data
- `strictEducationSeparation` (query, boolean): Separate UG/PG (default: true)
- `strictTeamSizeMatching` (query, boolean): Strict team size matching (default: true)
- `strictAvailabilityMatching` (query, boolean): Strict availability matching (default: true)
- `useIterativeMatching` (query, boolean): Use iterative algorithm (default: true)
- `maxIterations` (query, number): Maximum iterations (default: auto)
- `minParticipantsPerIteration` (query, number): Minimum participants per iteration (default: 2)
- `logLevel` (query, string): Log level - minimal|detailed|verbose (default: detailed)

**Response:**
```json
{
  "teams": [...],
  "unmatched": [...],
  "statistics": {
    "totalParticipants": 100,
    "teamsFormed": 25,
    "averageTeamSize": 3.8,
    "matchingEfficiency": 95.0,
    "teamSizeDistribution": {...},
    "caseTypeDistribution": {...}
  }
}
```

### POST `/api/case-match/analyze`
Analyze CSV file without performing matching.

**Parameters:**
- `csvFile` (file): CSV file with participant data

**Response:**
```json
{
  "success": true,
  "totalParticipants": 100,
  "educationDistribution": {...},
  "teamSizeDistribution": {...},
  "experienceDistribution": {...},
  "availabilityDistribution": {...},
  "casePreferenceDistribution": {...},
  "potentialMatchingIssues": [...]
}
```

## File Structure

```
/
├── app/
│   ├── api/case-match/
│   │   ├── upload/route.ts
│   │   └── analyze/route.ts
│   └── case-match/
│       └── page.tsx
├── lib/case-match/
│   ├── types.ts
│   ├── csv-parser.ts
│   └── matchmaking.ts
├── components/case-match/
│   ├── FileUpload.tsx
│   ├── TeamCard.tsx
│   └── Statistics.tsx
├── public/
│   └── sample-case-match.csv
└── case_match/ (original standalone version)
```

## Configuration

### Configuration
The application is self-contained and doesn't require external configuration. All processing happens within the Next.js API routes.

## Troubleshooting

### Common Issues

1. **CSV upload fails**: Check file format and required columns
2. **No teams formed**: Verify participant data has sufficient diversity
3. **File too large**: Maximum file size is handled by Next.js (default ~4MB)

### Debug Mode
Enable verbose logging by adding `?logLevel=verbose` to the upload request.

## Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update this README for any new functionality
4. Test with various CSV formats and sizes

## License

This feature is part of the Beyond Career platform and follows the same licensing terms.