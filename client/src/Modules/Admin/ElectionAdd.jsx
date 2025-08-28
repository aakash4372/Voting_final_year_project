import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CalendarIcon, Loader2, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ElectionManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for election list
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editDialog, setEditDialog] = useState({ open: false, election: null });

  // State for election add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: null,
    end_date: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed value, no user selection
  const totalPages = Math.ceil(elections.length / itemsPerPage);
  const paginatedElections = elections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = ['upcoming', 'ongoing', 'completed'];

  // Fetch elections
  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/elections', { withCredentials: true });
        setElections(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch elections');
        showToast('error', err.response?.data?.message || 'Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        '/elections',
        {
          ...formData,
          start_date: formData.start_date.toISOString(),
          end_date: formData.end_date.toISOString(),
        },
        { withCredentials: true }
      );

      setElections([...elections, response.data]);
      showToast('success', 'Election created successfully');
      setFormData({ title: '', description: '', start_date: null, end_date: null });
      setShowAddForm(false);
      // Reset to first page to show new election if necessary
      setCurrentPage(1);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to create election');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle cancel form
  const handleCancel = () => {
    setFormData({ title: '', description: '', start_date: null, end_date: null });
    setFormErrors({});
    setShowAddForm(false);
  };

  // Delete election
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/elections/${id}`, { withCredentials: true });
      setElections(elections.filter((election) => election._id !== id));
      showToast('success', 'Election deleted successfully');
      // Adjust current page if necessary
      if (paginatedElections.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete election');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  // Edit election
  const handleEditSubmit = async (updatedElection) => {
    try {
      const response = await axiosInstance.put(
        `/elections/${updatedElection._id}`,
        updatedElection,
        { withCredentials: true }
      );
      setElections(
        elections.map((e) =>
          e._id === updatedElection._id ? response.data : e
        )
      );
      showToast('success', 'Election updated successfully');
      setEditDialog({ open: false, election: null });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update election');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'ongoing':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-2xl bg-gray-700 border-0">
        <CardHeader className="border-b border-gray-600">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {showAddForm ? 'Hide Form' : 'Add New Election'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Add Election Form */}
          {showAddForm && (
            <div className="mb-8 border-b border-gray-600 pb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Election</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-white">
                      Election Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter election title"
                      className={cn(
                        "bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all placeholder:text-white",
                        formErrors.title ? 'border-red-400' : ''
                      )}
                      aria-invalid={formErrors.title ? 'true' : 'false'}
                      aria-describedby={formErrors.title ? 'title-error' : undefined}
                    />
                    {formErrors.title && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span id="title-error">{formErrors.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter election description (optional)"
                      rows={4}
                      className="bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 resize-none transition-all placeholder:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Start Date <span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all hover:bg-gray-500 hover:ring-2 hover:ring-green-500/50",
                            !formData.start_date && 'text-white',
                            formErrors.start_date ? 'border-red-400' : ''
                          )}
                          aria-invalid={formErrors.start_date ? 'true' : 'false'}
                          aria-describedby={formErrors.start_date ? 'start-date-error' : undefined}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-white group-hover:text-white" />
                          {formData.start_date ? format(formData.start_date, 'PPP') : 'Pick a start date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-600 border-gray-500">
                        <Calendar
                          mode="single"
                          selected={formData.start_date}
                          onSelect={(date) => {
                            setFormData((prev) => ({ ...prev, start_date: date }));
                            setFormErrors((prev) => ({ ...prev, start_date: '' }));
                          }}
                          initialFocus
                          className="bg-gray-600 text-white rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.start_date && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span id="start-date-error">{formErrors.start_date}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      End Date <span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all hover:bg-gray-500 hover:ring-2 hover:ring-green-500/50",
                            !formData.end_date && 'text-white',
                            formErrors.end_date ? 'border-red-400' : ''
                          )}
                          aria-invalid={formErrors.end_date ? 'true' : 'false'}
                          aria-describedby={formErrors.end_date ? 'end-date-error' : undefined}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-white group-hover:text-white" />
                          {formData.end_date ? format(formData.end_date, 'PPP') : 'Pick an end date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-600 border-gray-500">
                        <Calendar
                          mode="single"
                          selected={formData.end_date}
                          onSelect={(date) => {
                            setFormData((prev) => ({ ...prev, end_date: date }));
                            setFormErrors((prev) => ({ ...prev, end_date: '' }));
                          }}
                          initialFocus
                          className="bg-gray-600 text-white rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.end_date && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span id="end-date-error">{formErrors.end_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 transition-colors rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px] bg-green-500 hover:bg-green-600 text-white transition-colors rounded-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        Creating...
                      </>
                    ) : (
                      'Create Election'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Election List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-4 animate-spin text-white" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 text-lg">{error}</div>
          ) : elections.length === 0 ? (
            <div className="text-center text-white text-lg">No elections found.</div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-lg border border-gray-600">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-600 hover:bg-gray-600 hover:text-white">
                      <TableHead className="text-white font-semibold py-4 px-6">Title</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6 hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6">Start Date</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6">End Date</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6">Status</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6 hidden md:table-cell">Created By</TableHead>
                      <TableHead className="text-white font-semibold py-4 px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedElections.map((election) => (
                      <TableRow key={election._id} className="border-b border-gray-600 hover:bg-gray-600/50 transition-colors">
                        <TableCell className="font-medium text-white py-4 px-6">{election.title}</TableCell>
                        <TableCell className="text-white py-4 px-6 hidden md:table-cell">
                          {election.description || '-'}
                        </TableCell>
                        <TableCell className="text-white py-4 px-6">
                          {format(new Date(election.start_date), 'PPP')}
                        </TableCell>
                        <TableCell className="text-white py-4 px-6">
                          {format(new Date(election.end_date), 'PPP')}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={getStatusBadgeVariant(election.status)}
                            className={cn(
                              "text-sm",
                              election.status === 'upcoming' && 'bg-green-600 hover:bg-green-700 text-white',
                              election.status === 'ongoing' && 'bg-orange-600 hover:bg-orange-700 text-white',
                              election.status === 'completed' && 'bg-gray-500 hover:bg-gray-600 text-white'
                            )}
                          >
                            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white py-4 px-6 hidden md:table-cell">
                          {election.created_by?.name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditDialog({ open: true, election })}
                              aria-label={`Edit ${election.title}`}
                              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4 text-white" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, id: election._id })}
                              aria-label={`Delete ${election.title}`}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {elections.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </Button>
                  <span className="text-white text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Delete Dialog */}
          <AlertDialog
            open={deleteDialog.open}
            onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          >
            <AlertDialogContent className="bg-gray-700 border-gray-600 text-white rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Are you sure you want to delete this election? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 rounded-lg">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(deleteDialog.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Dialog */}
          <AlertDialog
            open={editDialog.open}
            onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
          >
            <AlertDialogContent className="max-w-lg bg-gray-700 border-gray-600 text-white rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Edit Election</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Update election details
                </AlertDialogDescription>
              </AlertDialogHeader>
              {editDialog.election && (
                <div className="space-y-4 mt-2">
                  <Input
                    type="text"
                    className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all placeholder:text-white"
                    placeholder="Title"
                    value={editDialog.election.title}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, title: e.target.value },
                      })
                    }
                  />
                  <Textarea
                    className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 resize-none transition-all placeholder:text-white"
                    placeholder="Description"
                    value={editDialog.election.description || ''}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, description: e.target.value },
                      })
                    }
                  />
                  <Input
                    type="date"
                    className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                    value={format(new Date(editDialog.election.start_date), 'yyyy-MM-dd')}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, start_date: e.target.value },
                      })
                    }
                  />
                  <Input
                    type="date"
                    className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
                    value={format(new Date(editDialog.election.end_date), 'yyyy-MM-dd')}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, end_date: e.target.value },
                      })
                    }
                  />
                  <select
                    className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 p-2 transition-all"
                    value={editDialog.election.status}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, status: e.target.value },
                      })
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="bg-gray-600 text-white">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500 rounded-lg">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleEditSubmit(editDialog.election)}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionManager;