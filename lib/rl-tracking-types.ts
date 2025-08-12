/**
 * Reinforcement Learning Tracking Types
 * Core types for monitoring RL algorithm performance
 */

export interface LearningSession {
  session_id: string;
  episode_number: number;
  total_reward: number;
  average_team_satisfaction: number;
  matching_efficiency: number;
  exploration_rate: number;
  learning_rate: number;
  timestamp: string;
  algorithm_version: string;
  participants_count: number;
  teams_formed: number;
  unmatched_count: number;
  convergence_score: number;
  training_duration_ms: number;
}

export interface RLAction {
  action_id: string;
  session_id: string;
  participant_id: string;
  action_taken: string;
  state_vector: number[];
  q_value: number;
  reward_received: number;
  timestamp: string;
  action_type: 'match' | 'skip' | 'reassign';
  confidence_score: number;
}

export interface RLMetric {
  metric_id: string;
  session_id: string;
  metric_name: string;
  metric_value: number;
  baseline_comparison: number;
  improvement_percentage: number;
  timestamp: string;
  metric_category: 'performance' | 'learning' | 'efficiency' | 'satisfaction';
}

export interface LearningCurvePoint {
  episode: number;
  reward: number;
  efficiency: number;
  satisfaction: number;
  timestamp: string;
  moving_average_reward: number;
  moving_average_efficiency: number;
}

export interface PerformanceMetrics {
  current_episode: number;
  total_episodes: number;
  best_reward: number;
  current_reward: number;
  average_reward: number;
  convergence_status: 'training' | 'converging' | 'converged' | 'diverging';
  exploration_rate: number;
  learning_rate: number;
  last_improvement_episode: number;
  training_start_time: string;
  estimated_completion_time: string;
}

export interface TeamSatisfactionFeedback {
  team_id: string;
  session_id: string;
  satisfaction_score: number; // 1-10 scale
  collaboration_rating: number; // 1-10 scale
  communication_rating: number; // 1-10 scale
  skill_complementarity: number; // 1-10 scale
  overall_success: number; // 1-10 scale
  feedback_text?: string;
  timestamp: string;
  feedback_source: 'team_lead' | 'member' | 'admin' | 'system';
}

export interface AlgorithmComparison {
  comparison_id: string;
  baseline_algorithm: string;
  rl_algorithm: string;
  test_dataset_size: number;
  baseline_efficiency: number;
  rl_efficiency: number;
  baseline_satisfaction: number;
  rl_satisfaction: number;
  improvement_percentage: number;
  statistical_significance: number;
  test_date: string;
}