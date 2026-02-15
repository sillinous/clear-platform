import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Star, Flame, Target, Award, Zap, Crown, Shield,
  CheckCircle, Lock, TrendingUp, Calendar, Clock, Gift,
  Sparkles, Medal, Heart, Rocket, Users, BookOpen
} from 'lucide-react';

// Achievement definitions
const achievementCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    achievements: [
      { id: 'first-translation', name: 'First Translation', description: 'Translate your first document', icon: Zap, points: 10, unlocked: true },
      { id: 'profile-complete', name: 'Identity Verified', description: 'Complete your user profile', icon: Shield, points: 25, unlocked: true },
      { id: 'first-process', name: 'Process Pioneer', description: 'Complete your first process', icon: Target, points: 50, unlocked: false },
      { id: 'extension-installed', name: 'Power User', description: 'Install the browser extension', icon: Rocket, points: 25, unlocked: false },
    ],
  },
  {
    id: 'translation-master',
    name: 'Translation Master',
    achievements: [
      { id: 'translate-10', name: 'Translator', description: 'Translate 10 documents', icon: BookOpen, points: 50, unlocked: true },
      { id: 'translate-50', name: 'Linguist', description: 'Translate 50 documents', icon: Star, points: 100, unlocked: false },
      { id: 'translate-100', name: 'Master Decoder', description: 'Translate 100 documents', icon: Crown, points: 250, unlocked: false },
      { id: 'high-risk', name: 'Risk Spotter', description: 'Identify a high-risk document', icon: AlertTriangle, points: 25, unlocked: true },
    ],
  },
  {
    id: 'process-hero',
    name: 'Process Hero',
    achievements: [
      { id: 'complete-5', name: 'Getting Things Done', description: 'Complete 5 processes', icon: CheckCircle, points: 100, unlocked: false },
      { id: 'complete-10', name: 'Bureaucracy Buster', description: 'Complete 10 processes', icon: Trophy, points: 250, unlocked: false },
      { id: 'multi-state', name: 'State Hopper', description: 'Complete processes in 3+ states', icon: MapPin, points: 150, unlocked: false },
      { id: 'speed-runner', name: 'Speed Runner', description: 'Complete a process in under 24 hours', icon: Clock, points: 75, unlocked: false },
    ],
  },
  {
    id: 'community',
    name: 'Community Champion',
    achievements: [
      { id: 'first-post', name: 'Voice Heard', description: 'Create your first community post', icon: MessageCircle, points: 25, unlocked: false },
      { id: 'helpful', name: 'Helpful Hand', description: 'Get 10 upvotes on a post', icon: Heart, points: 50, unlocked: false },
      { id: 'submit-process', name: 'Data Contributor', description: 'Submit a process to the database', icon: Upload, points: 100, unlocked: true },
      { id: 'mentor', name: 'Community Mentor', description: 'Help 5 users complete processes', icon: Users, points: 200, unlocked: false },
    ],
  },
  {
    id: 'consistency',
    name: 'Consistency',
    achievements: [
      { id: 'streak-7', name: 'Week Warrior', description: '7-day activity streak', icon: Flame, points: 50, unlocked: true },
      { id: 'streak-30', name: 'Monthly Master', description: '30-day activity streak', icon: Flame, points: 150, unlocked: false },
      { id: 'streak-100', name: 'Centurion', description: '100-day activity streak', icon: Flame, points: 500, unlocked: false },
      { id: 'early-bird', name: 'Early Bird', description: 'Complete a task before 8 AM', icon: Sun, points: 25, unlocked: false },
    ],
  },
];

// Import missing icons
const { AlertTriangle, MessageCircle, Upload, MapPin, Sun } = {
  AlertTriangle: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  MessageCircle: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Upload: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  MapPin: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Sun: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
};

const ACHIEVEMENTS_KEY = 'clear-achievements';

export default function AchievementsPage() {
  const [userStats, setUserStats] = useState({
    totalPoints: 485,
    level: 4,
    currentStreak: 12,
    longestStreak: 18,
    processesCompleted: 3,
    translationsCount: 47,
    unlockedCount: 6,
    totalAchievements: 20,
  });

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate level progress
  const levelThresholds = [0, 100, 250, 500, 1000, 2000, 5000, 10000];
  const currentLevelPoints = levelThresholds[userStats.level - 1] || 0;
  const nextLevelPoints = levelThresholds[userStats.level] || levelThresholds[levelThresholds.length - 1];
  const levelProgress = ((userStats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  // Filter achievements
  const filteredAchievements = selectedCategory === 'all'
    ? achievementCategories
    : achievementCategories.filter(cat => cat.id === selectedCategory);

  // Get rank title
  const getRankTitle = (level) => {
    const ranks = ['Novice', 'Apprentice', 'Citizen', 'Navigator', 'Expert', 'Master', 'Champion', 'Legend'];
    return ranks[Math.min(level - 1, ranks.length - 1)];
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-yellow-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* User Stats Card */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-6">
              {/* Level Badge */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{userStats.level}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 rounded-full">
                  <span className="text-xs font-bold text-white">{getRankTitle(userStats.level)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{userStats.totalPoints.toLocaleString()} Points</span>
                </div>
                
                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Level {userStats.level}</span>
                    <span className="text-slate-400">{nextLevelPoints - userStats.totalPoints} pts to Level {userStats.level + 1}</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold">{userStats.currentStreak}</span>
                    </div>
                    <span className="text-xs text-slate-500">Day Streak</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-bold">{userStats.processesCompleted}</span>
                    </div>
                    <span className="text-xs text-slate-500">Processes</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">{userStats.translationsCount}</span>
                    </div>
                    <span className="text-xs text-slate-500">Translations</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-400">
                      <Award className="w-4 h-4" />
                      <span className="font-bold">{userStats.unlockedCount}/{userStats.totalAchievements}</span>
                    </div>
                    <span className="text-xs text-slate-500">Achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Achievements
            </button>
            {achievementCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {filteredAchievements.map((category) => (
          <div key={category.id} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {category.name}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative bg-slate-800 rounded-xl border p-4 text-center transition-all ${
                      achievement.unlocked
                        ? 'border-yellow-500/50 hover:border-yellow-500'
                        : 'border-slate-700 opacity-60'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20'
                        : 'bg-slate-700'
                    }`}>
                      {achievement.unlocked ? (
                        <Icon className="w-7 h-7 text-yellow-400" />
                      ) : (
                        <Lock className="w-7 h-7 text-slate-500" />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{achievement.description}</p>

                    {/* Points */}
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      achievement.unlocked
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-slate-700 text-slate-500'
                    }`}>
                      <Star className="w-3 h-3" />
                      {achievement.points} pts
                    </div>

                    {/* Unlocked Badge */}
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Rewards Preview */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30 p-8">
          <div className="text-center mb-8">
            <Gift className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">Unlock Rewards</h2>
            <p className="text-slate-400">Earn points to unlock exclusive features and perks</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Premium Themes</h3>
                  <p className="text-xs text-slate-500">500 points</p>
                </div>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '97%' }} />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Priority Support</h3>
                  <p className="text-xs text-slate-500">1,000 points</p>
                </div>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Champion Badge</h3>
                  <p className="text-xs text-slate-500">2,500 points</p>
                </div>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '19%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
