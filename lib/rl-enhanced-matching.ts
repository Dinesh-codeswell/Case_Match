/**
 * RL-Enhanced Matching Integration
 * Integrates reinforcement learning tracking with existing matching algorithm
 */

import { Participant, Team, MatchingResult } from './case-match-types';
import { runEnhancedIterativeMatching } from './enhanced-iterative-matching';
import { rlMetricsService } from './rl-metrics-service';

export interface RLEnhancedMatchingOptions {
  maxIterations?: number;
  minParticipantsPerIteration?: number;
  logLevel?: 'minimal' | 'detailed' | 'verbose';
  enableRLTracking?: boolean;
  algorithmVersion?: string;
}

export interface RLEnhancedMatchingResult extends MatchingResult {
  rl_session_id?: string;
  rl_metrics?: {
    total_reward: number;
    convergence_score: number;
    exploration_rate: number;
    learning_rate: number;
    training_duration_ms: number;
  };
}

/**
 * Enhanced matching with RL tracking integration
 */
export async function runRLEnhancedMatching(
  participants: Participant[],
  options: RLEnhancedMatchingOptions = {}
): Promise<RLEnhancedMatchingResult> {
  const {
    maxIterations = 30,
    minParticipantsPerIteration = 2,
    logLevel = 'detailed',
    enableRLTracking = true,
    algorithmVersion = '1.0.0'
  } = options;

  const startTime = Date.now();
  let sessionId: string | undefined;

  try {
    // Initialize RL tracking if enabled
    if (enableRLTracking) {
      sessionId = await rlMetricsService.startLearningSession(
        participants.length,
        algorithmVersion
      );
      
      console.log(`🧠 RL Tracking enabled for session: ${sessionId}`);
    }

    // Run the enhanced matching algorithm with RL integration
    const result = await runEnhancedMatchingWithRLTracking(
      participants,
      sessionId,
      { maxIterations, minParticipantsPerIteration, logLevel }
    );

    const endTime = Date.now();
    const trainingDuration = endTime - startTime;

    // Complete RL session if tracking is enabled
    if (enableRLTracking && sessionId) {
      const averageSatisfaction = calculateAverageSatisfaction(result.teams);
      
      await rlMetricsService.completeLearningSession(
        sessionId,
        result.teams.length,
        result.unmatched.length,
        averageSatisfaction,
        trainingDuration
      );

      // Add RL metrics to result
      const performanceMetrics = rlMetricsService.getCurrentPerformanceMetrics();
      
      return {
        ...result,
        rl_session_id: sessionId,
        rl_metrics: {
          total_reward: performanceMetrics.current_reward,
          convergence_score: 0.8, // Placeholder - would be calculated based on actual convergence
          exploration_rate: performanceMetrics.exploration_rate,
          learning_rate: performanceMetrics.learning_rate,
          training_duration_ms: trainingDuration
        }
      };
    }

    return result;

  } catch (error) {
    console.error('Error in RL-enhanced matching:', error);
    
    // If RL tracking was enabled, record the error
    if (enableRLTracking && sessionId) {
      await rlMetricsService.recordMetric(
        sessionId,
        'error_occurred',
        1,
        'performance'
      );
    }

    throw error;
  }
}

/**
 * Enhanced matching with RL action tracking
 */
async function runEnhancedMatchingWithRLTracking(
  participants: Participant[],
  sessionId: string | undefined,
  options: { maxIterations: number; minParticipantsPerIteration: number; logLevel: string }
): Promise<MatchingResult> {
  
  // For now, we'll use the existing algorithm and simulate RL tracking
  // In a full RL implementation, this would be replaced with actual RL decision making
  
  const result = runEnhancedIterativeMatching(participants, options);

  // Simulate RL action tracking for each team formation decision
  if (sessionId) {
    await simulateRLActionTracking(sessionId, participants, result.teams);
  }

  return result;
}

/**
 * Simulate RL action tracking for demonstration
 * In a real RL system, this would track actual Q-learning decisions
 */
async function simulateRLActionTracking(
  sessionId: string,
  participants: Participant[],
  teams: Team[]
): Promise<void> {
  
  // Track actions for each participant
  for (const participant of participants) {
    // Create a simple state vector based on participant attributes
    const stateVector = createStateVector(participant);
    
    // Find if participant was matched
    const matchedTeam = teams.find(team => 
      team.members.some(member => member.id === participant.id)
    );

    if (matchedTeam) {
      // Simulate successful match action
      const reward = calculateMatchReward(participant, matchedTeam);
      const qValue = Math.random() * 0.8 + 0.2; // Simulate Q-value between 0.2-1.0
      
      await rlMetricsService.recordAction(
        sessionId,
        participant.id,
        `matched_to_team_${matchedTeam.id}`,
        stateVector,
        qValue,
        reward,
        'match',
        qValue // Use Q-value as confidence score
      );
    } else {
      // Simulate unmatched action
      const reward = -0.5; // Negative reward for not matching
      const qValue = Math.random() * 0.3; // Lower Q-value for unsuccessful action
      
      await rlMetricsService.recordAction(
        sessionId,
        participant.id,
        'unmatched',
        stateVector,
        qValue,
        reward,
        'skip',
        qValue
      );
    }
  }
}

/**
 * Create a state vector representation of a participant
 */
function createStateVector(participant: Participant): number[] {
  const vector: number[] = [];
  
  // Team size preference (normalized)
  vector.push(participant.preferredTeamSize / 4.0);
  
  // Education level (0 for UG, 1 for PG)
  const isPG = participant.currentYear.includes('PG') || participant.currentYear.includes('MBA');
  vector.push(isPG ? 1.0 : 0.0);
  
  // Team preference (0: UG only, 0.5: Either, 1: PG only)
  const teamPrefValue = participant.teamPreference === 'Undergrads only' ? 0.0 :
                       participant.teamPreference === 'Either UG or PG' ? 0.5 : 1.0;
  vector.push(teamPrefValue);
  
  // Availability (normalized 0-1)
  const availabilityValue = participant.availability.includes('Fully') ? 1.0 :
                           participant.availability.includes('Moderately') ? 0.67 :
                           participant.availability.includes('Lightly') ? 0.33 : 0.0;
  vector.push(availabilityValue);
  
  // Experience level (normalized 0-1)
  const experienceValue = participant.experience === 'None' ? 0.0 :
                         participant.experience.includes('1–2') ? 0.33 :
                         participant.experience.includes('3+') ? 0.67 : 1.0;
  vector.push(experienceValue);
  
  // Number of core strengths (normalized)
  vector.push(participant.coreStrengths.length / 3.0);
  
  // Number of case preferences (normalized)
  vector.push(participant.casePreferences.length / 7.0); // Assuming max 7 case types
  
  return vector;
}

/**
 * Calculate reward for a successful match
 */
function calculateMatchReward(participant: Participant, team: Team): number {
  let reward = 1.0; // Base reward for successful match
  
  // Bonus for team size preference match
  if (team.teamSize === participant.preferredTeamSize) {
    reward += 0.5;
  }
  
  // Bonus for team compatibility
  if (team.compatibilityScore > 80) {
    reward += 0.3;
  } else if (team.compatibilityScore > 60) {
    reward += 0.1;
  }
  
  // Bonus for case type alignment
  const participantCases = new Set(participant.casePreferences);
  const teamCases = new Set(team.commonCaseTypes);
  const overlap = [...participantCases].filter(x => teamCases.has(x)).length;
  reward += overlap * 0.1;
  
  return Math.min(reward, 2.0); // Cap reward at 2.0
}

/**
 * Calculate average team satisfaction for RL completion
 */
function calculateAverageSatisfaction(teams: Team[]): number {
  if (teams.length === 0) return 0;
  
  const totalSatisfaction = teams.reduce((sum, team) => {
    // Convert compatibility score to satisfaction (0-10 scale)
    return sum + (team.compatibilityScore / 10);
  }, 0);
  
  return totalSatisfaction / teams.length;
}

/**
 * Get RL performance summary for display
 */
export function getRLPerformanceSummary() {
  const metrics = rlMetricsService.getCurrentPerformanceMetrics();
  const recentSessions = rlMetricsService.getRecentSessions(5);
  const learningCurve = rlMetricsService.getLearningCurve(20);
  
  return {
    current_performance: metrics,
    recent_sessions: recentSessions,
    learning_curve: learningCurve,
    improvement_trends: {
      reward_improvement: rlMetricsService.calculateImprovement('total_reward', 10),
      efficiency_improvement: rlMetricsService.calculateImprovement('matching_efficiency', 10),
      satisfaction_improvement: rlMetricsService.calculateImprovement('team_satisfaction', 10)
    }
  };
}