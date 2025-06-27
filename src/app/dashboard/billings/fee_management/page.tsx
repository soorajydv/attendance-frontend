'use client'

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchFees, createFee, updateFee, fetchStudents } from '@/store/slices/billingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FeeManagement = () => {
  const dispatch = useAppDispatch();
  const { fees, students, isLoading, pagination } = useAppSelector((state) => state.billing);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const [feeForm, setFeeForm] = useState({
    studentId: '',
    academicYear: '',
    semester: '',
    tuition: '',
    lab: '',
    library: '',
    exam: '',
    hostel: '',
    bus: '',
    miscellaneous: '',
    dueDate: '',
    discount: '',
  });

  useEffect(() => {
    dispatch(fetchFees({ page: 1, limit: 10, search: searchTerm, status: statusFilter }));
    dispatch(fetchStudents({ search: '' }));
  }, [dispatch, searchTerm, statusFilter]);

  const resetForm = () => {
    setFeeForm({
      studentId: '',
      academicYear: '',
      semester: '',
      tuition: '',
      lab: '',
      library: '',
      exam: '',
      hostel: '',
      bus: '',
      miscellaneous: '',
      dueDate: '',
      discount: '',
    });
  };

  const calculateTotal = () => {
    const total = ['tuition', 'lab', 'library', 'exam', 'hostel', 'bus', 'miscellaneous']
      .reduce((sum, field) => sum + (parseFloat(feeForm[field as keyof typeof feeForm] as string) || 0), 0);
    const discount = parseFloat(feeForm.discount) || 0;
    return total - discount;
  };

  const handleCreateFee = async () => {
    const totalAmount = calculateTotal();
    
    const feeData = {
      studentId: feeForm.studentId,
      academicYear: feeForm.academicYear,
      semester: feeForm.semester,
      feeStructure: {
        tuition: parseFloat(feeForm.tuition) || 0,
        lab: parseFloat(feeForm.lab) || 0,
        library: parseFloat(feeForm.library) || 0,
        exam: parseFloat(feeForm.exam) || 0,
        hostel: parseFloat(feeForm.hostel) || 0,
        bus: parseFloat(feeForm.bus) || 0,
        miscellaneous: parseFloat(feeForm.miscellaneous) || 0,
      },
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      dueDate: feeForm.dueDate,
      status: 'pending' as const,
      discount: parseFloat(feeForm.discount) || 0,
    };

    try {
      await dispatch(createFee(feeData)).unwrap();
      toast({
        title: "Success",
        description: "Fee assigned successfully",
      });
      setIsCreateModalOpen(false);
      resetForm();
      dispatch(fetchFees({ page: 1, limit: 10, search: searchTerm, status: statusFilter }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign fee",
        variant: "destructive",
      });
    }
  };

  const handleEditFee = async () => {
    if (!selectedFee) return;

    const totalAmount = calculateTotal();
    
    const updateData = {
      academicYear: feeForm.academicYear,
      semester: feeForm.semester,
      feeStructure: {
        tuition: parseFloat(feeForm.tuition) || 0,
        lab: parseFloat(feeForm.lab) || 0,
        library: parseFloat(feeForm.library) || 0,
        exam: parseFloat(feeForm.exam) || 0,
        hostel: parseFloat(feeForm.hostel) || 0,
        bus: parseFloat(feeForm.bus) || 0,
        miscellaneous: parseFloat(feeForm.miscellaneous) || 0,
      },
      totalAmount,
      remainingAmount: totalAmount - selectedFee.paidAmount,
      dueDate: feeForm.dueDate,
      discount: parseFloat(feeForm.discount) || 0,
    };

    try {
      await dispatch(updateFee({ id: selectedFee._id, data: updateData })).unwrap();
      toast({
        title: "Success",
        description: "Fee updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      setSelectedFee(null);
      dispatch(fetchFees({ page: 1, limit: 10, search: searchTerm, status: statusFilter }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fee",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (fee: any) => {
    setSelectedFee(fee);
    setFeeForm({
      studentId: fee.studentId,
      academicYear: fee.academicYear,
      semester: fee.semester,
      tuition: fee.feeStructure.tuition.toString(),
      lab: fee.feeStructure.lab.toString(),
      library: fee.feeStructure.library.toString(),
      exam: fee.feeStructure.exam.toString(),
      hostel: fee.feeStructure.hostel?.toString() || '',
      bus: fee.feeStructure.bus?.toString() || '',
      miscellaneous: fee.feeStructure.miscellaneous?.toString() || '',
      dueDate: fee.dueDate.split('T')[0],
      discount: fee.discount?.toString() || '',
    });
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'partially_paid': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600">Assign and manage student fees</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Assign Fee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign New Fee</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={feeForm.studentId}
                    onValueChange={(value) => setFeeForm(prev => ({ ...prev, studentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    {/* <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.fullName} ({student.rollNumber})
                        </SelectItem>
                      ))}
                    </SelectContent> */}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={feeForm.academicYear}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, academicYear: e.target.value }))}
                    placeholder="e.g., 2023-24"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={feeForm.semester}
                    onValueChange={(value) => setFeeForm(prev => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={feeForm.dueDate}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Fee Structure</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'tuition', label: 'Tuition Fee' },
                    { key: 'lab', label: 'Lab Fee' },
                    { key: 'library', label: 'Library Fee' },
                    { key: 'exam', label: 'Exam Fee' },
                    { key: 'hostel', label: 'Hostel Fee' },
                    { key: 'bus', label: 'Bus Fee' },
                    { key: 'miscellaneous', label: 'Miscellaneous' },
                    { key: 'discount', label: 'Discount' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        type="number"
                        value={feeForm[key as keyof typeof feeForm]}
                        onChange={(e) => setFeeForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button onClick={handleCreateFee} className="w-full">
                Assign Fee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      {/* Fee List */}
      <div className="grid gap-4">
        {fees.map((fee) => (
          <Card key={fee._id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{fee.student?.fullName}</h3>
                      <p className="text-gray-600">{fee.student?.rollNumber} • {fee.student?.class}</p>
                    </div>
                    <Badge variant={getStatusColor(fee.status)}>
                      {fee.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-semibold">{fee.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">{formatCurrency(fee.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="font-semibold text-green-600">{formatCurrency(fee.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="font-semibold text-red-600">{formatCurrency(fee.remainingAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(fee)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Fee</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student</Label>
                <Input 
                  value={selectedFee?.student?.fullName || ''} 
                  disabled 
                  className="bg-gray-100"
                />
              </div>
              
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={feeForm.academicYear}
                  onChange={(e) => setFeeForm(prev => ({ ...prev, academicYear: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={feeForm.semester}
                  onValueChange={(value) => setFeeForm(prev => ({ ...prev, semester: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Fee Structure</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'tuition', label: 'Tuition Fee' },
                  { key: 'lab', label: 'Lab Fee' },
                  { key: 'library', label: 'Library Fee' },
                  { key: 'exam', label: 'Exam Fee' },
                  { key: 'hostel', label: 'Hostel Fee' },
                  { key: 'bus', label: 'Bus Fee' },
                  { key: 'miscellaneous', label: 'Miscellaneous' },
                  { key: 'discount', label: 'Discount' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      value={feeForm[key as keyof typeof feeForm]}
                      onChange={(e) => setFeeForm(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <Button onClick={handleEditFee} className="w-full">
              Update Fee
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {fees.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No fees found</h3>
            <p className="text-gray-600">Start by assigning fees to students.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeeManagement;
