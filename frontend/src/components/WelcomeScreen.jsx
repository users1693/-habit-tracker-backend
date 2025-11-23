// src/components/WelcomeScreen.jsx
import React, { useState } from "react";
import { Sparkles, Trophy, Target, Zap } from "lucide-react";

const WelcomeScreen = ({ onStart }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await onStart(username.trim());
      // If we reach here, it succeeded (component will unmount)
    } catch (error) {
      // If error is thrown, we stay on this screen
      console.error("Start failed:", error);
      // Error already shown by App.jsx via alert
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Title Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Habit Quest</h1>
          <p className="text-gray-600">
            Level up your life, one habit at a time
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">Track Habits</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">Earn XP</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">Level Up</p>
            </div>
          </div>
        </div>

        {/* Username Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Start Your Journey
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose your username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                required
                autoFocus
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating your account..." : "Begin Adventure 🚀"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            No password needed - this is a demo project
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/80 text-center mt-6 text-sm">
          Built with React, Node.js, PostgreSQL & Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
