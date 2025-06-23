
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import TemplateCard from './TemplateCard';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
}

interface MessageTemplateManagerProps {
  templates: MessageTemplate[];
  onUseTemplate: (template: MessageTemplate) => void;
  onUpdateTemplate: (templateId: string, message: string) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const MessageTemplateManager = ({ 
  templates, 
  onUseTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate 
}: MessageTemplateManagerProps) => {
  const handleDeleteTemplate = (templateId: string) => {
    onDeleteTemplate(templateId);
    toast.success('Template berhasil dihapus');
  };

  return (
    <Card className="w-full max-w-md mx-auto font-poppins">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Template Pesan
        </CardTitle>
        <CardDescription>
          Kelola template pesan untuk pengingat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUseTemplate={onUseTemplate}
            onUpdateTemplate={onUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default MessageTemplateManager;
