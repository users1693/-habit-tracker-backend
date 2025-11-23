// src/components/StatsCard.jsx
import React from "react";
import { Target, TrendingUp, Zap } from "lucide-react";

const StatsCard = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.today?.completionRate || 0;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 shadow-lg mb-6">
      <h2 className="text-white font-bold text-lg mb-4">Today's Progress</h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Completed */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-white text-2xl font-bold text-center">
            {stats.today.completed}
          </p>
          <p className="text-white/80 text-xs text-center mt-1">Completed</p>
        </div>

        {/* Total Habits */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <p className="text-white text-2xl font-bold text-center">
            {stats.habits.total}
          </p>
          <p className="text-white/80 text-xs text-center mt-1">Total</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-white text-2xl font-bold text-center">
            {completionRate}%
          </p>
          <p className="text-white/80 text-xs text-center mt-1">Rate</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
