
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Schedule, CreateScheduleData, ScheduleOptions } from '@/types/index';

interface ScheduleFormProps {
  schedule?: Schedule | null;
  scheduleOptions: ScheduleOptions | null;
  onSubmit: (data: CreateScheduleData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  scheduleOptions,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateScheduleData>({
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    periodId: '',
    day: 'Monday',
    status: 'draft',
    isRecurring: true,
    recurrenceEndDate: '',
    notes: '',
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        classId: schedule.classId,
        sectionId: schedule.sectionId,
        subjectId: schedule.subjectId,
        teacherId: schedule.teacherId,
        periodId: schedule.periodId,
        day: schedule.day,
        status: schedule.status,
        isRecurring: schedule.isRecurring,
        recurrenceEndDate: schedule.recurrenceEndDate || '',
        notes: schedule.notes || '',
      });
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CreateScheduleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{schedule ? 'Edit Schedule' : 'Create New Schedule'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject</Label>
              <Select value={formData.subjectId || undefined} onValueChange={(value) => handleChange('subjectId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions?.subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={formData.day} onValueChange={(value) => handleChange('day', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Class</Label>
              <Select value={formData.classId || undefined} onValueChange={(value) => handleChange('classId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions?.classes?.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">Section</Label>
              <Select value={formData.sectionId || undefined} onValueChange={(value) => handleChange('sectionId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions?.sections?.map((section) => (
                    <SelectItem key={section._id} value={section._id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodId">Period</Label>
              <Select value={formData.periodId || undefined} onValueChange={(value) => handleChange('periodId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions?.periods?.map((period) => (
                    <SelectItem key={period._id} value={period._id}>
                      {period.name} ({period.startTime} - {period.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher ID</Label>
            <Input
              id="teacherId"
              value={formData.teacherId}
              onChange={(e) => handleChange('teacherId', e.target.value)}
              placeholder="Enter Teacher ID"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => handleChange('isRecurring', checked)}
            />
            <Label htmlFor="isRecurring">Recurring Schedule</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrenceEndDate">Recurrence End Date</Label>
              <Input
                id="recurrenceEndDate"
                type="datetime-local"
                value={formData.recurrenceEndDate}
                onChange={(e) => handleChange('recurrenceEndDate', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (schedule ? 'Update' : 'Create')} Schedule
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
