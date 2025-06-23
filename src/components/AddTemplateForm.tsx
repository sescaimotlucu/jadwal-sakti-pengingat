
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface AddTemplateFormProps {
  show: boolean;
  message: string;
  onAddTemplate: (name: string, message: string) => void;
}

const AddTemplateForm = ({ show, message, onAddTemplate }: AddTemplateFormProps) => {
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleAddTemplate = () => {
    if (!newTemplateName || !message) {
      toast.error('Mohon isi nama template dan pesan');
      return;
    }

    onAddTemplate(newTemplateName, message);
    setNewTemplateName('');
    toast.success('Template baru berhasil ditambahkan');
  };

  if (!show) return null;

  return (
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
      <Input
        placeholder="Nama template"
        value={newTemplateName}
        onChange={(e) => setNewTemplateName(e.target.value)}
      />
      <Button onClick={handleAddTemplate} size="sm" className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Simpan Template
      </Button>
    </div>
  );
};

export default AddTemplateForm;
