
import React from 'react';
import { Search } from 'lucide-react';

const EmptyActivitiesState = () => {
  return (
    <div className="text-center py-16 px-8">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Kegiatan</h3>
        <p className="text-gray-600">Tidak ada kegiatan yang sesuai dengan filter yang dipilih.</p>
      </div>
    </div>
  );
};

export default EmptyActivitiesState;
