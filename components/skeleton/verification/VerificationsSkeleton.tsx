import React from 'react';

export default function VerificationsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            
            {/* Right side content (Main details) */}
            <div className="flex-1 space-y-3">
              {/* Project Name & Status Badge */}
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-md w-32"></div>
                <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              </div>

              {/* Meta Info (User & Date) */}
              <div className="h-3 bg-gray-200 rounded w-48"></div>

              {/* View Details Link */}
              <div className="h-3 bg-gray-200 rounded w-20"></div>

              {/* Reason for verification description */}
              <div className="space-y-1.5 pt-1">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Attachment Links */}
              <div className="flex gap-3 pt-1">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            {/* Left side content (Action Button) */}
            <div className="w-20 h-9 bg-gray-200 rounded-xl shrink-0"></div>

          </div>
        </div>
      ))}
    </div>
  );
}