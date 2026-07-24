import React from 'react';

export default function AdsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      
      {/* Cards Grid Layout Mock */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
          >
            {/* Image Placeholder Frame */}
            <div className="relative h-32 bg-gray-200">
              {/* Badge Element placeholder top end */}
              <div className="absolute top-2 end-2 bg-gray-300 h-5 w-14 rounded-full"></div>
            </div>

            {/* Content Details Block */}
            <div className="p-3 space-y-2">
              {/* Title line */}
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              {/* Position text line */}
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              {/* Expiry date line */}
              <div className="h-3 bg-gray-200 rounded w-1/2 pt-0.5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}