
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchPayments, verifyPayment } from '@/store/slices/billingSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Check, X, Eye, Calendar, Clock } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const PaymentVerification = () => {
  const dispatch = useAppDispatch();
  const { payments, isLoading } = useAppSelector((state) => state.billing);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationForm, setVerificationForm] = useState({
    status: '',
    remarks: '',
  });

  useEffect(() => {
    dispatch(fetchPayments({ page: 1, limit: 20, search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      case 'bank_transfer': return 'bg-orange-100 text-orange-800';
      case 'cheque': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openVerificationModal = (payment: any) => {
    setSelectedPayment(payment);
    setVerificationForm({
      status: '',
      remarks: '',
    });
    setIsVerificationModalOpen(true);
  };

  const handleVerifyPayment = async () => {
    if (!selectedPayment || !verificationForm.status) {
      toast({
        title: "Error",
        description: "Please select a verification status",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(verifyPayment({
        id: selectedPayment._id,
        status: verificationForm.status as 'verified' | 'rejected',
        remarks: verificationForm.remarks,
      })).unwrap();

      toast({
        title: "Success",
        description: `Payment ${verificationForm.status} successfully`,
      });

      setIsVerificationModalOpen(false);
      setSelectedPayment(null);
      dispatch(fetchPayments({ page: 1, limit: 20, search: searchTerm, status: statusFilter }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
    }
  };

  const quickVerify = async (paymentId: string, status: 'verified' | 'rejected') => {
    try {
      await dispatch(verifyPayment({
        id: paymentId,
        status,
        remarks: status === 'verified' ? 'Quick verification' : 'Quick rejection',
      })).unwrap();

      toast({
        title: "Success",
        description: `Payment ${status} successfully`,
      });

      dispatch(fetchPayments({ page: 1, limit: 20, search: searchTerm, status: statusFilter }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
          <p className="text-gray-600">Review and verify student payment submissions</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {payments.filter(p => p.status === 'pending').length} Pending
          </Badge>
        </div>
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
                  placeholder="Search by student name or reference ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {payment.student?.fullName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{payment.student?.fullName}</h3>
                      <p className="text-gray-600">{payment.student?.rollNumber}</p>
                    </div>
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference ID</p>
                      <p className="font-mono text-sm">{payment.bankReferenceId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {payment.remarks && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Admin Remarks:</p>
                      <p className="text-sm">{payment.remarks}</p>
                    </div>
                  )}

                  {payment.verificationDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Verified on {new Date(payment.verificationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {payment.receipt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(payment.receipt, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Receipt
                    </Button>
                  )}

                  {payment.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickVerify(payment._id, 'verified')}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickVerify(payment._id, 'rejected')}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openVerificationModal(payment)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Review
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Modal */}
      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Verification</DialogTitle>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Student:</span>
                    <span>{selectedPayment.student?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span>{selectedPayment.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-mono">{selectedPayment.bankReferenceId || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="verificationStatus">Verification Status</Label>
                <Select
                  value={verificationForm.status}
                  onValueChange={(value) => setVerificationForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verify Payment</SelectItem>
                    <SelectItem value="rejected">Reject Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={verificationForm.remarks}
                  onChange={(e) => setVerificationForm(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Add any remarks or comments..."
                  rows={3}
                />
              </div>

              <Button onClick={handleVerifyPayment} className="w-full">
                Submit Verification
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {payments.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Check className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No payments found</h3>
            <p className="text-gray-600">Payment submissions will appear here for verification.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentVerification;
