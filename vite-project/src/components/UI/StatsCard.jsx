// import React from 'react';

// const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
//   const colorClasses = {
//     blue: 'bg-blue-500 text-blue-100',
//     green: 'bg-green-500 text-green-100',
//     yellow: 'bg-yellow-500 text-yellow-100',
//     red: 'bg-red-500 text-red-100',
//     purple: 'bg-purple-500 text-purple-100'
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//           {trend && (
//             <p className={`text-sm mt-2 ₹{trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//               {trend === 'up' ? '↑' : '↓'} {trendValue}
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ₹{colorClasses[color]}`}>
//           <Icon size={24} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;


import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-1">
              {trend === 'up' && <TrendingUp size={14} className="text-green-600 mr-1" />}
              {trend === 'down' && <TrendingDown size={14} className="text-red-600 mr-1" />}
              <span className={`text-sm ${trendColors[trend]}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;