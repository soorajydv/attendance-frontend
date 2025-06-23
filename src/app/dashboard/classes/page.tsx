"use client"

import { DataTable } from "@/components/ui/DataTable"
import type { Class, TableColumn } from "@/types"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useEffect, useState } from "react"
import { deleteClass, fetchClasses } from "@/store/slices/classesSlice"
import { deletePeriod, fetchPeriods } from "@/store/slices/periodSlice"
import type { Period } from "@/store/slices/periodSlice"
import ActionButtons from "@/components/ActionButton"
import AddClassModal from "@/components/AddClassModal"
import UpdateClassModal from "@/components/UpdateClassModal"
import PeriodModal from "@/components/PeriodModal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Users, Clock, BookOpen, Calendar, AlertCircle, Filter, RefreshCw } from 'lucide-react'
import { cn } from "@/lib/utils"

const classColumns: TableColumn[] = [
  {
    header: "Class Information",
    accessor: "name",
  },
  {
    header: "Supervisor Details",
    accessor: "user",
    className: "hidden md:table-cell",
  },
  {
    header: "Student Count",
    accessor: "studentCount",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
]

const periodColumns: TableColumn[] = [
  {
    header: "Period Details",
    accessor: "name",
  },
  {
    header: "Time Schedule",
    accessor: "timeRange",
    className: "hidden md:table-cell",
  },
  {
    header: "Duration",
    accessor: "duration",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
]

export default function ClassesPeriodsPage() {
  const dispatch = useAppDispatch()
  const { classes, isLoading: classLoading, error: classError } = useAppSelector((state) => state.classes)
  const { periods, loading: periodLoading, error: periodError } = useAppSelector((state) => state.periods)

  // Search states
  const [classSearch, setClassSearch] = useState("")
  const [periodSearch, setPeriodSearch] = useState("")

  // Class modal states
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isUpdateClassOpen, setIsUpdateClassOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // Period modal states
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false)
  const [periodModalMode, setPeriodModalMode] = useState<"create" | "edit">("create")
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)

  // Loading states for individual operations
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null)
  const [deletingPeriodId, setDeletingPeriodId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchClasses({ page: 1, limit: 50 }))
    dispatch(fetchPeriods({ page: 1, limit: 50 }))
  }, [dispatch])

  // Utility functions
  const formatTime = (time: string) => {
    if (!time) return "Not set"
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "N/A"
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getStatusBadge = (isActive: boolean = true) => (
    <Badge variant={isActive ? "default" : "secondary"} className={cn(
      "text-xs font-medium",
      isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-600"
    )}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )

  // Filter functions
  const filteredClasses = classes?.filter(cls => {
    return  cls?.name?.toLowerCase().includes(classSearch.toLowerCase()) ||
    (cls.user?.[0]?.fullName || "").toLowerCase().includes(classSearch.toLowerCase())
    
  }
  ) || []

  // console.log("filteredClasses",filteredClasses);
  
  const filteredPeriods = periods?.filter(period => period?.name?.toLowerCase().includes(periodSearch.toLowerCase())) || []

  // Class handlers
  const handleDeleteClass = async (id: string) => {
    setDeletingClassId(id)
    try {
      await dispatch(deleteClass({ id })).unwrap()
      dispatch(fetchClasses({ page: 1, limit: 50 }))
    } catch (error) {
      console.error("Failed to delete class:", error)
    } finally {
      setDeletingClassId(null)
    }
  }

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls)
    setIsUpdateClassOpen(true)
  }

  // Period handlers
  const handleDeletePeriod = async (id: string) => {
    setDeletingPeriodId(id)
    try {
      await dispatch(deletePeriod(id)).unwrap()
      dispatch(fetchPeriods({ page: 1, limit: 50 }))
    } catch (error) {
      console.error("Failed to delete period:", error)
    } finally {
      setDeletingPeriodId(null)
    }
  }

  const handleEditPeriod = (period: Period) => {
    setSelectedPeriod(period)
    setPeriodModalMode("edit")
    setIsPeriodModalOpen(true)
  }

  const handleAddPeriod = () => {
    setSelectedPeriod(null)
    setPeriodModalMode("create")
    setIsPeriodModalOpen(true)
  }

  const handleClosePeriodModal = () => {
    setIsPeriodModalOpen(false)
    setSelectedPeriod(null)
    dispatch(fetchPeriods({ page: 1, limit: 50 }))
  }

  const handleCloseClassModal = () => {
    setIsAddClassOpen(false)
    setIsUpdateClassOpen(false)
    setSelectedClass(null)
    dispatch(fetchClasses({ page: 1, limit: 50 }))
  }

  const handleRefresh = () => {
    dispatch(fetchClasses({ page: 1, limit: 50 }))
    dispatch(fetchPeriods({ page: 1, limit: 50 }))
  }

  const renderClassRow = (cls: Class) => (
    <tr key={cls._id} className="border-b border-gray-200 even:bg-slate-50/50 text-sm hover:bg-blue-50/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{cls.name}</div>
            <div className="text-xs text-gray-500">Code: {cls.code}</div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">
              {cls.user && cls.user.length > 0 ? cls.user[0].fullName : "Unassigned"}
            </div>
            <div className="text-xs text-gray-500">
              {cls.user && cls.user.length > 0 ? cls.user[0].email || "No email" : "No supervisor assigned"}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell p-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-gray-900">{cls.studentCount || 0}</div>
          <div className="text-xs text-gray-500">students</div>
        </div>
      </td>
      <td className="hidden sm:table-cell p-4">
        {getStatusBadge(cls.isActive as any)}
      </td>
      <td className="p-4">
        <ActionButtons 
          onEdit={() => handleEditClass(cls)} 
          onDelete={() => handleDeleteClass(cls._id as string)}
          // isDeleting={deletingClassId === cls._id}
        />
      </td>
    </tr>
  )

  const renderPeriodRow = (period: Period) => (
    <tr key={period._id} className="border-b border-gray-200 even:bg-slate-50/50 text-sm hover:bg-green-50/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{period.name}</div>
            <div className="text-xs text-gray-500">Period ID: {period._id?.slice(-6)}</div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell p-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {formatTime(period.startTime)} - {formatTime(period.endTime)}
          </div>
          <div className="text-xs text-gray-500">
            {period.startTime && period.endTime ? "Scheduled" : "Time not set"}
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="font-medium text-gray-900">
            {calculateDuration(period.startTime, period.endTime)}
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell p-4">
        {getStatusBadge(period.isActive as any)}
      </td>
      <td className="p-4">
        <ActionButtons
          onEdit={() => handleEditPeriod(period)}
          onDelete={() => handleDeletePeriod(period._id as string)}
        />
      </td>
    </tr>
  )

  const LoadingSkeleton = ({ rows = 3 }) => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Management</h1>
            <p className="text-gray-600 mt-1">Manage your classes and periods efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={classLoading || periodLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", (classLoading || periodLoading) && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alerts */}
        {(classError || periodError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {classError && `Classes: ${classError}. `}
              {periodError && `Periods: ${periodError}.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{filteredClasses.length}</div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{filteredPeriods.length}</div>
                  <div className="text-sm text-gray-600">Total Periods</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {filteredClasses.filter(cls => cls.user && cls.user.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Assigned Classes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {filteredPeriods.filter(period => period.startTime && period.endTime).length}
                  </div>
                  <div className="text-sm text-gray-600">Scheduled Periods</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Classes Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Classes Management
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Organize and manage your academic classes
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddClassOpen(true)} 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search classes by name or supervisor..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {classLoading ? (
                <LoadingSkeleton rows={4} />
              ) : filteredClasses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                  <p className="text-gray-500 mb-4">
                    {classSearch ? "Try adjusting your search terms" : "Get started by creating your first class"}
                  </p>
                  {!classSearch && (
                    <Button onClick={() => setIsAddClassOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Class
                    </Button>
                  )}
                </div>
              ) : (
                <DataTable 
                  columns={classColumns} 
                  renderRow={renderClassRow} 
                  data={filteredClasses as Class[]} 
                />
              )}
            </CardContent>
          </Card>

          {/* Periods Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-5 w-5 text-green-600" />
                    Periods Management
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Configure time periods for your schedule
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleAddPeriod} 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search periods by name..."
                    value={periodSearch}
                    onChange={(e) => setPeriodSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {periodLoading ? (
                <LoadingSkeleton rows={4} />
              ) : filteredPeriods.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No periods found</h3>
                  <p className="text-gray-500 mb-4">
                    {periodSearch ? "Try adjusting your search terms" : "Set up your first time period"}
                  </p>
                  {!periodSearch && (
                    <Button onClick={handleAddPeriod} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Period
                    </Button>
                  )}
                </div>
              ) : (
                <DataTable 
                  columns={periodColumns} 
                  renderRow={renderPeriodRow} 
                  data={filteredPeriods as Period[]} 
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Class Modals */}
        <AddClassModal isOpen={isAddClassOpen} onClose={handleCloseClassModal} />
        {selectedClass && (
          <UpdateClassModal 
            isOpen={isUpdateClassOpen} 
            onClose={handleCloseClassModal} 
            classData={selectedClass} 
          />
        )}

        {/* Period Modal */}
        <PeriodModal
          open={isPeriodModalOpen}
          onClose={handleClosePeriodModal}
          mode={periodModalMode}
          initialData={selectedPeriod}
        />
      </div>
    </div>
  )
}
