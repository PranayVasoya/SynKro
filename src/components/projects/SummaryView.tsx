"use client";

import type { Task } from "@/interfaces/task";

interface SummaryViewProps {
  tasks: Task[];
}

export default function SummaryView({ tasks }: SummaryViewProps) {
  const statusCounts = {
    "To Do": tasks.filter((t) => t.status === "To Do").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    "In Review": tasks.filter((t) => t.status === "In Review").length,
    Done: tasks.filter((t) => t.status === "Done").length,
  };

  const priorityCounts = {
    Highest: tasks.filter((t) => t.priority === "Highest").length,
    High: tasks.filter((t) => t.priority === "High").length,
    Medium: tasks.filter((t) => t.priority === "Medium").length,
    Low: tasks.filter((t) => t.priority === "Low").length,
    Lowest: tasks.filter((t) => t.priority === "Lowest").length,
  };

  const totalTasks = tasks.length;
  const totalNonDone =
    statusCounts["To Do"] + statusCounts["In Progress"] + statusCounts["In Review"];

  // Calculate progress over time (simulated based on task completion)
  const completionRate = totalTasks > 0 ? (statusCounts.Done / totalTasks) * 100 : 0;
  const progressData = [
    { label: "Week 1", completed: Math.max(0, statusCounts.Done - 15) },
    { label: "Week 2", completed: Math.max(0, statusCounts.Done - 10) },
    { label: "Week 3", completed: Math.max(0, statusCounts.Done - 5) },
    { label: "Week 4", completed: statusCounts.Done },
  ];
  const maxCompleted = Math.max(...progressData.map((d) => d.completed), 1);

  return (
    <div className="space-y-6">
      {/* Progress Tracker Line Chart */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-semibold">{completionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="relative h-48 mt-6">
          <svg className="w-full h-full" viewBox="0 0 400 150">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40"
                y1={30 + i * 25}
                x2="380"
                y2={30 + i * 25}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted-foreground opacity-20"
              />
            ))}
            
            {/* Line path */}
            <polyline
              points={progressData
                .map((d, i) => {
                  const x = 60 + i * 90;
                  const y = 130 - (d.completed / maxCompleted) * 80;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {progressData.map((d, i) => {
              const x = 60 + i * 90;
              const y = 130 - (d.completed / maxCompleted) * 80;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill="#3b82f6" />
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="text-xs font-medium fill-current"
                  >
                    {d.completed}
                  </text>
                </g>
              );
            })}
            
            {/* X-axis labels */}
            {progressData.map((d, i) => {
              const x = 60 + i * 90;
              return (
                <text
                  key={i}
                  x={x}
                  y="145"
                  textAnchor="middle"
                  className="text-xs fill-current text-muted-foreground"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Tasks completed over time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Donut Chart - Project Overview */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* CSS-based donut chart */}
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {totalNonDone > 0 ? (
                <>
                  {/* To Do - Purple */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="20"
                    strokeDasharray={`${
                      (statusCounts["To Do"] / totalNonDone) * 251.2
                    } 251.2`}
                    strokeDashoffset="0"
                  />
                  {/* In Progress - Blue */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${
                      (statusCounts["In Progress"] / totalNonDone) * 251.2
                    } 251.2`}
                    strokeDashoffset={`-${
                      (statusCounts["To Do"] / totalNonDone) * 251.2
                    }`}
                  />
                  {/* In Review - Green */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${
                      (statusCounts["In Review"] / totalNonDone) * 251.2
                    } 251.2`}
                    strokeDashoffset={`-${
                      ((statusCounts["To Do"] + statusCounts["In Progress"]) /
                        totalNonDone) *
                      251.2
                    }`}
                  />
                </>
              ) : (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm">To Do</span>
            </div>
            <span className="text-sm font-medium">{statusCounts["To Do"]}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">In Progress</span>
            </div>
            <span className="text-sm font-medium">
              {statusCounts["In Progress"]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">In Review</span>
            </div>
            <span className="text-sm font-medium">
              {statusCounts["In Review"]}
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart - Priority Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Priority Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(priorityCounts).map(([priority, count]) => {
            const maxCount = Math.max(...Object.values(priorityCounts), 1);
            const percentage = (count / maxCount) * 100;
            const colors: Record<string, string> = {
              Highest: "bg-red-500",
              High: "bg-red-400",
              Medium: "bg-orange-500",
              Low: "bg-blue-500",
              Lowest: "bg-blue-400",
            };

            return (
              <div key={priority}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{priority}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-6">
                  <div
                    className={`${colors[priority]} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  >
                    {count > 0 && (
                      <span className="text-xs text-white font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
