import { v4 as uuidv4 } from 'uuid';
import { Participant, CoreStrength, PreferredRole, CaseType, TeamPreference } from './case-match-types';

export async function parseCSVToParticipants(csvData: string): Promise<Participant[]> {
  return new Promise((resolve, reject) => {
    try {
      const participants = parseCSV(csvData);
      resolve(participants);
    } catch (error) {
      reject(error);
    }
  });
}

export function parseCSV(csvContent: string): Participant[] {
  console.log('🔍 Starting enhanced CSV parsing with robust header mapping...');
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const participants: Participant[] = [];
  const seenEmails = new Set<string>();

  console.log(`📊 CSV Headers (${headers.length}):`, headers);
  console.log(`📝 Processing ${lines.length - 1} data rows...`);

  // Create enhanced header mapping for robustness
  const headerMap = createEnhancedHeaderMap(headers);
  console.log('🗺️ Header mapping created:', headerMap);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCSVLine(line);
      if (values.length < Math.min(headers.length, 8)) {
        console.warn(`⚠️ Skipping row ${i}: insufficient data (${values.length} values)`);
        continue;
      }

      const row: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Use enhanced header mapping to get values
      const fullName = getValueFromRow(row, headerMap.fullName) || '';
      const email = getValueFromRow(row, headerMap.email) || '';

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
        whatsappNumber: getValueFromRow(row, headerMap.whatsappNumber) || '',
        collegeName: getValueFromRow(row, headerMap.collegeName) || '',
        currentYear: parseCurrentYear(getValueFromRow(row, headerMap.currentYear) || ''),
        coreStrengths: parseCoreStrengths(getValueFromRow(row, headerMap.coreStrengths) || ''),
        preferredRoles: parsePreferredRoles(getValueFromRow(row, headerMap.preferredRoles) || ''),
        workingStyle: parseWorkingStyle(getValueFromRow(row, headerMap.workingStyle) || ''),
        idealTeamStructure: parseIdealTeamStructure(getValueFromRow(row, headerMap.idealTeamStructure) || ''),
        lookingFor: parseLookingFor(getValueFromRow(row, headerMap.lookingFor) || ''),
        availability: parseAvailability(getValueFromRow(row, headerMap.availability) || ''),
        experience: parseExperience(getValueFromRow(row, headerMap.experience) || ''),
        workStyle: parseWorkStyle(getValueFromRow(row, headerMap.workStyle) || ''),
        casePreferences: parseCasePreferences(getValueFromRow(row, headerMap.casePreferences) || ''),
        preferredTeamSize: parsePreferredTeamSize(getValueFromRow(row, headerMap.preferredTeamSize) || ''),
        teamPreference: parseTeamPreference(getValueFromRow(row, headerMap.teamPreference) || '')
      };

      participants.push(participant);
      console.log(`✅ Added: ${participant.fullName} (prefers team size ${participant.preferredTeamSize}, availability: ${participant.availability})`);
    } catch (error) {
      console.error(`❌ Error parsing row ${i}:`, error);
    }
  }

  console.log(`🎯 Successfully parsed ${participants.length} unique participants`);
  
  // Log team size preferences for debugging
  const sizePrefs = participants.reduce((acc, p) => {
    acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  console.log('📊 Team size preferences:', sizePrefs);
  
  return participants;
}

function createEnhancedHeaderMap(headers: string[]): { [key: string]: string[] } {
  const headerLower = headers.map(h => h.toLowerCase().trim());
  
  return {
    fullName: findHeaderVariations(headerLower, ['full name', 'name', 'fullname']),
    email: findHeaderVariations(headerLower, ['email id', 'email', 'email address']),
    whatsappNumber: findHeaderVariations(headerLower, ['whatsapp number', 'whatsapp', 'phone', 'contact']),
    collegeName: findHeaderVariations(headerLower, ['college name', 'college', 'institution', 'university']),
    currentYear: findHeaderVariations(headerLower, ['current year of study', 'current year', 'course', 'year', 'study year']),
    coreStrengths: findHeaderVariations(headerLower, ['top 3 core strengths', 'your top 3 core strengths', 'core strengths', 'strengths', 'skills']),
    preferredRoles: findHeaderVariations(headerLower, ['preferred role(s)', 'preferred role(s) in a team', 'preferred roles', 'roles']),
    workingStyle: findHeaderVariations(headerLower, ['working style preferences', 'work style preferences', 'working style']),
    idealTeamStructure: findHeaderVariations(headerLower, ['ideal team structure', 'team structure', 'structure']),
    lookingFor: findHeaderVariations(headerLower, ['looking for', 'what are you looking for', 'seeking']),
    availability: findHeaderVariations(headerLower, [
      'availability (next 2–4 weeks)', 
      'availability (next 2-4 weeks)',
      'your availability for case comps (next 2–4 weeks)',
      'availability', 
      'available'
    ]),
    experience: findHeaderVariations(headerLower, [
      'previous case comp experience', 
      'previous case competition experience',
      'previous case comp',
      'experience', 
      'case experience'
    ]),
    workStyle: findHeaderVariations(headerLower, ['work style', 'working style', 'style']),
    casePreferences: findHeaderVariations(headerLower, [
      'case comp preferences',
      'which type(s) of case competitions are you most interested in?',
      'case preferences',
      'preferences',
      'interests'
    ]),
    preferredTeamSize: findHeaderVariations(headerLower, ['preferred team size', 'preferred team size', 'team size', 'size']),
    teamPreference: findHeaderVariations(headerLower, ['who do you want on your team?', 'team preference', 'preference'])
  };
}

function findHeaderVariations(headerLower: string[], variations: string[]): string[] {
  const matches: string[] = [];
  for (const variation of variations) {
    const index = headerLower.findIndex(h => h.includes(variation) || variation.includes(h));
    if (index !== -1) {
      matches.push(headerLower[index]);
    }
  }
  return matches;
}

function getValueFromRow(row: { [key: string]: string }, possibleHeaders: string[]): string {
  for (const header of possibleHeaders) {
    // Try exact match first
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase().trim() === header) {
        return value;
      }
    }
    // Try partial match
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase().includes(header) || header.includes(key.toLowerCase())) {
        return value;
      }
    }
  }
  return '';
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseCurrentYear(value: string): Participant['currentYear'] {
  if (!value) return 'First Year';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('pg') || 
      normalized.includes('mba') || 
      normalized.includes('masters') || 
      normalized.includes('master') ||
      normalized.includes('postgraduate') ||
      normalized.includes('post graduate')) {
    
    if (normalized.includes('1st') || normalized.includes('1') || normalized.includes('first')) {
      return 'PG/MBA (1st Year)';
    } else {
      return 'PG/MBA (2nd Year)';
    }
  }
  
  if (normalized.includes('1st') || normalized.includes('1') || normalized.includes('first')) return 'First Year';
  if (normalized.includes('2nd') || normalized.includes('2') || normalized.includes('second')) return 'Second Year';
  if (normalized.includes('3rd') || normalized.includes('3') || normalized.includes('third')) return 'Third Year';
  if (normalized.includes('4th') || normalized.includes('4') || normalized.includes('fourth') || normalized.includes('final')) return 'Final Year';
  
  return 'First Year';
}

function parseCoreStrengths(value: string): CoreStrength[] {
  if (!value) return [];
  const strengths = value.split(/[;,\n]/).map(s => s.trim());
  const validStrengths: CoreStrength[] = [];
  
  const strengthMap: { [key: string]: CoreStrength } = {
    // New simplified core strengths
    'research': 'Research',
    'modeling': 'Modeling',
    'markets': 'Markets',
    'design': 'Design',
    'pitching': 'Pitching',
    'coordination': 'Coordination',
    'ideation': 'Ideation',
    'product': 'Product',
    'storytelling': 'Storytelling',
    'technical': 'Technical',
    
    // Legacy mappings for backward compatibility
    'strategy & structuring': 'Research',
    'strategy and structuring': 'Research',
    'data analysis & research': 'Research',
    'data analysis and research': 'Research',
    'financial modeling': 'Modeling',
    'market research': 'Markets',
    'presentation design (ppt/canva)': 'Design',
    'presentation design': 'Design',
    'public speaking & pitching': 'Pitching',
    'public speaking and pitching': 'Pitching',
    'time management & coordination': 'Coordination',
    'time management and coordination': 'Coordination',
    'innovation & ideation': 'Ideation',
    'innovation and ideation': 'Ideation',
    'ui/ux or product thinking': 'Product',
    'ui/ux': 'Product',
    'product thinking': 'Product',
    'technical (coding, app dev, automation)': 'Technical',
    'coding': 'Technical'
  };

  strengths.forEach(strength => {
    const normalized = strength.toLowerCase().trim();
    if (strengthMap[normalized]) {
      if (!validStrengths.includes(strengthMap[normalized])) {
        validStrengths.push(strengthMap[normalized]);
      }
    }
  });

  return validStrengths.slice(0, 3);
}

function parsePreferredRoles(value: string): PreferredRole[] {
  if (!value) return ['Flexible with any role'];
  const roles = value.split(/[;,\n]/).map(s => s.trim());
  const validRoles: PreferredRole[] = [];
  
  const roleMap: { [key: string]: PreferredRole } = {
    'team lead': 'Team Lead',
    'team leader': 'Team Lead',
    'leader': 'Team Lead',
    'researcher': 'Researcher',
    'data analyst': 'Data Analyst',
    'analyst': 'Data Analyst',
    'designer': 'Designer',
    'presenter': 'Presenter',
    'coordinator': 'Coordinator',
    'flexible with any role': 'Flexible with any role',
    'flexible': 'Flexible with any role',
    'any role': 'Flexible with any role'
  };

  roles.forEach(role => {
    const normalized = role.toLowerCase().trim();
    if (roleMap[normalized]) {
      if (!validRoles.includes(roleMap[normalized])) {
        validRoles.push(roleMap[normalized]);
      }
    }
  });

  return validRoles.length > 0 ? validRoles.slice(0, 2) : ['Flexible with any role'];
}

function parseWorkingStyle(value: string): Participant['workingStyle'] {
  if (!value) return ['I enjoy brainstorming and team sessions', 'I prefer clearly divided responsibilities'];
  
  const styles = value.split(/[;,\n]/).map(s => s.trim());
  const validStyles: Participant['workingStyle'] = [];
  
  styles.forEach(style => {
    const normalized = style.toLowerCase().trim();
    if (normalized.includes('owning') || normalized.includes('start to finish')) {
      if (!validStyles.includes('I like owning a task from start to finish')) {
        validStyles.push('I like owning a task from start to finish');
      }
    }
    if (normalized.includes('divided') || normalized.includes('clear responsibilities')) {
      if (!validStyles.includes('I prefer clearly divided responsibilities')) {
        validStyles.push('I prefer clearly divided responsibilities');
      }
    }
    if (normalized.includes('brainstorming') || normalized.includes('team sessions')) {
      if (!validStyles.includes('I enjoy brainstorming and team sessions')) {
        validStyles.push('I enjoy brainstorming and team sessions');
      }
    }
    if (normalized.includes('independently') || normalized.includes('regular updates')) {
      if (!validStyles.includes('I prefer working independently with regular updates')) {
        validStyles.push('I prefer working independently with regular updates');
      }
    }
    if (normalized.includes('representing') || normalized.includes('presenting')) {
      if (!validStyles.includes('I like representing and presenting for the team')) {
        validStyles.push('I like representing and presenting for the team');
      }
    }
    if (normalized.includes('backstage') || normalized.includes('high-quality input')) {
      if (!validStyles.includes('I prefer backstage roles but ensure high-quality input')) {
        validStyles.push('I prefer backstage roles but ensure high-quality input');
      }
    }
  });

  return validStyles.length > 0 ? validStyles : ['I enjoy brainstorming and team sessions', 'I prefer clearly divided responsibilities'];
}

function parseIdealTeamStructure(value: string): Participant['idealTeamStructure'] {
  if (!value) return 'Diverse roles and specializations';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('similar') || normalized.includes('same')) {
    return 'Similar skillsets across all members';
  }
  if (normalized.includes('diverse') || normalized.includes('specialization')) {
    return 'Diverse roles and specializations';
  }
  if (normalized.includes('flexible') || normalized.includes('any structure')) {
    return 'Flexible with any structure';
  }
  
  return 'Diverse roles and specializations';
}

function parseLookingFor(value: string): Participant['lookingFor'] {
  if (!value) return 'Build a new team from scratch';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('new team') || normalized.includes('scratch')) {
    return 'Build a new team from scratch';
  }
  if (normalized.includes('join') || normalized.includes('existing')) {
    return 'Join an existing team';
  }
  if (normalized.includes('both') || normalized.includes('either')) {
    return 'Open to both options';
  }
  
  return 'Build a new team from scratch';
}

function parseAvailability(value: string): Participant['availability'] {
  if (!value) return 'Moderately Available (5–10 hrs/week)';
  const normalized = value.toLowerCase().trim();
  
  // Handle test CSV formats like "Full –", "Light –", "Moderate –"
  if (normalized.includes('full') || 
      normalized.includes('fully available') || 
      normalized.includes('10–15') || 
      normalized.includes('10-15') ||
      normalized.includes('15') ||
      normalized.includes('high') ||
      normalized.includes('very available')) {
    return 'Fully Available (10–15 hrs/week)';
  }
  if (normalized.includes('moderate') ||
      normalized.includes('moderately available') || 
      normalized.includes('5–10') || 
      normalized.includes('5-10')) {
    return 'Moderately Available (5–10 hrs/week)';
  }
  if (normalized.includes('light') ||
      normalized.includes('lightly available') || 
      normalized.includes('1–4') || 
      normalized.includes('1-4') ||
      normalized.includes('limited') ||
      normalized.includes('low priority')) {
    return 'Lightly Available (1–4 hrs/week)';
  }
  if (normalized.includes('not available') || 
      normalized.includes('interested later') ||
      normalized.includes('busy')) {
    return 'Not available now, but interested later';
  }
  
  return 'Moderately Available (5–10 hrs/week)';
}

function parseExperience(value: string): Participant['experience'] {
  if (!value) return 'None';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('finalist') || 
      normalized.includes('winner') ||
      normalized.includes('won') ||
      normalized.includes('first place')) {
    return 'Finalist/Winner in at least one';
  }
  if (normalized.includes('3+') || 
      normalized.includes('3 or more') ||
      normalized.includes('more than 3') ||
      normalized.includes('multiple') ||
      normalized.includes('many')) {
    return 'Participated in 3+';
  }
  if (normalized.includes('1–2') || 
      normalized.includes('1-2') ||
      normalized.includes('1 to 2') ||
      normalized.includes('couple') ||
      normalized.includes('few')) {
    return 'Participated in 1–2';
  }
  if (normalized.includes('none') || 
      normalized.includes('no') ||
      normalized.includes('never') ||
      normalized.includes('first time')) {
    return 'None';
  }
  
  return 'None';
}

function parseWorkStyle(value: string): Participant['workStyle'] {
  if (!value) return 'Combination of both';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('structured') && normalized.includes('deadlines') && !normalized.includes('flexible')) {
    return 'Structured meetings and deadlines';
  }
  if (normalized.includes('flexible') && normalized.includes('async') && !normalized.includes('structured')) {
    return 'Flexible work with async updates';
  }
  if (normalized.includes('combination') || 
      normalized.includes('both') ||
      normalized.includes('mix') ||
      (normalized.includes('structured') && normalized.includes('flexible'))) {
    return 'Combination of both';
  }
  
  return 'Combination of both';
}

function parseCasePreferences(value: string): CaseType[] {
  if (!value) return ['Consulting'];
  
  // Handle "I'm open to all" case
  if (value.toLowerCase().includes("i'm open to all") || value.toLowerCase().includes("open to all")) {
    return ['Consulting', 'Product/Tech', 'Marketing'];
  }
  
  const preferences = value.split(/[;,\n]/).map(s => s.trim());
  const validPreferences: CaseType[] = [];
  
  const preferenceMap: { [key: string]: CaseType } = {
    'consulting': 'Consulting',
    'product/tech': 'Product/Tech',
    'product': 'Product/Tech',
    'tech': 'Product/Tech',
    'technology': 'Product/Tech',
    'marketing': 'Marketing',
    'social impact': 'Social Impact',
    'social': 'Social Impact',
    'impact': 'Social Impact',
    'operations/supply chain': 'Operations/Supply Chain',
    'operations': 'Operations/Supply Chain',
    'supply chain': 'Operations/Supply Chain',
    'finance': 'Finance',
    'financial': 'Finance',
    'public policy/esg': 'Public Policy/ESG',
    'public policy': 'Public Policy/ESG',
    'esg': 'Public Policy/ESG',
    'policy': 'Public Policy/ESG'
  };

  preferences.forEach(preference => {
    const normalized = preference.toLowerCase().trim();
    if (preferenceMap[normalized]) {
      if (!validPreferences.includes(preferenceMap[normalized])) {
        validPreferences.push(preferenceMap[normalized]);
      }
    }
  });

  return validPreferences.length > 0 ? validPreferences.slice(0, 3) : ['Consulting'];
}

function parsePreferredTeamSize(value: string): 2 | 3 | 4 {
  if (!value) return 4;
  const normalized = value.toLowerCase().trim();
  
  if (normalized === '2' || 
      normalized.includes('2 member') || 
      normalized.includes('two') ||
      normalized.includes('pair')) return 2;
  if (normalized === '3' || 
      normalized.includes('3 member') || 
      normalized.includes('three') ||
      normalized.includes('trio')) return 3;
  if (normalized === '4' || 
      normalized.includes('4 member') || 
      normalized.includes('four') ||
      normalized.includes('quad')) return 4;
      
  return 4;
}

function parseTeamPreference(value: string): 'Undergrads only' | 'Postgrads only' | 'Either UG or PG' {
  if (!value) return 'Either UG or PG';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('undergrad') && normalized.includes('only')) {
    return 'Undergrads only';
  }
  if (normalized.includes('postgrad') && normalized.includes('only')) {
    return 'Postgrads only';
  }
  if (normalized.includes('pg') && normalized.includes('only')) {
    return 'Postgrads only';
  }
  if (normalized.includes('mix') || normalized.includes('either') || normalized.includes('both') || normalized.includes('any') || normalized.includes('ug & pg') || normalized.includes('ug and pg')) {
    return 'Either UG or PG';
  }
  
  // Default fallback
  return 'Either UG or PG';
}