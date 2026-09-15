"use client";

import React, { useEffect, useState } from "react";
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

const ActiveUsers = () => {
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
  }, []);

  const recent = stats.recent_active_users.slice(0, 4);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="app-card col-span-12 md:col-span-4">
        <h4 className="text-lg font-bold text-[#495057]">User Statistics</h4>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#78828A]">Active Users</p>
            <p className="mt-1 text-2xl font-semibold text-[#06B64C]">
              {stats.users.active || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#78828A]">New (7d)</p>
            <p className="mt-1 text-2xl font-semibold text-[#CD9403]">
              {stats.users.new_7d || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#78828A]">Today</p>
            <p className="mt-1 text-2xl font-semibold text-[#495057]">
              {stats.users.new_today || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="app-card col-span-12 md:col-span-8">
        <p className="mb-3 text-[16px] font-semibold text-[#495057]">Recent Users</p>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">No recent users</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recent.map((person) => (
              <div className="flex items-center justify-between" key={person.id}>
                <div className="flex min-w-0 items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#feefcb] font-semibold text-[#C98903]">
                    {(person.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="truncate text-sm text-gray-800">{person.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {person.city || "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
