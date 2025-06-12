
import React from 'react';

interface ActivityStatusBadgeProps {
  status: string;
}

const ActivityStatusBadge = ({ status }: ActivityStatusBadgeProps) => {
  const badges = {
    aktif: {
      style: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm',
      icon: '✅',
      text: 'Aktif'
    },
    selesai: {
      style: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-sm',
      icon: '🎉',
      text: 'Selesai'
    },
    dibatalkan: {
      style: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-sm',
      icon: '❌',
      text: 'Dibatalkan'
    }
  };
  
  const badge = badges[status as keyof typeof badges];
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${badge.style} transition-all duration-200 hover:scale-105`}>
      <span>{badge.icon}</span>
      {badge.text}
    </span>
  );
};

export default ActivityStatusBadge;
