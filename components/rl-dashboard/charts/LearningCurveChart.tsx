'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LearningCurvePoint {
  episode: number;
  reward: number;
  efficiency: number;
  satisfaction: number;
  timestamp: string;
  moving_average_reward: number;
  moving_average_efficiency: number;
}

interface LearningCurveChartProps {
  data: LearningCurvePoint[];
  height?: number;
  showMovingAverage?: boolean;
  showEfficiency?: boolean;
  showSatisfaction?: boolean;
  autoScale?: boolean;
}

const LearningCurveChart: React.FC<LearningCurveChartProps> = ({
  data,
  height = 300,
  showMovingAverage = true,
  showEfficiency = true,
  showSatisfaction = false,
  autoScale = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<LearningCurvePoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawChart();
  }, [data, showMovingAverage, showEfficiency, showSatisfaction]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const chartHeight = rect.height;
    const padding = { top: 20, right: 60, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, chartHeight);

    // Calculate scales
    const minEpisode = Math.min(...data.map(d => d.episode));
    const maxEpisode = Math.max(...data.map(d => d.episode));
    const minReward = autoScale ? Math.min(...data.map(d => d.reward)) : 0;
    const maxReward = autoScale ? Math.max(...data.map(d => d.reward)) : Math.max(...data.map(d => d.reward));
    const minEfficiency = 0;
    const maxEfficiency = 100;

    const xScale = (episode: number) => padding.left + ((episode - minEpisode) / (maxEpisode - minEpisode)) * chartWidth;
    const yScaleReward = (reward: number) => padding.top + ((maxReward - reward) / (maxReward - minReward)) * innerHeight;
    const yScaleEfficiency = (efficiency: number) => padding.top + ((maxEfficiency - efficiency) / (maxEfficiency - minEfficiency)) * innerHeight;

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, chartHeight - padding.bottom);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding.top + (i / 10) * innerHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, chartHeight - padding.bottom);
    ctx.lineTo(width - padding.right, chartHeight - padding.bottom);
    ctx.stroke();

    // Draw reward line
    if (data.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = xScale(point.episode);
        const y = yScaleReward(point.reward);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw reward points
      ctx.fillStyle = '#3b82f6';
      data.forEach(point => {
        const x = xScale(point.episode);
        const y = yScaleReward(point.reward);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw moving average line
    if (showMovingAverage && data.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = xScale(point.episode);
        const y = yScaleReward(point.moving_average_reward);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw efficiency line (secondary axis)
    if (showEfficiency && data.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = xScale(point.episode);
        const y = yScaleEfficiency(point.efficiency);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw efficiency points
      ctx.fillStyle = '#f59e0b';
      data.forEach(point => {
        const x = xScale(point.episode);
        const y = yScaleEfficiency(point.efficiency);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const episode = minEpisode + (i / 5) * (maxEpisode - minEpisode);
      const x = padding.left + (i / 5) * chartWidth;
      ctx.fillText(Math.round(episode).toString(), x, chartHeight - padding.bottom + 20);
    }
    
    // Y-axis labels (reward)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const reward = minReward + (i / 5) * (maxReward - minReward);
      const y = chartHeight - padding.bottom - (i / 5) * innerHeight;
      ctx.fillText(reward.toFixed(1), padding.left - 10, y + 4);
    }

    // Y-axis labels (efficiency) - right side
    if (showEfficiency) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i <= 5; i++) {
        const efficiency = (i / 5) * 100;
        const y = chartHeight - padding.bottom - (i / 5) * innerHeight;
        ctx.fillText(efficiency.toFixed(0) + '%', width - padding.right + 10, y + 4);
      }
    }

    // Axis titles
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Episode', width / 2, chartHeight - 5);
    
    ctx.save();
    ctx.translate(15, chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reward', 0, 0);
    ctx.restore();

    if (showEfficiency) {
      ctx.save();
      ctx.translate(width - 15, chartHeight / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('Efficiency (%)', 0, 0);
      ctx.restore();
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePos({ x: event.clientX, y: event.clientY });

    const padding = { top: 20, right: 60, bottom: 40, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    
    if (x >= padding.left && x <= rect.width - padding.right) {
      const minEpisode = Math.min(...data.map(d => d.episode));
      const maxEpisode = Math.max(...data.map(d => d.episode));
      const relativeX = (x - padding.left) / chartWidth;
      const targetEpisode = minEpisode + relativeX * (maxEpisode - minEpisode);
      
      // Find closest data point
      const closest = data.reduce((prev, curr) => 
        Math.abs(curr.episode - targetEpisode) < Math.abs(prev.episode - targetEpisode) ? curr : prev
      );
      
      setHoveredPoint(closest);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full border border-gray-200 rounded-lg cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height: `${height}px` }}
      />
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span>Reward</span>
        </div>
        {showMovingAverage && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2 border-green-500"></div>
            <span>Moving Average</span>
          </div>
        )}
        {showEfficiency && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-amber-500"></div>
            <span>Efficiency</span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 80,
            transform: 'translate(-50%, 0)'
          }}
        >
          <div className="text-sm font-semibold mb-1">Episode {hoveredPoint.episode}</div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between space-x-4">
              <span className="text-blue-600">Reward:</span>
              <span className="font-medium">{hoveredPoint.reward.toFixed(2)}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-amber-600">Efficiency:</span>
              <span className="font-medium">{hoveredPoint.efficiency.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-purple-600">Satisfaction:</span>
              <span className="font-medium">{hoveredPoint.satisfaction.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(hoveredPoint.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCurveChart;