// src/Modules/Auth/VerifyEmail.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/verify-email", { email, otp });
      showToast("success", res.data.message);
      navigate("/login");
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>
        <p className="mb-4 text-center">Enter the OTP sent to {email}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>OTP</Label>
            <Input
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;