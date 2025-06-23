
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Edit, Save, Trash2 } from 'lucide-react';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
}

interface TemplateCardProps {
  template: MessageTemplate;
  onUseTemplate: (template: MessageTemplate) => void;
  onUpdateTemplate: (templateId: string, message: string) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const TemplateCard = ({ 
  template, 
  onUseTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate 
}: TemplateCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(template.message);

  const handleSave = () => {
    onUpdateTemplate(template.id, editMessage);
    setIsEditing(false);
    toast.success('Template berhasil diperbarui');
  };

  const handleEdit = () => {
    setEditMessage(template.message);
    setIsEditing(true);
  };

  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{template.name}</h4>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUseTemplate(template)}
          >
            Gunakan
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteTemplate(template.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            rows={2}
          />
          <Button
            size="sm"
            onClick={handleSave}
          >
            <Save className="w-3 h-3 mr-1" />
            Simpan
          </Button>
        </div>
      ) : (
        <p className="text-xs text-gray-600">{template.message}</p>
      )}
    </div>
  );
};

export default TemplateCard;
