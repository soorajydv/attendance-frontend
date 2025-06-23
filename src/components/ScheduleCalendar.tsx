
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Schedule } from '@/types/index';
import { Edit, Trash2 } from 'lucide-react';

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ schedules, onEdit, onDelete }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getSchedulesForDay = (day: string) => {
    return schedules.filter(schedule => schedule.day === day);
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
      {days.map((day) => {
        const daySchedules = getSchedulesForDay(day);
        return (
          <Card key={day} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-center">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {daySchedules.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No classes scheduled</p>
              ) : (
                daySchedules.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="border rounded-lg p-3 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {schedule.subject}
                      </h4>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(schedule)}
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(schedule._id)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><span className="font-medium">Class:</span> {schedule.className} - {schedule.section}</p>
                      <p><span className="font-medium">Period:</span> {schedule.period}</p>
                      <p><span className="font-medium">Time:</span> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(schedule.status)} text-xs`}
                      >
                        {schedule.status}
                      </Badge>
                      {schedule.notes && (
                        <span className="text-xs text-gray-500 truncate ml-2" title={schedule.notes}>
                          📝 {schedule.notes}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ScheduleCalendar;