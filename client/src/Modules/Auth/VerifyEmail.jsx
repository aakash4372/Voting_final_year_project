import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "@/toast/customToast";
import axiosInstance from "@/lib/axios";

const VerifyEmail = () => {
  const { login } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/auth/verify-email-otp",
        { email, otp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        showToast("success", response.data.message);
        navigate("/login"); // Redirect to login after verification
      } else {
        showToast("error", response.data.message || "Invalid or expired OTP");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#aec4ee] min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden p-0 bg-white shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 text-center">
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              <p className="text-muted-foreground">
                Enter the OTP sent to <strong>{email}</strong>
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;