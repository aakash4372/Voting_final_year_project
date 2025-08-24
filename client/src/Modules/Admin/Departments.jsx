// src/pages/Department.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "", year: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOpenModal = (department = null) => {
    if (department) {
      setFormData({ name: department.name, year: department.year });
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

  const handleDelete = async (departmentId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axiosInstance.delete(`/departments/${departmentId}`);
        showToast("success", "Department deleted successfully!");
        fetchDepartments();
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to delete department.");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header with Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Button
          onClick={() => handleOpenModal()}
          className="rounded-2xl shadow-md hover:scale-105 transition"
        >
          + Add Department
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartmentId ? "Edit Department" : "Add New Department"}</DialogTitle>
            <DialogDescription>
              {editingDepartmentId ? "Update the department details below." : "Fill out the form below to add a new department."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (editingDepartmentId ? "Updating..." : "Adding...") : (editingDepartmentId ? "Save Changes" : "Submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((department) => (
          <Card
            key={department._id}
            className="rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition"
          >
            <CardHeader className="flex flex-col items-start">
              <CardTitle className="mt-4 text-lg">{department.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-start text-sm text-gray-600">
              <p>Year: {department.year}</p>
              <p>Created by: {department.created_by?.name || 'N/A'}</p>
              <div className="flex justify-start space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(department)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(department._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Department;