// src/Modules/Auth/Register.jsx
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/toast/customToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        showToast("error", "Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department) {
      showToast("error", "Please select a department.");
      return;
    }
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      showToast("success", res.data.message);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" type="text" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <Label>Department</Label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;