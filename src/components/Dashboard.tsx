
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDashboard } from '../hooks/useDashboard';
import ReminderStatus from './ReminderStatus';
import DashboardHeader from './DashboardHeader';
import ActivityManagement from './ActivityManagement';
import StatisticsCards from './StatisticsCards';
import SettingsPanel from './SettingsPanel';

const Dashboard = () => {
  const {
    user,
    activities,
    showAddForm,
    newActivity,
    activityTypes,
    setShowAddForm,
    setNewActivity,
    handleLogout,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 font-poppins">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities">Kelola Kegiatan</TabsTrigger>
            <TabsTrigger value="reminders">Status Pengingat</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          {/* Activities Management */}
          <TabsContent value="activities" className="space-y-6">
            <ActivityManagement
              activities={activities}
              showAddForm={showAddForm}
              newActivity={newActivity}
              activityTypes={activityTypes}
              onShowAddForm={setShowAddForm}
              onActivityChange={setNewActivity}
              onSubmit={handleAddActivity}
              onUpdateActivity={handleUpdateActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          </TabsContent>

          {/* Reminder Status */}
          <TabsContent value="reminders">
            <ReminderStatus />
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats">
            <StatisticsCards activities={activities} />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
