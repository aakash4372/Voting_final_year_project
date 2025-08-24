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
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ElectionList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editDialog, setEditDialog] = useState({ open: false, election: null });

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

  // Delete election
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/elections/${id}`, { withCredentials: true });
      setElections(elections.filter((election) => election._id !== id));
      showToast('success', 'Election deleted successfully');
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

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Election List</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : elections.length === 0 ? (
            <div className="text-center text-gray-500">No elections found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections.map((election) => (
                    <TableRow key={election._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {election.description || '-'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(election.start_date), 'PPP')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(election.end_date), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(election.status)}>
                          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {election.created_by?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditDialog({ open: true, election })}
                            aria-label={`Edit ${election.title}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, id: election._id })}
                            aria-label={`Delete ${election.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Delete Dialog */}
          <AlertDialog
            open={deleteDialog.open}
            onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this election? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(deleteDialog.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Election</AlertDialogTitle>
                <AlertDialogDescription>
                  Update election details
                </AlertDialogDescription>
              </AlertDialogHeader>
              {editDialog.election && (
                <div className="space-y-4 mt-2">
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                    value={editDialog.election.title}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, title: e.target.value },
                      })
                    }
                  />
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Description"
                    value={editDialog.election.description || ''}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, description: e.target.value },
                      })
                    }
                  />
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={format(new Date(editDialog.election.start_date), 'yyyy-MM-dd')}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, start_date: e.target.value },
                      })
                    }
                  />
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={format(new Date(editDialog.election.end_date), 'yyyy-MM-dd')}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, end_date: e.target.value },
                      })
                    }
                  />
                  <select
                    className="w-full border p-2 rounded"
                    value={editDialog.election.status}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        election: { ...editDialog.election, status: e.target.value },
                      })
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleEditSubmit(editDialog.election)}
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

export default ElectionList;
