import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "", year: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to fetch departments.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpenModal = (department = null) => {
    if (department) {
      setFormData({ name: department.name, year: department.year || "" });
      setEditingDepartmentId(department._id);
    } else {
      setFormData({ name: "", year: "" });
      setEditingDepartmentId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", year: "" });
    setEditingDepartmentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.year.trim()) {
      showToast("error", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingDepartmentId) {
        await axiosInstance.put(`/departments/${editingDepartmentId}`, formData);
        showToast("success", "Department updated successfully!");
      } else {
        await axiosInstance.post("/departments", formData);
        showToast("success", "Department added successfully!");
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to save department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await axiosInstance.delete(`/departments/${departmentToDelete}`);
      showToast("success", "Department deleted successfully!");
      fetchDepartments();
      setIsAlertOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to delete department.");
      setIsAlertOpen(false);
      setDepartmentToDelete(null);
    }
  };

  const openDeleteAlert = (departmentId) => {
    setDepartmentToDelete(departmentId);
    setIsAlertOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header with Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Departments</h2>
        <Button
          onClick={() => handleOpenModal()}
          className="rounded-2xl shadow-md hover:scale-105 transition bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 px-4 w-full sm:w-auto"
        >
          + Add Department
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-lg p-4 sm:p-6 border border-gray-200">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">
              {editingDepartmentId ? "Edit Department" : "Add New Department"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-xs sm:text-sm">
              {editingDepartmentId ? "Update the department details below." : "Fill out the form to add a new department."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-700">Department Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-sm"
                placeholder="Enter department name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-xs sm:text-sm font-medium text-gray-700">Year</Label>
              <Input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-sm"
                placeholder="Enter year (e.g., 2023)"
                required
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition text-sm w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingDepartmentId ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  editingDepartmentId ? "Save Changes" : "Add Department"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {departments.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">No departments found.</p>
        ) : (
          departments.map((department) => (
            <Card
              key={department._id}
              className="rounded-2xl  shadow-lg hover:shadow-xl hover:scale-105 transition bg-white border border-gray-600 min-w-[250px]"
            >
              <CardHeader className="flex flex-col items-start p-4">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">{department.name || "Unnamed Department"}</CardTitle>
              </CardHeader>
              <CardContent className="text-start text-xs sm:text-sm text-gray-600 space-y-2 p-4">
                <p>Year: {department.year || "N/A"}</p>
                <p>Created by: {department.created_by?.name || "N/A"}</p>
                <div className="flex justify-start space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(department)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs sm:text-sm px-3 py-1"
                  >
                    Edit
                  </Button>
                  <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteAlert(department._id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm px-3 py-1"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-md p-4 sm:p-6 border border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-xl font-bold text-gray-900">
                          Confirm Delete
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 text-xs sm:text-sm">
                          Are you sure you want to delete this department? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                        <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs sm:text-sm w-full sm:w-auto">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition text-xs sm:text-sm w-full sm:w-auto"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Department;