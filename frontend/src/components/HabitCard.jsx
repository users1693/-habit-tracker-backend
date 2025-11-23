// src/components/HabitCard.jsx
import React from "react";
import { Check, Minus, Plus, Flame, Target } from "lucide-react";

const HabitCard = ({
  habit,
  completion,
  onIncrement,
  onDecrement,
  colorScheme,
}) => {
  const completionCount = completion?.completionCount || 0;
  const targetCount = habit.targetCount;
  const isCompleted = completionCount >= targetCount;
  const streak = completion?.currentStreak || 0;

  return (
    <div
      className={`${colorScheme.bg} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - Habit Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{colorScheme.emoji}</div>
          <div className="flex-1">
            <h3 className={`font-semibold ${colorScheme.text} text-lg`}>
              {habit.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              {/* Completion Counter */}
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  {completionCount}/{targetCount}
                </span>
              </div>

              {/* Streak */}
              {streak > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600">
                    {streak} day{streak !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* XP Badge */}
              <div className="bg-white/50 px-2 py-0.5 rounded-full">
                <span className="text-xs font-semibold text-gray-700">
                  {habit.type === "GOOD" ? "+" : "-"}
                  {habit.baseXpValue} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-2">
          {/* Decrement Button */}
          {completionCount > 0 && (
            <button
              onClick={onDecrement}
              className="w-9 h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
          )}

          {/* Increment/Check Button */}
          <button
            onClick={onIncrement}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
              isCompleted
                ? "bg-green-500 hover:bg-green-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {isCompleted ? (
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            ) : (
              <Plus className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
