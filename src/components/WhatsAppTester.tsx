
import React, { useState } from 'react';
import { toast } from 'sonner';
import WhatsAppConnectionTester from './WhatsAppConnectionTester';
import MessageTemplateManager from './MessageTemplateManager';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
}

const WhatsAppTester = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Pengingat Posyandu',
      message: 'Pengingat Posyandu besok jam 7 pagi!'
    },
    {
      id: '2',
      name: 'Rapat RT',
      message: 'Jangan lupa rapat RT hari Minggu jam 19:00 di balai warga'
    }
  ]);

  const handleUseTemplate = (template: MessageTemplate) => {
    toast.success(`Template "${template.name}" dimuat`);
  };

  const handleUpdateTemplate = (templateId: string, newMessage: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, message: newMessage } : t
    ));
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleAddTemplate = (name: string, message: string) => {
    const newTemplate: MessageTemplate = {
      id: Date.now().toString(),
      name: name,
      message: message
    };

    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <div className="space-y-6">
      <WhatsAppConnectionTester 
        templates={templates}
        onAddTemplate={handleAddTemplate}
      />

      <MessageTemplateManager
        templates={templates}
        onUseTemplate={handleUseTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
};

export default WhatsAppTester;
