// src/components/ResetPassword.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Lock } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Added Loader2 to the import


const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
      });
      showToast("success", response.data.message);
      navigate("/login");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4c35ae] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all hover:shadow-2xl">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your new password for {email}
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Back to{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;