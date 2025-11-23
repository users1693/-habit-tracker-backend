// src/App.jsx
import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, LogOut } from "lucide-react";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import HabitCard from "./components/HabitCard";
import AddHabitModal from "./components/AddHabitModal";
import WelcomeScreen from "./components/WelcomeScreen";
import * as api from "./services/api";
import { getColorByIndex } from "./utils/colors";

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // Check for existing user on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      loadData(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleStart = async (enteredUsername) => {
    try {
      // First, try to LOGIN with this username
      try {
        const loginResult = await api.login({
          email: `${enteredUsername}@habitquest.demo`,
          password: "demo123",
        });

        // Login successful - use existing account
        const existingUserId = loginResult.user.id;

        localStorage.setItem("userId", existingUserId);
        localStorage.setItem("username", enteredUsername);

        setUserId(existingUserId);
        setUsername(enteredUsername);

        // Wait for data to load before returning
        await loadData(existingUserId);

        return; // Now it's safe to exit
      } catch (loginError) {
        // Login failed - username doesn't exist yet, continue to registration
        console.log("Username not found, creating new account...");
      }

      // If we get here, login failed, so REGISTER new user
      const registerResult = await api.register({
        username: enteredUsername,
        email: `${enteredUsername}@habitquest.demo`,
        password: "demo123",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const newUserId = registerResult.user.id;

      localStorage.setItem("userId", newUserId);
      localStorage.setItem("username", enteredUsername);

      setUserId(newUserId);
      setUsername(enteredUsername);

      // Wait for data to load before returning
      await loadData(newUserId);
    } catch (error) {
      console.error("Failed to start:", error);

      // Better error message
      if (error.response?.status === 409) {
        alert("This username is taken. Please try again.");
      } else {
        alert("Failed to start. Please try again.");
      }

      // Re-throw the error so WelcomeScreen knows it failed
      throw error;
    }
  };
  const loadData = async (uid) => {
    setIsLoading(true);
    try {
      const [statsData, habitsData, completionsData] = await Promise.all([
        api.getUserStats(uid),
        api.getHabits(uid),
        api.getTodayCompletions(uid),
      ]);

      setUserStats(statsData);
      setHabits(habitsData.habits);
      setCompletions(completionsData.completions);
    } catch (error) {
      console.error("Failed to load data:", error);
      throw error; // Re-throw so handleStart knows it failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset your account? This will delete all your data.")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setUserId(null);
      setUsername(null);
      setUserStats(null);
      setHabits([]);
      setCompletions([]);
      setIsLoading(false);
    }
  };

  const handleAddHabit = async (formData) => {
    try {
      await api.createHabit({
        userId,
        name: formData.name,
        type: formData.type,
        baseXpValue: formData.baseXpValue,
        targetCount: formData.targetCount,
      });
      setIsAddModalOpen(false);
      loadData(userId);
    } catch (error) {
      console.error("Failed to create habit:", error);
      alert("Failed to create habit");
    }
  };

  const handleIncrement = async (habitId) => {
    try {
      await api.incrementCompletion(habitId, userId);
      loadData(userId);
    } catch (error) {
      console.error("Failed to increment:", error);
    }
  };

  const handleDecrement = async (habitId) => {
    try {
      await api.decrementCompletion(habitId, userId);
      loadData(userId);
    } catch (error) {
      console.error("Failed to decrement:", error);
    }
  };

  const getCompletion = (habitId) => {
    return completions.find((c) => c.habitId === habitId);
  };

  const filteredHabits = habits.filter((habit) => {
    if (filter === "ALL") return true;
    return habit.type === filter;
  });

  // Show welcome screen if no user
  if (!userId) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Show loading while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Reset Button */}
      <div className="relative">
        <Header userStats={userStats} />
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Reset Demo"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Stats Card */}
        <StatsCard stats={userStats} />

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["ALL", "GOOD", "BAD"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === filterType
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filterType === "ALL" && "🎯 All"}
              {filterType === "GOOD" && "✅ Good"}
              {filterType === "BAD" && "⛔ Bad"}
            </button>
          ))}

          <button
            onClick={() => loadData(userId)}
            disabled={isLoading}
            className="ml-auto px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No habits yet!</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            filteredHabits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completion={getCompletion(habit.id)}
                onIncrement={() => handleIncrement(habit.id)}
                onDecrement={() => handleDecrement(habit.id)}
                colorScheme={getColorByIndex(index)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={3} />
      </button>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddHabit}
      />
    </div>
  );
}

export default App;
