// src/components/AddHabitModal.jsx
import React, { useState } from "react";
import { X, Target, Zap } from "lucide-react";
import { habitColors } from "../utils/colors";

const AddHabitModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "GOOD",
    baseXpValue: 50,
    targetCount: 1,
    colorIndex: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      type: "GOOD",
      baseXpValue: 50,
      targetCount: 1,
      colorIndex: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Habit</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Morning Workout"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Habit Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "GOOD" })}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  formData.type === "GOOD"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ✅ Good Habit
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "BAD" })}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  formData.type === "BAD"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ⛔ Bad Habit
              </button>
            </div>
          </div>

          {/* XP Value */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              XP Value: {formData.baseXpValue}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={formData.baseXpValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseXpValue: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Easy (10)</span>
              <span>Medium (50)</span>
              <span>Hard (100)</span>
            </div>
          </div>

          {/* Target Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Daily Target: {formData.targetCount}x
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.targetCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetCount: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-7 gap-2">
              {habitColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, colorIndex: index })
                  }
                  className={`w-10 h-10 ${
                    color.bg
                  } rounded-full flex items-center justify-center text-xl transition-transform ${
                    formData.colorIndex === index
                      ? "ring-4 ring-purple-500 scale-110"
                      : "hover:scale-105"
                  }`}
                >
                  {color.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-shadow"
          >
            Create Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
