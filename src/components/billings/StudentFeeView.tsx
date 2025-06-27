import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchStudentFees, submitPayment } from '@/store/slices/billingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Download, Upload, Activity } from 'lucide-react';
import type { Payment } from '@/types/index';
import { useToast } from '../ui/use-toast';

const StudentFeeView = ({ studentId }: { studentId: string }) => {
  const dispatch = useAppDispatch();
  const { studentFees, isLoading } = useAppSelector((state) => state.billing);
  const { toast } = useToast();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '' as Payment['paymentMethod'] | '',
    bankReferenceId: '',
    receipt: null as File | null,
  });

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentFees(studentId));
    }
  }, [dispatch, studentId]);

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

  const handlePaymentSubmit = async () => {
    if (!selectedFee || !paymentForm.amount || !paymentForm.paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const paymentData: Partial<Payment> = {
      feeId: selectedFee._id,
      studentId: studentId,
      amount: parseFloat(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod as Payment['paymentMethod'],
      bankReferenceId: paymentForm.bankReferenceId,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    try {
      await dispatch(submitPayment(paymentData)).unwrap();
      toast({
        title: "Success",
        description: "Payment submitted successfully for verification",
      });
      setIsPaymentModalOpen(false);
      setPaymentForm({
        amount: '',
        paymentMethod: '',
        bankReferenceId: '',
        receipt: null,
      });
      dispatch(fetchStudentFees(studentId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Fee Details</h1>
          <p className="text-gray-600">View and manage your fee payments</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studentFees.map((fee) => (
          <Card key={fee._id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{fee.academicYear}</CardTitle>
                  <p className="text-sm text-gray-600">{fee.semester} Semester</p>
                </div>
                <Badge variant={getStatusColor(fee.status)}>
                  {fee.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Fee Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fee Structure</h4>
                {Object.entries(fee.feeStructure).map(([category, amount]) => (
                  amount > 0 && (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="capitalize">{category}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  )
                ))}
                {fee.discount && fee.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(fee.discount)}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(fee.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Paid Amount</span>
                  <span>{formatCurrency(fee.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Remaining</span>
                  <span>{formatCurrency(fee.remainingAmount)}</span>
                </div>
                {fee.fine && fee.fine > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Fine</span>
                    <span>{formatCurrency(fee.fine)}</span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              {fee.remainingAmount > 0 && (
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedFee(fee);
                        setPaymentForm(prev => ({ ...prev, amount: fee.remainingAmount.toString() }));
                      }}
                    >
                      Make Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Submit Payment</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={paymentForm.amount}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="Enter amount"
                          max={selectedFee?.remainingAmount || 0}
                        />
                      </div>

                      <div>
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          value={paymentForm.paymentMethod}
                          onValueChange={(value: Payment['paymentMethod']) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="reference">Bank/Reference ID</Label>
                        <Input
                          id="reference"
                          value={paymentForm.bankReferenceId}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, bankReferenceId: e.target.value }))}
                          placeholder="Enter reference ID"
                        />
                      </div>

                      <div>
                        <Label htmlFor="receipt">Upload Receipt</Label>
                        <Input
                          id="receipt"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, receipt: e.target.files?.[0] || null }))}
                        />
                      </div>

                      <Button onClick={handlePaymentSubmit} className="w-full">
                        Submit Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {studentFees.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No fees assigned</h3>
            <p className="text-gray-600">Your fee details will appear here once assigned by the administration.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentFeeView;
