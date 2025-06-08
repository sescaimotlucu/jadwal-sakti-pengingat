
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Filter, Search, Plus } from 'lucide-react';

interface ActivityFiltersProps {
  filters: {
    tanggal: string;
    jenis_kegiatan: string;
    search: string;
  };
  onFiltersChange: (filters: { tanggal: string; jenis_kegiatan: string; search: string }) => void;
  onAddActivity: () => void;
  activityTypes: string[];
}

const ActivityFilters = ({ filters, onFiltersChange, onAddActivity, activityTypes }: ActivityFiltersProps) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter & Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Cari Kegiatan</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nama kegiatan atau lokasi..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-filter">Filter Tanggal</Label>
            <Input
              id="date-filter"
              type="date"
              value={filters.tanggal}
              onChange={(e) => handleFilterChange('tanggal', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type-filter">Filter Jenis</Label>
            <select
              id="type-filter"
              className="w-full p-2 border rounded-md"
              value={filters.jenis_kegiatan}
              onChange={(e) => handleFilterChange('jenis_kegiatan', e.target.value)}
            >
              <option value="">Semua Jenis</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button
              onClick={onAddActivity}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Kegiatan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFilters;
