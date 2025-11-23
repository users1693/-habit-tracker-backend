// src/components/Header.jsx
import React from "react";
import { Trophy, Zap } from "lucide-react";
import { xpGradient } from "../utils/colors";

const Header = ({ userStats }) => {
  if (!userStats) return null;

  const { user, progress } = userStats;
  const xpPercentage = (progress.currentXp / progress.xpForNextLevel) * 100;

  return (
    <div className="bg-white rounded-b-3xl shadow-md px-6 py-6 mb-6">
      {/* User Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hey, {user.username}! 👋
          </h1>
          <p className="text-gray-500 text-sm">
            Let's build great habits today
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-purple-800">Level {user.level}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-gray-700">
              {progress.currentXp} / {progress.xpForNextLevel} XP
            </span>
          </div>
          <span className="text-gray-500 text-xs">
            {progress.xpNeededForNextLevel} to next level
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${xpGradient} rounded-full transition-all duration-500`}
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
