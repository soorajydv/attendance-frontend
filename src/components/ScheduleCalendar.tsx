
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Schedule, Teacher } from '@/types/index';
import { Edit, Trash2, Clock, User, Book, MapPin, Calendar } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ 
  schedules, 
  onEdit, 
  onDelete 
}) => {
  const [hoveredSchedule, setHoveredSchedule] = useState<string | null>(null);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const { periods } = useAppSelector((state) => state.periods);

  
  const getScheduleForDayAndPeriod = (day: string, period: string) => {
    return schedules.find(schedule => schedule.day === day && schedule.period === period);
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

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
          border: 'border-green-200',
          badge: 'bg-green-500 text-white',
          hover: 'hover:from-green-100 hover:to-emerald-200'
        };
      case 'inactive':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-100',
          border: 'border-red-200',
          badge: 'bg-red-500 text-white',
          hover: 'hover:from-red-100 hover:to-rose-200'
        };
      case 'draft':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
          border: 'border-amber-200',
          badge: 'bg-amber-500 text-white',
          hover: 'hover:from-amber-100 hover:to-yellow-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
          border: 'border-gray-200',
          badge: 'bg-gray-500 text-white',
          hover: 'hover:from-gray-100 hover:to-slate-200'
        };
    }
  };

  const getSubjectColors = (subject: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
      'bg-gradient-to-br from-violet-500 to-purple-600',
    ];
    const index = subject?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const EnhancedHoverScheduleCard = ({ schedule }: { schedule: Schedule }) => {
    const colors = getStatusColors(schedule.status);
    const subjectColor = getSubjectColors(schedule.subject);
    
    return (
      <div className="w-96 bg-white rounded-2xl shadow-2xl border-0 overflow-hidden transform scale-100 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className={`h-3 w-full ${subjectColor}`} />
        
        <div className="p-6 space-y-5">
          {/* Title Section */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{schedule.subject}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{schedule.className} - Section {schedule.section}</span>
              </div>
            </div>
            <Badge className={`${colors.badge} font-semibold px-3 py-1 text-sm shadow-sm`}>
              {schedule.status}
            </Badge>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-800 block mb-1">Schedule</span>
                <p className="text-gray-700 text-sm font-medium">{schedule.period}</p>
                <p className="text-gray-600 text-xs mt-1">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {schedule.notes && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Book className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-blue-900 text-sm block mb-1">Additional Notes</span>
                  <p className="text-blue-800 text-sm leading-relaxed">{schedule.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(schedule)}
              className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700 font-medium py-2.5 transition-all duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Schedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(schedule._id)}
              className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-200 text-red-700 font-medium py-2.5 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Mobile View - Cards Layout */}
      <div className="block lg:hidden space-y-6">
        {/* ... keep existing code (mobile view) */}
        {days.map((day) => {
          const daySchedules = schedules.filter(schedule => schedule.day === day);
          return (
            <Card key={day} className="overflow-hidden border-0 shadow-lg bg-white">
              <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-gray-50">
                <CardTitle className="text-xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {daySchedules.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Book className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No classes scheduled</p>
                  </div>
                ) : (
                  daySchedules.map((schedule) => {
                    const colors = getStatusColors(schedule.status);
                    const subjectColor = getSubjectColors(schedule.subject);
                    return (
                      <div
                        key={schedule._id}
                        className={`relative overflow-hidden rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} 
                          transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
                        onMouseEnter={() => setHoveredSchedule(schedule._id)}
                        onMouseLeave={() => setHoveredSchedule(null)}
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${subjectColor}`} />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 mb-1">{schedule.subject}</h3>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{schedule.className} - {schedule.section}</span>
                              </div>
                            </div>
                            <Badge className={`${colors.badge} text-xs font-semibold px-2 py-1`}>
                              {schedule.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{schedule.period}</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                            </div>
                          </div>

                          {schedule.notes && (
                            <div className="mb-3 p-2 bg-white/50 rounded-lg">
                              <p className="text-xs text-gray-600">{schedule.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(schedule)}
                              className="flex-1 h-8 text-xs bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDelete(schedule._id)}
                              className="flex-1 h-8 text-xs bg-white/80 hover:bg-red-50 border-red-200 text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Desktop View - Grid Layout */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden border-0 shadow-2xl bg-white">
          <CardHeader className="pb-6 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900">
            <CardTitle className="text-3xl font-bold text-center text-white flex items-center justify-center gap-3">
              <Calendar className="w-8 h-8" />
              Weekly Schedule Overview
            </CardTitle>
            <p className="text-slate-200 text-center mt-2">Interactive timetable with detailed hover information</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[1500px]">
                {/* Header Row */}
                <div className="grid grid-cols-9 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50">
                  <div className="p-5 font-bold text-gray-700 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-lg">Day / Period</span>
                    </div>
                  </div>
                  {periods.map((period) => (
                    <div key={period._id} className="p-5 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                      <div className="text-sm font-bold">{period.name}</div>
                    </div>
                  ))}
                </div>

                {/* Days Rows */}
                {days.map((day, dayIndex) => (
                  <div key={day} className={`grid grid-cols-9 border-b border-gray-100 last:border-b-0 
                    ${dayIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-r from-gray-50/50 to-slate-50/50'}`}>
                    <div className="p-5 font-bold text-gray-800 border-r border-gray-200 bg-gradient-to-r from-slate-100 to-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <span className="text-lg">{day}</span>
                      </div>
                    </div>
                    {periods.map((period) => {
                      const schedule = getScheduleForDayAndPeriod(day, period.name);
                      return (
                        <div key={period._id} className="border-r w-140 border-gray-200 last:border-r-0 min-h-[140px] min-w-[100px] p-3">
                          {schedule ? (
                            <HoverCard openDelay={200} closeDelay={150}>
                              <HoverCardTrigger asChild>
                                <div
                                  className={`h-full rounded-xl border-2 ${getStatusColors(schedule.status).border} 
                                    ${getStatusColors(schedule.status).bg} ${getStatusColors(schedule.status).hover}
                                    transform transition-all duration-300 hover:scale-[1.08] hover:shadow-xl hover:-translate-y-1 group cursor-pointer relative overflow-hidden`}
                                  onMouseEnter={() => setHoveredSchedule(schedule._id)}
                                  onMouseLeave={() => setHoveredSchedule(null)}
                                >
                                  <div className={`absolute top-0 left-0 w-full h-2 ${getSubjectColors(schedule.subject)}`} />
                                  <div className="p-4 h-full flex flex-col">
                                    <div className="flex-1">
                                      <h4 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight">
                                        {schedule.subject}
                                      </h4>
                                      <div className="space-y-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-3 h-3 text-gray-500" />
                                          <span className="line-clamp-1 font-medium">{schedule.className}-{schedule.section}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-3 h-3 text-gray-500" />
                                          <span className="text-xs font-medium">{formatTime(schedule.startTime)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3">
                                      <Badge className={`${getStatusColors(schedule.status).badge} text-xs px-2 py-1 font-semibold`}>
                                        {schedule.status}
                                      </Badge>
                                      <div className={`flex gap-1 transition-all duration-300 
                                        ${hoveredSchedule === schedule._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(schedule);
                                          }}
                                          className="h-7 w-7 p-0 hover:bg-blue-50 bg-white/90 border border-blue-200 shadow-sm"
                                        >
                                          <Edit className="h-3 w-3 text-blue-600" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(schedule._id);
                                          }}
                                          className="h-7 w-7 p-0 hover:bg-red-50 bg-white/90 border border-red-200 shadow-sm"
                                        >
                                          <Trash2 className="h-3 w-3 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent side="top" align="center" className="p-0 border-0 shadow-2xl bg-transparent">
                                <EnhancedHoverScheduleCard schedule={schedule} />
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <div className="h-full rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50 
                              flex items-center justify-center group hover:border-gray-300 hover:bg-gradient-to-br hover:from-gray-100/50 hover:to-slate-100/50 
                              transition-all duration-300 hover:scale-105">
                              <div className="text-center opacity-0 group-hover:opacity-70 transition-all duration-300 transform group-hover:scale-110">
                                <Book className="w-7 h-7 mx-auto text-gray-400 mb-2" />
                                <span className="text-xs text-gray-400 font-medium">Available</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
