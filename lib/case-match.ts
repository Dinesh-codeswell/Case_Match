import { v4 as uuidv4 } from "uuid";

// Types
export interface Participant {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  collegeName: string;
  currentYear: string;
  coreStrengths: string[];
  preferredRoles: string[];
  workingStyle?: string[];
  idealTeamStructure?: string;
  lookingFor?: string;
  availability: string;
  experience: string;
  workStyle?: string;
  casePreferences: string[];
  preferredTeamSize: number;
  teamPreference: "Undergrads only" | "Postgrads only" | "Either UG or PG";
}

export interface Team {
  id: string;
  members: Participant[];
  skillVector: number[];
  compatibilityScore: number;
  teamSize: number;
  averageExperience: number;
  commonCaseTypes: string[];
  workStyleCompatibility: string;
  preferredTeamSizeMatch: number;
}

export interface MatchingResult {
  teams: Team[];
  unmatched: Participant[];
  statistics: {
    totalParticipants: number;
    teamsFormed: number;
    averageTeamSize: number;
    matchingEfficiency: number;
    teamSizeDistribution: { [key: number]: number };
    caseTypeDistribution: { [key: string]: number };
  };
}

// CSV Parser - Fixed to prevent duplicates and ensure accurate parsing
export function parseCSVToParticipants(csvData: string): Participant[] {
  console.log("🔍 Starting CSV parsing...");

  const lines = csvData.split("\n").filter((line) => line.trim()); // Remove empty lines
  if (lines.length < 2) {
    throw new Error(
      "CSV file must have at least a header row and one data row"
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const participants: Participant[] = [];
  const seenEmails = new Set<string>(); // Prevent duplicates

  console.log(`📊 CSV Headers (${headers.length}):`, headers);
  console.log(`📝 Processing ${lines.length - 1} data rows...`);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCSVLine(line);

      // Skip if not enough values
      if (values.length < Math.min(headers.length, 10)) {
        console.warn(
          `⚠️ Skipping row ${i}: insufficient data (${values.length} values)`
        );
        continue;
      }

      const row: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      const email = row["Email ID"] || row["email"] || row["Email"] || "";
      const fullName = row["Full Name"] || row["fullName"] || row["name"] || "";

      // Skip if missing required fields or duplicate email
      if (!fullName || !email) {
        console.warn(`⚠️ Skipping row ${i}: missing name or email`);
        continue;
      }

      if (seenEmails.has(email.toLowerCase())) {
        console.warn(`⚠️ Skipping duplicate email: ${email}`);
        continue;
      }

      seenEmails.add(email.toLowerCase());

      const participant: Participant = {
        id: uuidv4(),
        fullName,
        email,
        whatsappNumber:
          row["WhatsApp Number"] || row["whatsapp"] || row["phone"] || "",
        collegeName:
          row["College Name"] || row["college"] || row["College"] || "",
        currentYear: parseCurrentYear(
          row["Current Year of Study"] || row["Course"] || ""
        ),
        coreStrengths: parseCoreStrengths(
          row["Top 3 Core Strengths"] || row["Your Top 3 Core Strengths"] || ""
        ),
        preferredRoles: parsePreferredRoles(
          row["Preferred Role(s)"] || row["Preferred Role(s) in a Team"] || ""
        ),
        workingStyle: parseWorkingStyle(row["Working Style Preferences"] || ""),
        idealTeamStructure: parseIdealTeamStructure(
          row["Ideal Team Structure"] || ""
        ),
        lookingFor: parseLookingFor(row["Looking For"] || ""),
        availability: parseAvailability(
          row["Availability (next 2–4 weeks)"] ||
            row["Your Availability for case comps (next 2–4 weeks)"] ||
            ""
        ),
        experience: parseExperience(
          row["Previous Case Comp Experience"] ||
            row["Previous Case Competition Experience"] ||
            ""
        ),
        workStyle: parseWorkStyle(row["Work Style"] || ""),
        casePreferences: parseCasePreferences(
          row["Case Comp Preferences"] ||
            row[
              "Which type(s) of case competitions are you most interested in?"
            ] ||
            ""
        ),
        preferredTeamSize: parsePreferredTeamSize(
          row["Preferred Team Size"] || row["Preferred team size"] || ""
        ),
        teamPreference: parseTeamPreference(
          row["Who do you want on your team?"] || row["Team Preference"] || ""
        ),
      };

      participants.push(participant);
      console.log(
        `✅ Added: ${participant.fullName} (prefers team size ${participant.preferredTeamSize})`
      );
    } catch (error) {
      console.error(`❌ Error parsing row ${i}:`, error);
    }
  }

  console.log(
    `🎯 Successfully parsed ${participants.length} unique participants`
  );

  // Log team size preferences for debugging
  const sizePrefs = participants.reduce((acc, p) => {
    acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  console.log("📊 Team size preferences:", sizePrefs);

  return participants;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

function parseCurrentYear(value: string): string {
  if (!value) return "First Year";
  const normalized = value.toLowerCase().trim();

  if (
    normalized.includes("pg") ||
    normalized.includes("mba") ||
    normalized.includes("masters")
  ) {
    if (
      normalized.includes("1st") ||
      normalized.includes("1") ||
      normalized.includes("first")
    ) {
      return "PG/MBA (1st Year)";
    } else {
      return "PG/MBA (2nd Year)";
    }
  }

  if (
    normalized.includes("1st") ||
    normalized.includes("1") ||
    normalized.includes("first")
  )
    return "First Year";
  if (
    normalized.includes("2nd") ||
    normalized.includes("2") ||
    normalized.includes("second")
  )
    return "Second Year";
  if (
    normalized.includes("3rd") ||
    normalized.includes("3") ||
    normalized.includes("third")
  )
    return "Third Year";
  if (
    normalized.includes("4th") ||
    normalized.includes("4") ||
    normalized.includes("fourth") ||
    normalized.includes("final")
  )
    return "Final Year";

  return "First Year";
}

function parseCoreStrengths(value: string): string[] {
  if (!value) return [];
  return value
    .split(/[;,\n]/)
    .map((s) => s.trim())
    .filter((s) => s)
    .slice(0, 3);
}

function parsePreferredRoles(value: string): string[] {
  if (!value) return ["Flexible with any role"];
  const roles = value
    .split(/[;,\n]/)
    .map((s) => s.trim())
    .filter((s) => s);
  return roles.length > 0 ? roles.slice(0, 2) : ["Flexible with any role"];
}

function parseWorkingStyle(value: string): string[] {
  if (!value) return ["I enjoy brainstorming and team sessions"];
  return value
    .split(/[;,\n]/)
    .map((s) => s.trim())
    .filter((s) => s);
}

function parseIdealTeamStructure(value: string): string {
  if (!value) return "Diverse roles and specializations";
  return value.trim() || "Diverse roles and specializations";
}

function parseLookingFor(value: string): string {
  if (!value) return "Build a new team from scratch";
  return value.trim() || "Build a new team from scratch";
}

function parseAvailability(value: string): string {
  if (!value) return "Moderately Available (5–10 hrs/week)";
  const normalized = value.toLowerCase().trim();

  if (
    normalized.includes("fully available") ||
    normalized.includes("10–15") ||
    normalized.includes("10-15")
  ) {
    return "Fully Available (10–15 hrs/week)";
  }
  if (
    normalized.includes("moderately available") ||
    normalized.includes("5–10") ||
    normalized.includes("5-10")
  ) {
    return "Moderately Available (5–10 hrs/week)";
  }
  if (
    normalized.includes("lightly available") ||
    normalized.includes("1–4") ||
    normalized.includes("1-4")
  ) {
    return "Lightly Available (1–4 hrs/week)";
  }
  if (normalized.includes("not available")) {
    return "Not available now, but interested later";
  }

  return "Moderately Available (5–10 hrs/week)";
}

function parseExperience(value: string): string {
  if (!value) return "None";
  const normalized = value.toLowerCase().trim();

  if (normalized.includes("finalist") || normalized.includes("winner")) {
    return "Finalist/Winner in at least one";
  }
  if (normalized.includes("3+") || normalized.includes("3 or more")) {
    return "Participated in 3+";
  }
  if (normalized.includes("1–2") || normalized.includes("1-2")) {
    return "Participated in 1–2";
  }

  return "None";
}

function parseWorkStyle(value: string): string {
  if (!value) return "Combination of both";
  const normalized = value.toLowerCase().trim();

  if (normalized.includes("structured") && !normalized.includes("flexible")) {
    return "Structured meetings and deadlines";
  }
  if (normalized.includes("flexible") && !normalized.includes("structured")) {
    return "Flexible work with async updates";
  }

  return "Combination of both";
}

function parseCasePreferences(value: string): string[] {
  if (!value) return ["Consulting"];
  return value
    .split(/[;,\n]/)
    .map((s) => s.trim())
    .filter((s) => s)
    .slice(0, 3);
}

function parsePreferredTeamSize(value: string): number {
  if (!value) return 4;
  const normalized = value.toLowerCase().trim();

  if (
    normalized === "2" ||
    normalized.includes("2 member") ||
    normalized.includes("two")
  )
    return 2;
  if (
    normalized === "3" ||
    normalized.includes("3 member") ||
    normalized.includes("three")
  )
    return 3;
  if (
    normalized === "4" ||
    normalized.includes("4 member") ||
    normalized.includes("four")
  )
    return 4;

  return 4;
}

function parseTeamPreference(
  value: string
): "Undergrads only" | "Postgrads only" | "Either UG or PG" {
  if (!value) return "Either UG or PG";
  const normalized = value.toLowerCase().trim();

  if (normalized.includes("undergrad") && normalized.includes("only")) {
    return "Undergrads only";
  }
  if (normalized.includes("postgrad") && normalized.includes("only")) {
    return "Postgrads only";
  }
  if (normalized.includes("pg") && normalized.includes("only")) {
    return "Postgrads only";
  }
  if (
    normalized.includes("either") ||
    normalized.includes("both") ||
    normalized.includes("any")
  ) {
    return "Either UG or PG";
  }

  // Default fallback
  return "Either UG or PG";
}

// Enhanced Iterative Team Matching Algorithm with User-Defined Team Preferences
export function matchParticipantsToTeams(
  participants: Participant[]
): MatchingResult {
  console.log(`\n=== Starting Enhanced Iterative Team Matching ===`);
  console.log(`Total participants: ${participants.length}`);

  if (participants.length < 2) {
    return {
      teams: [],
      unmatched: participants,
      statistics: generateStatistics([], participants),
    };
  }

  // Group participants by their team preference instead of automatic education level separation
  const ugOnlyParticipants = participants.filter(
    (p) => p.teamPreference === "Undergrads only"
  );
  const pgOnlyParticipants = participants.filter(
    (p) => p.teamPreference === "Postgrads only"
  );
  const eitherParticipants = participants.filter(
    (p) => p.teamPreference === "Either UG or PG"
  );

  console.log(`Team preference grouping:`);
  console.log(`  - UG only: ${ugOnlyParticipants.length} participants`);
  console.log(`  - PG only: ${pgOnlyParticipants.length} participants`);
  console.log(`  - Either UG or PG: ${eitherParticipants.length} participants`);

  // Run iterative matching for each preference group
  const ugOnlyResult = runIterativeMatching(ugOnlyParticipants, "UG-Only");
  const pgOnlyResult = runIterativeMatching(pgOnlyParticipants, "PG-Only");
  const eitherResult = runIterativeMatching(eitherParticipants, "Mixed");

  // Combine results
  const allTeams = [
    ...ugOnlyResult.teams,
    ...pgOnlyResult.teams,
    ...eitherResult.teams,
  ];
  const unmatched = [
    ...ugOnlyResult.unmatched,
    ...pgOnlyResult.unmatched,
    ...eitherResult.unmatched,
  ];

  const result: MatchingResult = {
    teams: allTeams,
    unmatched,
    statistics: generateStatistics(allTeams, unmatched),
  };

  console.log(`\n=== Final Results ===`);
  console.log(`Total teams formed: ${allTeams.length}`);
  console.log(`Total unmatched: ${unmatched.length}`);
  console.log(
    `Overall matching efficiency: ${result.statistics.matchingEfficiency.toFixed(
      1
    )}%`
  );

  return result;
}

// Iterative Matching Function - 10 iterations with strict team preference rules
function runIterativeMatching(
  participants: Participant[],
  educationLevel: string
): { teams: Team[]; unmatched: Participant[] } {
  if (participants.length === 0) {
    return { teams: [], unmatched: [] };
  }

  console.log(
    `\n--- Starting iterative matching for ${educationLevel} students ---`
  );
  console.log(`Participants to match: ${participants.length}`);

  let allTeams: Team[] = [];
  let remainingParticipants = [...participants];
  const maxIterations = 10;
  let totalParticipantsMatched = 0;

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);
    console.log(
      `Processing ${remainingParticipants.length} unmatched participants`
    );

    if (remainingParticipants.length < 2) {
      console.log(`⏹️ Stopping iteration - less than 2 participants remaining`);
      break;
    }

    // Run one iteration of team formation with STRICT team preference rules
    const iterationResult = formTeamsWithStrictPreferences(
      remainingParticipants,
      iteration
    );

    const newTeams = iterationResult.teams;
    const newlyMatchedCount = newTeams.reduce(
      (sum, team) => sum + team.members.length,
      0
    );

    if (newTeams.length === 0) {
      console.log(`⚠️ No new teams formed in iteration ${iteration}`);
      console.log(
        `🔒 STRICT MODE: No alternative matching attempted - only exact size preference matches allowed`
      );
      console.log(
        `❌ No progress possible in iteration ${iteration}, continuing to next iteration`
      );
      continue;
    }

    // Update team IDs to be unique across all iterations
    const updatedNewTeams = newTeams.map((team, index) => ({
      ...team,
      id: `${educationLevel.toLowerCase()}-team-${
        allTeams.length + index + 1
      }-iter${iteration}`,
    }));

    allTeams = [...allTeams, ...updatedNewTeams];
    remainingParticipants = iterationResult.unmatched;
    totalParticipantsMatched += newlyMatchedCount;

    console.log(`✅ Iteration ${iteration} results:`);
    console.log(`   - New teams formed: ${newTeams.length}`);
    console.log(`   - Participants matched: ${newlyMatchedCount}`);
    console.log(`   - Remaining unmatched: ${remainingParticipants.length}`);
    console.log(`   - Cumulative teams: ${allTeams.length}`);
    console.log(`   - Cumulative matched: ${totalParticipantsMatched}`);

    // Break if everyone is matched
    if (remainingParticipants.length === 0) {
      console.log(`🎉 All participants matched after ${iteration} iterations!`);
      break;
    }
  }

  const finalEfficiency =
    participants.length > 0
      ? (totalParticipantsMatched / participants.length) * 100
      : 0;
  console.log(`\n📊 ${educationLevel} Matching Summary:`);
  console.log(
    `   - Total iterations completed: ${Math.min(maxIterations, 10)}`
  );
  console.log(`   - Final teams formed: ${allTeams.length}`);
  console.log(
    `   - Final participants matched: ${totalParticipantsMatched}/${participants.length}`
  );
  console.log(`   - Final efficiency: ${finalEfficiency.toFixed(1)}%`);

  // FINAL STRICT VALIDATION: Ensure no teams violate size preference rules
  const invalidTeams = allTeams.filter((team) => {
    const sizeMatches = team.members.filter(
      (m) => m.preferredTeamSize === team.teamSize
    ).length;
    return (
      sizeMatches !== team.members.length || team.preferredTeamSizeMatch !== 100
    );
  });

  if (invalidTeams.length > 0) {
    console.error(
      `🚨 CRITICAL ERROR: Found ${invalidTeams.length} teams that violate STRICT size preferences!`
    );
    invalidTeams.forEach((team, index) => {
      console.error(
        `   Invalid Team ${index + 1}: ${team.members
          .map((m) => `${m.fullName}(${m.preferredTeamSize})`)
          .join(", ")} - Team size: ${team.teamSize}`
      );
    });

    // Remove invalid teams and add their members back to unmatched
    const validTeams = allTeams.filter((team) => !invalidTeams.includes(team));
    const invalidMembers = invalidTeams.flatMap((team) => team.members);
    const finalUnmatched = [...remainingParticipants, ...invalidMembers];

    console.error(
      `🔧 Removed ${invalidTeams.length} invalid teams, added ${invalidMembers.length} members back to unmatched`
    );
    return { teams: validTeams, unmatched: finalUnmatched };
  }

  return { teams: allTeams, unmatched: remainingParticipants };
}

// Form teams with STRICT adherence to team size preferences
function formTeamsWithStrictPreferences(
  participants: Participant[],
  iteration: number
): { teams: Team[]; unmatched: Participant[] } {
  console.log(
    `   🎯 Forming teams with strict preferences (iteration ${iteration})`
  );

  if (participants.length === 0) {
    return { teams: [], unmatched: [] };
  }

  const teams: Team[] = [];
  const availableParticipants = [...participants];

  // Sort by experience and availability for better anchor selection
  availableParticipants.sort((a, b) => {
    const expDiff =
      getExperienceScore(b.experience) - getExperienceScore(a.experience);
    if (expDiff !== 0) return expDiff;

    // Secondary sort by availability
    const availOrder = {
      "Fully Available (10–15 hrs/week)": 3,
      "Moderately Available (5–10 hrs/week)": 2,
      "Lightly Available (1–4 hrs/week)": 1,
      "Not available now, but interested later": 0,
    };
    return (
      (availOrder[b.availability as keyof typeof availOrder] || 1) - (availOrder[a.availability as keyof typeof availOrder] || 1)
    );
  });

  // Group by preferred team size - STRICT RULE
  const sizeGroups = {
    2: availableParticipants.filter((p) => p.preferredTeamSize === 2),
    3: availableParticipants.filter((p) => p.preferredTeamSize === 3),
    4: availableParticipants.filter((p) => p.preferredTeamSize === 4),
  };

  console.log(
    `   📊 Size preferences: 2-member(${sizeGroups[2].length}), 3-member(${sizeGroups[3].length}), 4-member(${sizeGroups[4].length})`
  );

  // Form teams by size with STRICT preference matching
  const sizeOrder = [4, 3, 2] as const; // Prioritize larger teams for efficiency

  for (const targetSize of sizeOrder) {
    const candidates = sizeGroups[targetSize];

    if (candidates.length >= targetSize) {
      console.log(
        `   🔨 Attempting to form ${targetSize}-member teams from ${candidates.length} candidates`
      );

      const sizeResult = formStrictTeamsBySize(
        candidates,
        targetSize,
        iteration
      );
      teams.push(...sizeResult.teams);

      console.log(
        `   ✅ Formed ${sizeResult.teams.length} teams of size ${targetSize}`
      );
    }
  }

  // Calculate remaining unmatched participants
  const matchedIds = new Set(
    teams.flatMap((team) => team.members.map((m) => m.id))
  );
  const unmatched = availableParticipants.filter((p) => !matchedIds.has(p.id));

  return { teams, unmatched };
}

// Form teams of specific size with STRICT preference rules
function formStrictTeamsBySize(
  participants: Participant[],
  targetSize: number,
  iteration: number
): { teams: Team[]; unmatched: Participant[] } {
  const teams: Team[] = [];
  const available = [...participants];

  while (available.length >= targetSize) {
    const team = createStrictOptimalTeam(available, targetSize, iteration);

    if (team && team.members.length === targetSize) {
      teams.push(team);

      // Remove team members from available list
      team.members.forEach((member) => {
        const index = available.findIndex((p) => p.id === member.id);
        if (index !== -1) {
          available.splice(index, 1);
        }
      });

      console.log(
        `     ✨ Created team: ${team.members
          .map((m) => m.fullName)
          .join(", ")}`
      );
    } else {
      console.log(
        `     ⚠️ Cannot form more teams of size ${targetSize} with current constraints`
      );
      break;
    }
  }

  return { teams, unmatched: available };
}

// REMOVED: Alternative matching strategies - STRICT MODE ONLY
// No flexible team matching allowed - only exact size preference matches
function tryAlternativeMatching(
  participants: Participant[],
  iteration: number
): { teams: Team[]; unmatched: Participant[] } {
  console.log(
    `   ❌ Alternative matching DISABLED - STRICT mode only (iteration ${iteration})`
  );
  console.log(
    `   🔒 All ${participants.length} participants remain unmatched due to strict size preference rules`
  );

  // STRICT RULE: No alternative matching - participants must match exact size preferences
  return { teams: [], unmatched: participants };
}

// REMOVED: Flexible team creation - STRICT MODE ONLY
// This function is disabled to enforce strict team size preference matching
function createFlexibleTeam(
  participants: Participant[],
  targetSize: number,
  iteration: number
): Team | null {
  console.log(`     ❌ Flexible team creation DISABLED - STRICT mode only`);
  console.log(
    `     🔒 Cannot create team with mixed size preferences: ${participants
      .map((p) => `${p.fullName}(${p.preferredTeamSize})`)
      .join(", ")}`
  );

  // STRICT RULE: No flexible teams allowed - all members must prefer exact same size
  return null;
}

// Legacy function - kept for backward compatibility but not used in iterative matching
function createTeamObject(members: Participant[]): Team {
  return createEnhancedTeamObject(members, "legacy");
}

// Create optimal team with STRICT size preference adherence and team preference compatibility
function createStrictOptimalTeam(
  participants: Participant[],
  targetSize: number,
  iteration: number
): Team | null {
  if (participants.length < targetSize) return null;

  // STRICT RULE: Only consider participants who prefer this exact team size
  const strictCandidates = participants.filter(
    (p) => p.preferredTeamSize === targetSize
  );

  if (strictCandidates.length < targetSize) {
    console.log(
      `     ❌ Not enough participants prefer size ${targetSize}: ${strictCandidates.length} available, ${targetSize} needed`
    );
    return null;
  }

  const anchor = strictCandidates[0];
  const team: Participant[] = [anchor];
  const remaining = strictCandidates.slice(1);

  console.log(
    `     🎯 Building STRICT ${targetSize}-member team with anchor: ${anchor.fullName} (team pref: ${anchor.teamPreference})`
  );

  // Add best compatible members who also prefer this team size and are compatible with team preference
  while (team.length < targetSize && remaining.length > 0) {
    let bestCandidate: Participant | null = null;
    let bestScore = -1;

    for (const candidate of remaining) {
      // STRICT CHECK: Ensure candidate prefers this team size
      if (candidate.preferredTeamSize !== targetSize) {
        continue;
      }

      // STRICT CHECK: Ensure team preference compatibility
      if (!isTeamPreferenceCompatible(team, candidate)) {
        console.log(
          `       ❌ Team preference incompatible: ${candidate.fullName} (${candidate.teamPreference}) with team`
        );
        continue;
      }

      const score = calculateEnhancedCompatibilityScore(team, candidate);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      team.push(bestCandidate);
      const index = remaining.findIndex((p) => p.id === bestCandidate.id);
      remaining.splice(index, 1);

      console.log(
        `     ✅ Added ${bestCandidate.fullName} (score: ${bestScore.toFixed(
          1
        )})`
      );
    } else {
      console.log(`     ⚠️ No more suitable candidates found for strict team`);
      break;
    }
  }

  // STRICT RULE: Only return team if it has exactly the target size AND all members prefer this size
  if (team.length === targetSize) {
    // FINAL VALIDATION: Ensure ALL members prefer this exact team size
    const allPreferCorrectSize = team.every(
      (member) => member.preferredTeamSize === targetSize
    );

    if (allPreferCorrectSize) {
      console.log(
        `     🎉 Successfully created STRICT ${targetSize}-member team with 100% size preference match`
      );
      const validatedTeam = createEnhancedTeamObject(
        team,
        `strict-iter${iteration}`
      );

      // Double-check the team size preference match should be 100%
      if (validatedTeam.preferredTeamSizeMatch !== 100) {
        console.error(
          `     🚨 CRITICAL ERROR: Team created but size preference match is ${validatedTeam.preferredTeamSizeMatch}%, not 100%!`
        );
        return null;
      }

      return validatedTeam;
    } else {
      console.error(
        `     🚨 CRITICAL ERROR: Team has ${team.length} members but not all prefer size ${targetSize}!`
      );
      team.forEach((member) => {
        console.error(
          `       - ${member.fullName}: prefers ${member.preferredTeamSize}, team size is ${targetSize}`
        );
      });
      return null;
    }
  } else {
    console.log(
      `     ❌ Failed to create STRICT team: got ${team.length} members, needed ${targetSize}`
    );
    return null;
  }
}

// STRICT compatibility scoring - team size preference and team preference are ABSOLUTE requirements
function calculateEnhancedCompatibilityScore(
  team: Participant[],
  candidate: Participant
): number {
  let score = 0;

  // 1. Team Size Preference Match (ABSOLUTE REQUIREMENT - 50 points or 0)
  const teamSizes = team.map((p) => p.preferredTeamSize);
  const avgTeamSize = teamSizes.reduce((a, b) => a + b, 0) / teamSizes.length;

  // STRICT RULE: If candidate doesn't prefer the same size as team average, score is 0
  if (Math.abs(candidate.preferredTeamSize - avgTeamSize) > 0.1) {
    console.log(
      `       ❌ STRICT REJECTION: ${candidate.fullName} prefers ${
        candidate.preferredTeamSize
      }, team average is ${avgTeamSize.toFixed(1)}`
    );
    return 0; // Immediate rejection for size mismatch
  }

  score += 50; // Points for exact size match

  // 2. Team Preference Compatibility (ABSOLUTE REQUIREMENT - 50 points or 0)
  if (!isTeamPreferenceCompatible(team, candidate)) {
    console.log(
      `       ❌ STRICT REJECTION: ${candidate.fullName} team preference incompatible`
    );
    return 0; // Immediate rejection for team preference mismatch
  }

  score += 50; // Points for team preference compatibility

  // 3. Experience Diversity (15 points)
  const teamExperiences = team.map((p) => p.experience);
  if (!teamExperiences.includes(candidate.experience)) {
    score += 15; // Bonus for different experience
  } else {
    score += 6; // Some points for same experience
  }

  // 4. Case Type Overlap (12 points)
  const teamCaseTypes = new Set(team.flatMap((p) => p.casePreferences));
  const candidateCaseTypes = new Set(candidate.casePreferences);
  const caseOverlap = Array.from(teamCaseTypes).filter((type) =>
    candidateCaseTypes.has(type)
  ).length;
  score += Math.min(12, caseOverlap * 4); // Up to 12 points for case overlap

  // 5. Skill Complementarity (10 points)
  const teamSkills = new Set(team.flatMap((p) => p.coreStrengths));
  const candidateSkills = new Set(candidate.coreStrengths);
  const skillOverlap = Array.from(teamSkills).filter((skill) =>
    candidateSkills.has(skill)
  ).length;
  const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
  score += uniqueSkills * 3; // Bonus for unique skills

  // 6. Availability Compatibility (8 points)
  const teamAvailabilities = team.map((p) => p.availability);
  const availabilityMatch = teamAvailabilities.some((avail) =>
    isAvailabilityCompatible(avail, candidate.availability)
  );
  if (availabilityMatch) {
    score += 8;
  }

  // 7. Role Diversity (6 points)
  const teamRoles = new Set(team.flatMap((p) => p.preferredRoles));
  const candidateRoles = new Set(candidate.preferredRoles);
  const roleOverlap = Array.from(teamRoles).filter((role) =>
    candidateRoles.has(role)
  ).length;
  const uniqueRoles = candidate.preferredRoles.length - roleOverlap;
  score += uniqueRoles * 2;

  // 8. Work Style Compatibility (4 points)
  const teamWorkStyles = team.map((p) => p.workStyle || "Combination of both");
  const workStyleMatch = teamWorkStyles.includes(
    candidate.workStyle || "Combination of both"
  );
  if (workStyleMatch) {
    score += 4;
  }

  console.log(
    `       ✅ STRICT compatibility score for ${
      candidate.fullName
    }: ${score.toFixed(1)} (size: ${candidate.preferredTeamSize}, team pref: ${
      candidate.teamPreference
    })`
  );
  return Math.max(0, score);
}

// Check availability compatibility
function isAvailabilityCompatible(avail1: string, avail2: string): boolean {
  const getLevel = (availability: string): number => {
    if (availability.includes("Fully Available")) return 3;
    if (availability.includes("Moderately Available")) return 2;
    if (availability.includes("Lightly Available")) return 1;
    return 0;
  };

  const level1 = getLevel(avail1);
  const level2 = getLevel(avail2);

  // Compatible if within 1 level of each other
  return Math.abs(level1 - level2) <= 1;
}

// Check team preference compatibility
function isTeamPreferenceCompatible(
  team: Participant[],
  candidate: Participant
): boolean {
  if (team.length === 0) return true;

  // Helper function to determine if a participant is UG or PG
  const isPostgrad = (p: Participant): boolean => {
    return p.currentYear.includes("PG") || p.currentYear.includes("MBA");
  };

  // Get team's education levels
  const teamHasUG = team.some((p) => !isPostgrad(p));
  const teamHasPG = team.some((p) => isPostgrad(p));
  const candidateIsPG = isPostgrad(candidate);

  // Check each team member's preference compatibility with candidate
  for (const member of team) {
    // If member wants UG only, candidate must be UG
    if (member.teamPreference === "Undergrads only" && candidateIsPG) {
      return false;
    }

    // If member wants PG only, candidate must be PG
    if (member.teamPreference === "Postgrads only" && !candidateIsPG) {
      return false;
    }
  }

  // Check candidate's preference compatibility with existing team
  if (candidate.teamPreference === "Undergrads only" && teamHasPG) {
    return false;
  }

  if (candidate.teamPreference === "Postgrads only" && teamHasUG) {
    return false;
  }

  return true;
}

// Enhanced team object creation with detailed analysis
function createEnhancedTeamObject(
  members: Participant[],
  teamType: string = "standard"
): Team {
  const teamId = uuidv4();

  // Calculate enhanced compatibility score
  let totalScore = 0;
  let comparisons = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalScore += calculateEnhancedCompatibilityScore(
        [members[i]],
        members[j]
      );
      comparisons++;
    }
  }

  const compatibilityScore = comparisons > 0 ? totalScore / comparisons : 0;

  // Find common case types
  const allCaseTypes = members.flatMap((m) => m.casePreferences);
  const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonCaseTypes = Object.entries(caseTypeCounts)
    .filter(([_, count]) => count >= 2)
    .map(([type, _]) => type)
    .slice(0, 3);

  // Calculate average experience
  const experienceValues = {
    None: 0,
    "Participated in 1–2": 1,
    "Participated in 3+": 2,
    "Finalist/Winner in at least one": 3,
  };
  const avgExperience =
    members.reduce((sum, m) => sum + (experienceValues[m.experience as keyof typeof experienceValues] || 0), 0) /
    members.length;

  // Calculate team size preference match (CRITICAL METRIC)
  const preferredSizeMatches = members.filter(
    (m) => m.preferredTeamSize === members.length
  ).length;
  const preferredTeamSizeMatch = (preferredSizeMatches / members.length) * 100;

  // Analyze work style compatibility
  const workStyles = members.map((m) => m.workStyle || "Combination of both");
  const workStyleCounts = workStyles.reduce((acc, style) => {
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantWorkStyle =
    Object.entries(workStyleCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "Mixed styles";

  // Create skill vector for team analysis - Updated to new core strengths
  const allSkills = [
    "Research",
    "Modeling",
    "Markets",
    "Design",
    "Pitching",
    "Coordination",
    "Ideation",
    "Product",
    "Storytelling",
    "Technical",
  ];

  const skillVector = allSkills.map((skill) => {
    const count = members.filter((m) => m.coreStrengths.includes(skill)).length;
    return count / members.length; // Normalized by team size
  });

  const team: Team = {
    id: teamId,
    members,
    skillVector,
    compatibilityScore: Math.min(100, Math.max(0, compatibilityScore)),
    teamSize: members.length,
    averageExperience: avgExperience,
    commonCaseTypes,
    workStyleCompatibility: `${dominantWorkStyle} (${preferredSizeMatches}/${members.length} size match)`,
    preferredTeamSizeMatch,
  };

  // Log team creation details
  console.log(
    `     📋 Team created: ${
      members.length
    } members, ${compatibilityScore.toFixed(
      1
    )}% compatibility, ${preferredTeamSizeMatch.toFixed(0)}% size match`
  );

  return team;
}

function getExperienceScore(experience: string): number {
  const experienceValues = {
    None: 0,
    "Participated in 1–2": 1,
    "Participated in 3+": 2,
    "Finalist/Winner in at least one": 3,
  };
  return experienceValues[experience as keyof typeof experienceValues] || 0;
}

function generateStatistics(
  teams: Team[],
  unmatched: Participant[]
): MatchingResult["statistics"] {
  const totalParticipants =
    teams.reduce((sum, team) => sum + team.members.length, 0) +
    unmatched.length;
  const teamsFormed = teams.length;
  const averageTeamSize =
    teams.length > 0
      ? teams.reduce((sum, team) => sum + team.teamSize, 0) / teams.length
      : 0;
  const matchingEfficiency =
    totalParticipants > 0
      ? ((totalParticipants - unmatched.length) / totalParticipants) * 100
      : 0;

  const teamSizeDistribution = teams.reduce((acc, team) => {
    acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const caseTypeDistribution = teams.reduce((acc, team) => {
    team.commonCaseTypes.forEach((caseType) => {
      acc[caseType] = (acc[caseType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalParticipants,
    teamsFormed,
    averageTeamSize,
    matchingEfficiency,
    teamSizeDistribution,
    caseTypeDistribution,
  };
}
