
import React from 'react';
import { Activity } from '../services/databaseService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReminderStatus from './ReminderStatus';
import StatisticsCards from './StatisticsCards';
import SettingsPanel from './SettingsPanel';
import ActivityManagement from './ActivityManagement';
import { NewActivity } from './AddActivityForm';

interface DashboardTabsProps {
  activities: Activity[];
  filteredActivities: Activity[];
  filters: {
    tanggal: string;
    jenis_kegiatan: string;
    search: string;
  };
  onFiltersChange: (filters: { tanggal: string; jenis_kegiatan: string; search: string }) => void;
  showAddForm: boolean;
  onShowAddForm: (show: boolean) => void;
  newActivity: NewActivity;
  onActivityChange: (activity: NewActivity) => void;
  onAddActivity: (e: React.FormEvent) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
  activityTypes: string[];
}

const DashboardTabs = ({
  activities,
  filteredActivities,
  filters,
  onFiltersChange,
  showAddForm,
  onShowAddForm,
  newActivity,
  onActivityChange,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  activityTypes
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="activities" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="activities">Kelola Kegiatan</TabsTrigger>
        <TabsTrigger value="reminders">Status Pengingat</TabsTrigger>
        <TabsTrigger value="stats">Statistik</TabsTrigger>
        <TabsTrigger value="settings">Pengaturan</TabsTrigger>
      </TabsList>

      <TabsContent value="activities" className="space-y-6">
        <ActivityManagement
          filteredActivities={filteredActivities}
          filters={filters}
          onFiltersChange={onFiltersChange}
          showAddForm={showAddForm}
          onShowAddForm={onShowAddForm}
          newActivity={newActivity}
          onActivityChange={onActivityChange}
          onAddActivity={onAddActivity}
          onUpdateActivity={onUpdateActivity}
          onDeleteActivity={onDeleteActivity}
          activityTypes={activityTypes}
        />
      </TabsContent>

      <TabsContent value="reminders">
        <ReminderStatus />
      </TabsContent>

      <TabsContent value="stats">
        <StatisticsCards activities={activities} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsPanel />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
