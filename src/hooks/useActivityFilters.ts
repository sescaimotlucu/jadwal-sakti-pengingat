
import { useState, useEffect } from 'react';
import { Activity } from '../services/databaseService';

export const useActivityFilters = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState({
    tanggal: '',
    jenis_kegiatan: '',
    search: ''
  });

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const applyFilters = () => {
    let filtered = activities;

    if (filters.tanggal) {
      filtered = filtered.filter(activity => activity.tanggal === filters.tanggal);
    }

    if (filters.jenis_kegiatan) {
      filtered = filtered.filter(activity => activity.jenis_kegiatan === filters.jenis_kegiatan);
    }

    if (filters.search) {
      filtered = filtered.filter(activity =>
        activity.nama_kegiatan.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.lokasi.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  };

  return {
    filteredActivities,
    filters,
    setFilters
  };
};
