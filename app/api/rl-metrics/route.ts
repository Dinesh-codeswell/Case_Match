import { NextRequest, NextResponse } from 'next/server';

// Mock RL metrics data for demonstration
const generateMockRLMetrics = () => {
  const episodes = 15;
  const learningCurve = [];
  
  for (let i = 1; i <= episodes; i++) {
    learningCurve.push({
      episode: i,
      reward: 5 + Math.random() * 8 + (i * 0.3),
      efficiency: 45 + Math.random() * 20 + (i * 2),
      satisfaction: 6 + Math.random() * 2 + (i * 0.1),
      timestamp: new Date(Date.now() - (episodes - i) * 2 * 60 * 1000).toISOString(),
      moving_average_reward: 7 + (i * 0.2),
      moving_average_efficiency: 55 + (i * 1.8)
    });
  }

  const performanceMetrics = {
    current_episode: episodes,
    total_episodes: episodes,
    best_reward: Math.max(...learningCurve.map(p => p.reward)),
    current_reward: learningCurve[learningCurve.length - 1].reward,
    average_reward: learningCurve.reduce((sum, p) => sum + p.reward, 0) / learningCurve.length,
    convergence_status: 'converging',
    exploration_rate: Math.max(0.1, 1.0 - episodes * 0.05),
    learning_rate: Math.max(0.001, 0.01 - episodes * 0.0005),
    last_improvement_episode: episodes - 2,
    training_start_time: new Date(Date.now() - episodes * 2 * 60 * 1000).toISOString(),
    estimated_completion_time: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  };

  const actionDistribution = [
    { action_type: 'match', state_category: 'high_compatibility', frequency: 85, success_rate: 0.92, average_reward: 1.4 },
    { action_type: 'match', state_category: 'medium_compatibility', frequency: 120, success_rate: 0.78, average_reward: 0.8 },
    { action_type: 'match', state_category: 'low_compatibility', frequency: 45, success_rate: 0.45, average_reward: 0.2 },
    { action_type: 'skip', state_category: 'size_mismatch', frequency: 65, success_rate: 0.88, average_reward: -0.1 },
    { action_type: 'skip', state_category: 'preference_conflict', frequency: 40, success_rate: 0.95, average_reward: -0.2 },
    { action_type: 'reassign', state_category: 'availability_issue', frequency: 25, success_rate: 0.60, average_reward: 0.3 }
  ];

  const featureImportance = [
    { feature_name: 'Team Size Preference', importance_score: 0.92, impact_on_reward: 1.8, usage_frequency: 0.95, trend: 'stable', category: 'team_preference' },
    { feature_name: 'Core Strengths Overlap', importance_score: 0.87, impact_on_reward: 1.6, usage_frequency: 0.88, trend: 'increasing', category: 'compatibility_metric' },
    { feature_name: 'Education Level Match', importance_score: 0.84, impact_on_reward: 1.4, usage_frequency: 0.92, trend: 'stable', category: 'participant_attribute' },
    { feature_name: 'Availability Compatibility', importance_score: 0.79, impact_on_reward: 1.2, usage_frequency: 0.85, trend: 'increasing', category: 'participant_attribute' }
  ];

  return {
    performance_metrics: performanceMetrics,
    learning_curve: learningCurve,
    action_distribution: actionDistribution,
    feature_importance: featureImportance,
    last_updated: new Date().toISOString(),
    is_training: true
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    const mockData = generateMockRLMetrics();

    switch (type) {
      case 'performance':
        return NextResponse.json({
          performance_metrics: mockData.performance_metrics,
          last_updated: mockData.last_updated
        });

      case 'learning_curve':
        return NextResponse.json({
          learning_curve: mockData.learning_curve,
          last_updated: mockData.last_updated
        });

      case 'actions':
        return NextResponse.json({
          action_distribution: mockData.action_distribution,
          last_updated: mockData.last_updated
        });

      case 'features':
        return NextResponse.json({
          feature_importance: mockData.feature_importance,
          last_updated: mockData.last_updated
        });

      default:
        return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Error in RL metrics API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch RL metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, session_id, participant_id, reward, q_value } = body;

    // In a real implementation, this would store the action in the database
    console.log('Recording RL action:', {
      action,
      session_id,
      participant_id,
      reward,
      q_value,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'RL action recorded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error recording RL action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to record RL action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}