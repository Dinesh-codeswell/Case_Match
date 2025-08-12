/**
 * Reinforcement Learning Metrics Collection Service
 * Handles collection, storage, and retrieval of RL performance metrics
 */

import { 
  LearningSession, 
  RLAction, 
  RLMetric, 
  LearningCurvePoint, 
  PerformanceMetrics,
  TeamSatisfactionFeedback,
  AlgorithmComparison 
} from './rl-tracking-types';

export class RLMetricsService {
  private sessions: LearningSession[] = [];
  private actions: RLAction[] = [];
  private metrics: RLMetric[] = [];
  private learningCurve: LearningCurvePoint[] = [];
  private currentSession: LearningSession | null = null;

  /**
   * Initialize a new learning session
   */
  async startLearningSession(
    participantsCount: number,
    algorithmVersion: string = '1.0.0'
  ): Promise<string> {
    const sessionId = `rl-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: LearningSession = {
      session_id: sessionId,
      episode_number: this.getNextEpisodeNumber(),
      total_reward: 0,
      average_team_satisfaction: 0,
      matching_efficiency: 0,
      exploration_rate: 1.0, // Start with full exploration
      learning_rate: 0.01,
      timestamp: new Date().toISOString(),
      algorithm_version: algorithmVersion,
      participants_count: participantsCount,
      teams_formed: 0,
      unmatched_count: 0,
      convergence_score: 0,
      training_duration_ms: 0
    };

    this.sessions.push(session);
    this.currentSession = session;

    console.log(`🚀 Started RL Learning Session: ${sessionId}`);
    console.log(`   - Episode: ${session.episode_number}`);
    console.log(`   - Participants: ${participantsCount}`);
    console.log(`   - Algorithm Version: ${algorithmVersion}`);

    return sessionId;
  }

  /**
   * Record an RL action taken during matching
   */
  async recordAction(
    sessionId: string,
    participantId: string,
    actionTaken: string,
    stateVector: number[],
    qValue: number,
    reward: number,
    actionType: 'match' | 'skip' | 'reassign' = 'match',
    confidenceScore: number = 0.5
  ): Promise<void> {
    const action: RLAction = {
      action_id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      session_id: sessionId,
      participant_id: participantId,
      action_taken: actionTaken,
      state_vector: stateVector,
      q_value: qValue,
      reward_received: reward,
      timestamp: new Date().toISOString(),
      action_type: actionType,
      confidence_score: confidenceScore
    };

    this.actions.push(action);

    // Update session total reward
    if (this.currentSession && this.currentSession.session_id === sessionId) {
      this.currentSession.total_reward += reward;
    }
  }

  /**
   * Complete a learning session with final metrics
   */
  async completeLearningSession(
    sessionId: string,
    teamsFormed: number,
    unmatchedCount: number,
    averageSatisfaction: number,
    trainingDurationMs: number
  ): Promise<void> {
    const session = this.sessions.find(s => s.session_id === sessionId);
    if (!session) {
      throw new Error(`Learning session ${sessionId} not found`);
    }

    // Calculate final metrics
    const matchingEfficiency = session.participants_count > 0 
      ? ((session.participants_count - unmatchedCount) / session.participants_count) * 100 
      : 0;

    const convergenceScore = this.calculateConvergenceScore(session);

    // Update session with final results
    session.teams_formed = teamsFormed;
    session.unmatched_count = unmatchedCount;
    session.matching_efficiency = matchingEfficiency;
    session.average_team_satisfaction = averageSatisfaction;
    session.convergence_score = convergenceScore;
    session.training_duration_ms = trainingDurationMs;

    // Add to learning curve
    const curvePoint: LearningCurvePoint = {
      episode: session.episode_number,
      reward: session.total_reward,
      efficiency: matchingEfficiency,
      satisfaction: averageSatisfaction,
      timestamp: new Date().toISOString(),
      moving_average_reward: this.calculateMovingAverage('reward', 10),
      moving_average_efficiency: this.calculateMovingAverage('efficiency', 10)
    };

    this.learningCurve.push(curvePoint);

    // Record key metrics
    await this.recordMetric(sessionId, 'total_reward', session.total_reward, 'performance');
    await this.recordMetric(sessionId, 'matching_efficiency', matchingEfficiency, 'efficiency');
    await this.recordMetric(sessionId, 'team_satisfaction', averageSatisfaction, 'satisfaction');
    await this.recordMetric(sessionId, 'convergence_score', convergenceScore, 'learning');

    console.log(`✅ Completed RL Learning Session: ${sessionId}`);
    console.log(`   - Total Reward: ${session.total_reward.toFixed(2)}`);
    console.log(`   - Matching Efficiency: ${matchingEfficiency.toFixed(1)}%`);
    console.log(`   - Average Satisfaction: ${averageSatisfaction.toFixed(2)}`);
    console.log(`   - Convergence Score: ${convergenceScore.toFixed(3)}`);

    this.currentSession = null;
  }

  /**
   * Record a specific metric
   */
  async recordMetric(
    sessionId: string,
    metricName: string,
    value: number,
    category: 'performance' | 'learning' | 'efficiency' | 'satisfaction',
    baselineValue?: number
  ): Promise<void> {
    const baseline = baselineValue || this.getBaselineValue(metricName);
    const improvement = baseline > 0 ? ((value - baseline) / baseline) * 100 : 0;

    const metric: RLMetric = {
      metric_id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      session_id: sessionId,
      metric_name: metricName,
      metric_value: value,
      baseline_comparison: baseline,
      improvement_percentage: improvement,
      timestamp: new Date().toISOString(),
      metric_category: category
    };

    this.metrics.push(metric);
  }

  /**
   * Get current performance metrics
   */
  getCurrentPerformanceMetrics(): PerformanceMetrics {
    const totalEpisodes = this.sessions.length;
    const currentEpisode = totalEpisodes;
    
    const rewards = this.sessions.map(s => s.total_reward);
    const bestReward = Math.max(...rewards, 0);
    const currentReward = rewards[rewards.length - 1] || 0;
    const averageReward = rewards.length > 0 ? rewards.reduce((a, b) => a + b, 0) / rewards.length : 0;

    const convergenceStatus = this.determineConvergenceStatus();
    const lastImprovementEpisode = this.findLastImprovementEpisode();

    return {
      current_episode: currentEpisode,
      total_episodes: totalEpisodes,
      best_reward: bestReward,
      current_reward: currentReward,
      average_reward: averageReward,
      convergence_status: convergenceStatus,
      exploration_rate: this.currentSession?.exploration_rate || 0,
      learning_rate: this.currentSession?.learning_rate || 0,
      last_improvement_episode: lastImprovementEpisode,
      training_start_time: this.sessions[0]?.timestamp || new Date().toISOString(),
      estimated_completion_time: this.estimateCompletionTime()
    };
  }

  /**
   * Get learning curve data for visualization
   */
  getLearningCurve(episodes?: number): LearningCurvePoint[] {
    if (episodes) {
      return this.learningCurve.slice(-episodes);
    }
    return this.learningCurve;
  }

  /**
   * Get recent sessions for analysis
   */
  getRecentSessions(count: number = 10): LearningSession[] {
    return this.sessions.slice(-count);
  }

  /**
   * Get actions for a specific session
   */
  getSessionActions(sessionId: string): RLAction[] {
    return this.actions.filter(action => action.session_id === sessionId);
  }

  /**
   * Get metrics for a specific session
   */
  getSessionMetrics(sessionId: string): RLMetric[] {
    return this.metrics.filter(metric => metric.session_id === sessionId);
  }

  /**
   * Calculate algorithm improvement over baseline
   */
  calculateImprovement(metricName: string, episodes: number = 10): number {
    const recentMetrics = this.metrics
      .filter(m => m.metric_name === metricName)
      .slice(-episodes);

    if (recentMetrics.length === 0) return 0;

    const averageImprovement = recentMetrics.reduce((sum, m) => sum + m.improvement_percentage, 0) / recentMetrics.length;
    return averageImprovement;
  }

  // Private helper methods
  private getNextEpisodeNumber(): number {
    return this.sessions.length + 1;
  }

  private calculateConvergenceScore(session: LearningSession): number {
    // Simple convergence score based on reward stability
    const recentRewards = this.sessions.slice(-5).map(s => s.total_reward);
    if (recentRewards.length < 3) return 0;

    const variance = this.calculateVariance(recentRewards);
    const mean = recentRewards.reduce((a, b) => a + b, 0) / recentRewards.length;
    
    // Lower variance relative to mean indicates better convergence
    return mean > 0 ? Math.max(0, 1 - (variance / (mean * mean))) : 0;
  }

  private calculateMovingAverage(metric: 'reward' | 'efficiency', window: number): number {
    const values = metric === 'reward' 
      ? this.sessions.slice(-window).map(s => s.total_reward)
      : this.sessions.slice(-window).map(s => s.matching_efficiency);

    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private getBaselineValue(metricName: string): number {
    // Default baseline values for comparison
    const baselines: { [key: string]: number } = {
      'total_reward': 100,
      'matching_efficiency': 60,
      'team_satisfaction': 7.0,
      'convergence_score': 0.5
    };
    return baselines[metricName] || 0;
  }

  private determineConvergenceStatus(): 'training' | 'converging' | 'converged' | 'diverging' {
    if (this.sessions.length < 5) return 'training';

    const recentRewards = this.sessions.slice(-5).map(s => s.total_reward);
    const trend = this.calculateTrend(recentRewards);
    const variance = this.calculateVariance(recentRewards);

    if (variance < 0.01 && trend > -0.01) return 'converged';
    if (variance < 0.1 && trend > 0) return 'converging';
    if (trend < -0.1) return 'diverging';
    return 'training';
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg;
  }

  private findLastImprovementEpisode(): number {
    if (this.sessions.length < 2) return 0;

    for (let i = this.sessions.length - 1; i > 0; i--) {
      if (this.sessions[i].total_reward > this.sessions[i - 1].total_reward) {
        return this.sessions[i].episode_number;
      }
    }
    return 0;
  }

  private estimateCompletionTime(): string {
    // Simple estimation based on convergence rate
    const convergenceStatus = this.determineConvergenceStatus();
    const now = new Date();
    
    switch (convergenceStatus) {
      case 'converged':
        return now.toISOString();
      case 'converging':
        return new Date(now.getTime() + 5 * 60 * 1000).toISOString(); // 5 minutes
      case 'training':
        return new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 minutes
      default:
        return new Date(now.getTime() + 30 * 60 * 1000).toISOString(); // 30 minutes
    }
  }
}

// Singleton instance for global use
export const rlMetricsService = new RLMetricsService();