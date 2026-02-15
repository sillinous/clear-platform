import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, FileText, Map, Clock,
  DollarSign, AlertTriangle, CheckCircle, ArrowUpRight,
  ArrowDownRight, Filter, Download, Calendar, Globe
} from 'lucide-react';

// Sample analytics data - in production this would come from Supabase
const mockData = {
  overview: {
    totalTranslations: 12847,
    translationsChange: 23.5,
    totalProcesses: 156,
    processesChange: 12.3,
    activeUsers: 3421,
    usersChange: 18.7,
    avgRiskScore: 5.8,
    riskChange: -0.3,
  },
  translationsByType: [
    { type: 'Privacy Policy', count: 3421, percentage: 26.6 },
    { type: 'Terms of Service', count: 2856, percentage: 22.2 },
    { type: 'Lease Agreement', count: 2134, percentage: 16.6 },
    { type: 'Employment Contract', count: 1567, percentage: 12.2 },
    { type: 'Legal Notice', count: 1234, percentage: 9.6 },
    { type: 'Other', count: 1635, percentage: 12.7 },
  ],
  processesByState: [
    { state: 'CA', count: 34, processes: 18 },
    { state: 'TX', count: 28, processes: 15 },
    { state: 'FL', count: 22, processes: 14 },
    { state: 'NY', count: 19, processes: 16 },
    { state: 'IL', count: 15, processes: 12 },
  ],
  riskDistribution: [
    { range: '1-2 (Low)', count: 2341, color: 'bg-green-500' },
    { range: '3-4', count: 3567, color: 'bg-green-400' },
    { range: '5-6', count: 4123, color: 'bg-yellow-500' },
    { range: '7-8', count: 1987, color: 'bg-orange-500' },
    { range: '9-10 (High)', count: 829, color: 'bg-red-500' },
  ],
  recentActivity: [
    { action: 'Translation', details: 'Privacy Policy analyzed', time: '2 min ago', risk: 7 },
    { action: 'Process Started', details: "Driver's License Renewal", time: '5 min ago' },
    { action: 'Translation', details: 'Lease Agreement analyzed', time: '8 min ago', risk: 5 },
    { action: 'Submission', details: 'New process submitted (TX)', time: '12 min ago' },
    { action: 'Translation', details: 'Terms of Service analyzed', time: '15 min ago', risk: 8 },
  ],
  weeklyTrend: [
    { day: 'Mon', translations: 1823, processes: 45 },
    { day: 'Tue', translations: 2134, processes: 52 },
    { day: 'Wed', translations: 1967, processes: 48 },
    { day: 'Thu', translations: 2456, processes: 61 },
    { day: 'Fri', translations: 2012, processes: 55 },
    { day: 'Sat', translations: 1234, processes: 32 },
    { day: 'Sun', translations: 1221, processes: 28 },
  ],
};

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-800 rounded-xl border border-slate-700 p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
      </div>
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      {change > 0 ? (
        <ArrowUpRight className="w-4 h-4 text-green-400" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-400" />
      )}
      <span className={change > 0 ? 'text-green-400' : 'text-red-400'}>
        {Math.abs(change)}%
      </span>
      <span className="text-slate-500 text-sm">vs last month</span>
    </div>
  </motion.div>
);

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [data] = useState(mockData);

  const maxTranslations = Math.max(...data.translationsByType.map(t => t.count));
  const maxRisk = Math.max(...data.riskDistribution.map(r => r.count));
  const maxWeekly = Math.max(...data.weeklyTrend.map(d => d.translations));

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Platform Insights</h1>
              <p className="text-slate-400">Analytics and usage statistics</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Translations"
            value={data.overview.totalTranslations}
            change={data.overview.translationsChange}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatCard
            title="Processes Tracked"
            value={data.overview.totalProcesses}
            change={data.overview.processesChange}
            icon={Map}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Users"
            value={data.overview.activeUsers}
            change={data.overview.usersChange}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Avg Risk Score"
            value={data.overview.avgRiskScore}
            change={data.overview.riskChange}
            icon={AlertTriangle}
            color="bg-orange-500"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Translations by Type */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Translations by Document Type</h3>
            <div className="space-y-4">
              {data.translationsByType.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm">{item.type}</span>
                    <span className="text-slate-400 text-sm">{item.count.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxTranslations) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Risk Score Distribution</h3>
            <div className="space-y-4">
              {data.riskDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm">{item.range}</span>
                    <span className="text-slate-400 text-sm">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxRisk) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Trend */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Weekly Activity</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {data.weeklyTrend.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.translations / maxWeekly) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[4px]"
                  />
                  <span className="text-xs text-slate-500">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-sm text-slate-400">Translations</span>
              </div>
            </div>
          </div>

          {/* Top States */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Top States</h3>
            <div className="space-y-4">
              {data.processesByState.map((state, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{state.state}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{state.count} users</span>
                      <span className="text-slate-400 text-sm">{state.processes} processes</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(state.count / 34) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-900 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.action === 'Translation' ? 'bg-blue-500/20' :
                  activity.action === 'Process Started' ? 'bg-purple-500/20' : 'bg-green-500/20'
                }`}>
                  {activity.action === 'Translation' ? (
                    <FileText className="w-5 h-5 text-blue-400" />
                  ) : activity.action === 'Process Started' ? (
                    <Map className="w-5 h-5 text-purple-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white">{activity.details}</p>
                  <p className="text-sm text-slate-500">{activity.action}</p>
                </div>
                {activity.risk && (
                  <div className={`px-2 py-1 rounded text-sm font-medium ${
                    activity.risk >= 7 ? 'bg-red-500/20 text-red-400' :
                    activity.risk >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    Risk: {activity.risk}
                  </div>
                )}
                <span className="text-slate-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
