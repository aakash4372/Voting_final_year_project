import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MdPerson, MdEmail, MdPhone, MdLock } from "react-icons/md";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    role: "voter",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch departments on component mount1`
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments", {
          withCredentials: true,
        });
        setDepartments(response.data);
        if (response.data.length === 0) {
          showToast("error", "No departments available. Please contact an admin.");
        }
      } catch (error) {
        showToast("error", "Failed to fetch departments. Please try again later.");
      } finally {
        setDeptLoading(false);
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
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#aec4ee] min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden p-0 bg-white shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Heading */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground text-balance">
                  Register for Smart Voting System
                </p>
              </div>

              {/* Name */}
              <div className="grid gap-3 relative">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                    <MdPerson size={20} />
                  </span>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-3 relative">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                    <MdEmail size={20} />
                  </span>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="grid gap-3 relative">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                    <MdPhone size={20} />
                  </span>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-3 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                    <MdLock size={20} />
                  </span>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div className="grid gap-3">
                <Label htmlFor="department">Department</Label>
                <Select
                  name="department"
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  required
                  disabled={deptLoading || departments.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={deptLoading ? "Loading departments..." : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name} (Year {dept.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading || deptLoading || departments.length === 0}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="underline-offset-2 hover:underline text-primary"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Terms */}
        <div className="text-[#3b3b3b] text-center text-xs mt-4">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
};

export default Register;