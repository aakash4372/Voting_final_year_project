import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Briefcase } from "lucide-react";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4c35ae] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Phone</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Department</Label>
            <div className="relative mt-1">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="pl-10 mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2.5 text-gray-700 bg-white shadow-sm transition-colors duration-200"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}{" "}{dept.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Now"}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;