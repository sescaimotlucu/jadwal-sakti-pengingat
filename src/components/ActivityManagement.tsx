
import React from 'react';
import { Activity } from '../services/databaseService';
import { useActivityFilters } from '../hooks/useActivityFilters';
import ActivityFilters from './ActivityFilters';
import AddActivityForm, { NewActivity } from './AddActivityForm';
import ActivitiesTable from './ActivitiesTable';

interface ActivityManagementProps {
  activities: Activity[];
  showAddForm: boolean;
  newActivity: NewActivity;
  activityTypes: string[];
  onShowAddForm: (show: boolean) => void;
  onActivityChange: (activity: NewActivity) => void;
  onSubmit: (e: React.FormEvent) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

const ActivityManagement = ({
  activities,
  showAddForm,
  newActivity,
  activityTypes,
  onShowAddForm,
  onActivityChange,
  onSubmit,
  onUpdateActivity,
  onDeleteActivity
}: ActivityManagementProps) => {
  const { filteredActivities, filters, setFilters } = useActivityFilters(activities);

  return (
    <div className="space-y-6">
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        onAddActivity={() => onShowAddForm(true)}
        activityTypes={activityTypes}
      />

      <AddActivityForm
        showForm={showAddForm}
        newActivity={newActivity}
        onActivityChange={onActivityChange}
        onSubmit={onSubmit}
        onCancel={() => onShowAddForm(false)}
        activityTypes={activityTypes}
      />

      <ActivitiesTable 
        activities={filteredActivities} 
        activityTypes={activityTypes}
        onUpdateActivity={onUpdateActivity}
        onDeleteActivity={onDeleteActivity}
      />
    </div>
  );
};

export default ActivityManagement;
