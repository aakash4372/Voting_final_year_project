import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImage from "@/assets/img/politico.png";
import logo from "@/assets/img/Bmlogo.png";
import { useState } from "react";
import { Lock } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
    <div className="flex bg-[#aec4ee] min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0 bg-white shadow-lg rounded-xl">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-8 flex flex-col justify-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your new password for {email}
                  </p>
                </div>
                <div className="grid gap-3 relative">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3 relative">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src={loginImage}
                alt="Login Background"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-[#3b3b3b]">build by</span>
          <img src={logo} alt="Logo" className="h-8 object-contain" />
        </div>
        <div className="text-[#3b3b3b] hover:text-primary text-center text-xs mt-4 underline underline-offset-4">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
