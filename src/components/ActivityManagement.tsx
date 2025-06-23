
import React from 'react';
import { Activity } from '../services/databaseService';
import ActivityFilters from './ActivityFilters';
import AddActivityForm, { NewActivity } from './AddActivityForm';
import ActivitiesTable from './ActivitiesTable';

interface ActivityManagementProps {
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

const ActivityManagement = ({
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
}: ActivityManagementProps) => {
  return (
    <>
      <ActivityFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onAddActivity={() => onShowAddForm(true)}
        activityTypes={activityTypes}
      />

      <AddActivityForm
        showForm={showAddForm}
        newActivity={newActivity}
        onActivityChange={onActivityChange}
        onSubmit={onAddActivity}
        onCancel={() => onShowAddForm(false)}
        activityTypes={activityTypes}
      />

      <ActivitiesTable 
        activities={filteredActivities} 
        activityTypes={activityTypes}
        onUpdateActivity={onUpdateActivity}
        onDeleteActivity={onDeleteActivity}
      />
    </>
  );
};

export default ActivityManagement;
