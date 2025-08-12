/**
 * Practical Integration Example: RL-Enhanced Case Match
 * 
 * This file shows how to integrate the RL system with the existing
 * case match infrastructure with minimal disruption.
 */

import { Participant, Team, MatchingResult } from './case-match-types';
import { runEnhancedIterativeMatching } from './enhanced-iterative-matching';
import { RLEnhancedMatcher, createRLEnhancedMatcher, createTeamOutcome } from './reinforcement-learning-matcher';

/**
 * Enhanced API route that uses RL when available
 */
export async function enhancedCaseMatchAPI(participants: Participant[]): Promise<MatchingResult> {
  console.log('🚀 Starting Enhanced Case Match with RL capabilities...');
  
  // Initialize RL matcher with conservative settings
  const rlMatcher = createRLEnhancedMatcher({
    useRL: true,
    explorationRate: 0.15, // 15% exploration, 85% exploitation
    minTrainingData: 20,    // Need at least 20 outcomes before using RL
    updateFrequency: 7,     // Retrain weekly
    fallbackToRules: true   // Always fallback to existing system if RL fails
  });

  try {
    // Try RL-enhanced matching first
    const rlResult = await rlMatcher.enhancedMatch(participants);
    
    // If RL produced good results, use them
    if (rlResult.teams.length > 0 && rlResult.statistics.matchingEfficiency > 50) {
      console.log('✅ Using RL-enhanced matching results');
      return rlResult;
    } else {
      console.log('⚠️ RL results suboptimal, falling back to rule-based matching');
      throw new Error('RL results below threshold');
    }
    
  } catch (error) {
    console.log('🔄 RL failed, using existing rule-based system:', error.message);
    
    // Fallback to existing system
    return runEnhancedIterativeMatching(participants, {
      maxIterations: 30,
      minParticipantsPerIteration: 2,
      logLevel: 'detailed'
    });
  }
}

/**
 * Outcome collection system for learning
 */
export class OutcomeCollector {
  private rlMatcher: RLEnhancedMatcher;
  
  constructor() {
    this.rlMatcher = createRLEnhancedMatcher();
  }

  /**
   * Collect outcome from competition results
   */
  async collectCompetitionOutcome(
    team: Team,
    competitionResults: {
      ranking: number;          // 1st, 2nd, 3rd place, etc.
      totalTeams: number;       // Total teams in competition
      projectCompleted: boolean; // Did they complete the project?
      presentationQuality: number; // 1-10 rating
      teamworkRating: number;   // 1-10 rating from judges
      conflictReports: number;  // Number of conflict incidents
    },
    competitionType: string,
    duration: number
  ): Promise<void> {
    
    // Convert competition results to standardized scores
    const performanceScore = this.calculatePerformanceScore(
      competitionResults.ranking,
      competitionResults.totalTeams,
      competitionResults.presentationQuality
    );
    
    const satisfactionScore = competitionResults.teamworkRating * 10; // Convert to 0-100
    const completionRate = competitionResults.projectCompleted ? 100 : 0;
    const conflictScore = Math.min(100, competitionResults.conflictReports * 25); // 0-100 scale
    
    // Create outcome record
    const outcome = createTeamOutcome(
      team,
      performanceScore,
      satisfactionScore,
      completionRate,
      conflictScore,
      competitionType,
      duration
    );
    
    // Learn from this outcome
    await this.rlMatcher.learnFromOutcome(outcome);
    
    console.log(`📊 Learned from team ${team.id}: Performance ${performanceScore}%, Satisfaction ${satisfactionScore}%`);
  }

  /**
   * Collect outcome from participant surveys
   */
  async collectSurveyOutcome(
    team: Team,
    surveyResponses: {
      teamSatisfaction: number;     // 1-10 scale
      wouldWorkAgain: boolean;      // Would work with teammates again?
      communicationRating: number;  // 1-10 scale
      skillComplementarity: number; // 1-10 scale
      conflictLevel: number;        // 1-10 scale (higher = more conflict)
      overallExperience: number;    // 1-10 scale
    }[],
    competitionType: string,
    duration: number
  ): Promise<void> {
    
    // Aggregate survey responses
    const avgSatisfaction = this.average(surveyResponses.map(r => r.teamSatisfaction)) * 10;
    const wouldWorkAgainPercent = (surveyResponses.filter(r => r.wouldWorkAgain).length / surveyResponses.length) * 100;
    const avgCommunication = this.average(surveyResponses.map(r => r.communicationRating)) * 10;
    const avgConflict = this.average(surveyResponses.map(r => r.conflictLevel)) * 10;
    const avgExperience = this.average(surveyResponses.map(r => r.overallExperience)) * 10;
    
    // Calculate composite scores
    const performanceScore = (avgCommunication + avgExperience) / 2;
    const satisfactionScore = (avgSatisfaction + wouldWorkAgainPercent) / 2;
    const completionRate = 100; // Assume completion if survey was filled
    const conflictScore = avgConflict;
    
    // Create outcome record
    const outcome = createTeamOutcome(
      team,
      performanceScore,
      satisfactionScore,
      completionRate,
      conflictScore,
      competitionType,
      duration
    );
    
    // Learn from this outcome
    await this.rlMatcher.learnFromOutcome(outcome);
    
    console.log(`📋 Learned from survey for team ${team.id}: ${surveyResponses.length} responses processed`);
  }

  /**
   * Collect outcome from automated metrics
   */
  async collectAutomatedOutcome(
    team: Team,
    metrics: {
      slackMessages: number;        // Team communication volume
      meetingCount: number;         // Number of team meetings
      taskCompletionRate: number;   // Percentage of tasks completed
      deadlinesMet: number;         // Number of deadlines met
      totalDeadlines: number;       // Total number of deadlines
      collaborationScore: number;   // Automated collaboration metric
    },
    competitionType: string,
    duration: number
  ): Promise<void> {
    
    // Calculate scores from automated metrics
    const communicationScore = Math.min(100, (metrics.slackMessages / duration) * 10); // Messages per day
    const meetingScore = Math.min(100, (metrics.meetingCount / (duration / 7)) * 25); // Meetings per week
    const completionScore = metrics.taskCompletionRate;
    const deadlineScore = (metrics.deadlinesMet / Math.max(1, metrics.totalDeadlines)) * 100;
    
    const performanceScore = (completionScore + deadlineScore) / 2;
    const satisfactionScore = (communicationScore + meetingScore + metrics.collaborationScore) / 3;
    const completionRate = metrics.taskCompletionRate;
    const conflictScore = Math.max(0, 100 - metrics.collaborationScore); // Inverse of collaboration
    
    // Create outcome record
    const outcome = createTeamOutcome(
      team,
      performanceScore,
      satisfactionScore,
      completionRate,
      conflictScore,
      competitionType,
      duration
    );
    
    // Learn from this outcome
    await this.rlMatcher.learnFromOutcome(outcome);
    
    console.log(`🤖 Learned from automated metrics for team ${team.id}: ${metrics.taskCompletionRate}% completion rate`);
  }

  private calculatePerformanceScore(ranking: number, totalTeams: number, presentationQuality: number): number {
    // Convert ranking to 0-100 score (1st place = 100, last place = 0)
    const rankingScore = ((totalTeams - ranking) / (totalTeams - 1)) * 100;
    const presentationScore = presentationQuality * 10;
    
    // Weighted average
    return (rankingScore * 0.7) + (presentationScore * 0.3);
  }

  private average(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
}

/**
 * A/B Testing Framework for gradual RL rollout
 */
export class RLABTester {
  private rlMatcher: RLEnhancedMatcher;
  private rolloutPercentage: number;
  
  constructor(rolloutPercentage: number = 10) {
    this.rlMatcher = createRLEnhancedMatcher();
    this.rolloutPercentage = rolloutPercentage;
  }

  /**
   * Decide whether to use RL or rule-based matching for this session
   */
  shouldUseRL(sessionId: string): boolean {
    // Use hash of session ID to ensure consistent assignment
    const hash = this.simpleHash(sessionId);
    return (hash % 100) < this.rolloutPercentage;
  }

  /**
   * Enhanced matching with A/B testing
   */
  async abTestMatch(participants: Participant[], sessionId: string): Promise<{
    result: MatchingResult;
    method: 'RL' | 'Rules';
    sessionId: string;
  }> {
    
    const useRL = this.shouldUseRL(sessionId);
    
    if (useRL) {
      console.log(`🧪 A/B Test: Using RL for session ${sessionId}`);
      try {
        const result = await this.rlMatcher.enhancedMatch(participants);
        return { result, method: 'RL', sessionId };
      } catch (error) {
        console.log(`🔄 RL failed for session ${sessionId}, falling back to rules`);
        const result = await this.fallbackToRules(participants);
        return { result, method: 'Rules', sessionId };
      }
    } else {
      console.log(`🧪 A/B Test: Using Rules for session ${sessionId}`);
      const result = await this.fallbackToRules(participants);
      return { result, method: 'Rules', sessionId };
    }
  }

  /**
   * Update rollout percentage based on performance
   */
  updateRollout(newPercentage: number): void {
    console.log(`📊 Updating RL rollout from ${this.rolloutPercentage}% to ${newPercentage}%`);
    this.rolloutPercentage = Math.max(0, Math.min(100, newPercentage));
  }

  private async fallbackToRules(participants: Participant[]): Promise<MatchingResult> {
    return runEnhancedIterativeMatching(participants, {
      maxIterations: 30,
      minParticipantsPerIteration: 2,
      logLevel: 'detailed'
    });
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Performance monitoring for RL system
 */
export class RLMonitor {
  private metrics: {
    rlSuccessRate: number;
    avgCompatibilityRL: number;
    avgCompatibilityRules: number;
    rlProcessingTime: number;
    rulesProcessingTime: number;
    outcomeCount: number;
    modelVersion: string;
  } = {
    rlSuccessRate: 0,
    avgCompatibilityRL: 0,
    avgCompatibilityRules: 0,
    rlProcessingTime: 0,
    rulesProcessingTime: 0,
    outcomeCount: 0,
    modelVersion: '1.0.0'
  };

  /**
   * Track matching performance
   */
  trackMatching(method: 'RL' | 'Rules', result: MatchingResult, processingTime: number): void {
    const avgCompatibility = this.calculateAverageCompatibility(result);
    
    if (method === 'RL') {
      this.metrics.avgCompatibilityRL = this.updateAverage(this.metrics.avgCompatibilityRL, avgCompatibility);
      this.metrics.rlProcessingTime = this.updateAverage(this.metrics.rlProcessingTime, processingTime);
    } else {
      this.metrics.avgCompatibilityRules = this.updateAverage(this.metrics.avgCompatibilityRules, avgCompatibility);
      this.metrics.rulesProcessingTime = this.updateAverage(this.metrics.rulesProcessingTime, processingTime);
    }
    
    console.log(`📊 Tracking: ${method} - Compatibility: ${avgCompatibility.toFixed(1)}%, Time: ${processingTime}ms`);
  }

  /**
   * Track outcome collection
   */
  trackOutcome(outcome: any): void {
    this.metrics.outcomeCount++;
    console.log(`📈 Outcome tracked. Total outcomes: ${this.metrics.outcomeCount}`);
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const rlAdvantage = this.metrics.avgCompatibilityRL - this.metrics.avgCompatibilityRules;
    const timeOverhead = this.metrics.rlProcessingTime - this.metrics.rulesProcessingTime;
    
    return `
📊 RL Performance Report
========================
🎯 Compatibility Advantage: ${rlAdvantage.toFixed(1)}% (RL vs Rules)
⏱️ Processing Time Overhead: ${timeOverhead.toFixed(0)}ms
📈 Total Outcomes Collected: ${this.metrics.outcomeCount}
🔄 Model Version: ${this.metrics.modelVersion}

${rlAdvantage > 5 ? '✅ RL showing significant improvement' : 
  rlAdvantage > 0 ? '⚠️ RL showing marginal improvement' : 
  '❌ RL underperforming - consider adjustments'}
    `;
  }

  private calculateAverageCompatibility(result: MatchingResult): number {
    if (result.teams.length === 0) return 0;
    return result.teams.reduce((sum, team) => sum + team.compatibilityScore, 0) / result.teams.length;
  }

  private updateAverage(currentAvg: number, newValue: number): number {
    // Simple moving average (could be improved with proper tracking)
    return (currentAvg * 0.9) + (newValue * 0.1);
  }
}

/**
 * Example usage in API route
 */
export async function exampleAPIIntegration(participants: Participant[], sessionId: string) {
  const abTester = new RLABTester(25); // 25% rollout
  const monitor = new RLMonitor();
  const outcomeCollector = new OutcomeCollector();
  
  // Perform matching with A/B testing
  const startTime = Date.now();
  const { result, method } = await abTester.abTestMatch(participants, sessionId);
  const processingTime = Date.now() - startTime;
  
  // Track performance
  monitor.trackMatching(method, result, processingTime);
  
  // Log results
  console.log(monitor.generateReport());
  
  return {
    ...result,
    metadata: {
      method,
      sessionId,
      processingTime,
      modelVersion: '1.0.0'
    }
  };
}