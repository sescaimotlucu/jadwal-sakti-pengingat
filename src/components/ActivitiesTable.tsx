
import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody } from './ui/table';
import { List } from 'lucide-react';
import EditActivityForm from './EditActivityForm';
import ActivityTableHeader from './ActivityTableHeader';
import ActivityRow from './ActivityRow';
import EmptyActivitiesState from './EmptyActivitiesState';

interface ActivitiesTableProps {
  activities: Activity[];
  activityTypes: string[];
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

const ActivitiesTable = ({ activities, activityTypes, onUpdateActivity, onDeleteActivity }: ActivitiesTableProps) => {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleSaveEdit = (updatedActivity: Activity) => {
    console.log('💾 Saving activity:', updatedActivity.nama_kegiatan);
    onUpdateActivity(updatedActivity);
    setEditingActivity(null);
  };

  const handleCancelEdit = () => {
    console.log('❌ Cancelling edit');
    setEditingActivity(null);
  };

  const handleDelete = (activity: Activity) => {
    onDeleteActivity(activity.id);
  };

  return (
    <div className="space-y-8">
      {editingActivity && (
        <EditActivityForm
          activity={editingActivity}
          activityTypes={activityTypes}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <List className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Daftar Kegiatan</h3>
                <p className="text-green-100 text-sm font-medium">{activities.length} kegiatan terdaftar</p>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold text-lg">{activities.length}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <EmptyActivitiesState />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <ActivityTableHeader />
                <TableBody>
                  {activities.map((activity, index) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      index={index}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesTable;
