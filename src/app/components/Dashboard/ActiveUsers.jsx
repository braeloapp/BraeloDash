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

  return (
    <div className="p-4">
      <div className="bg-white shadow-lg rounded-lg p-5 mb-8">
        <h4 className="text-xl font-bold text-gray-800">User Statistics</h4>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-md">Total Active Users</p>
            <p className="text-2xl font-semibold text-green-500 text-center">
              {stats.users.active || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-md">New Users</p>
            <p className="text-2xl font-semibold text-blue-500 text-center">
              {stats.users.new_7d || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#495057] text-[16px] font-semibold">Users</p>
        </div>

        <div>
          {stats.recent_active_users.length === 0 ? (
            <p className="text-sm text-gray-500">No recent users</p>
          ) : (
            stats.recent_active_users.map((person) => (
              <div
                className="flex items-center justify-between mt-2"
                key={person.id}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#feefcb] flex items-center justify-center text-[#C98903] font-semibold">
                    {(person.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="relative mx-3">
                    <div className="absolute -left-5 transform -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#06B64C]"></div>
                  </div>
                  <div>
                    <p className="mb-0 text-sm text-gray-800">{person.name}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-0 text-sm text-gray-800">
                    {person.city || "—"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {person.email || ""}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-[#495057] text-[14px] font-semibold">Total Today</p>
        <p className="text-[#495057] text-[14px] font-semibold">
          {stats.users.new_today || 0} Users
        </p>
      </div>
    </div>
  );
};

export default ActiveUsers;
