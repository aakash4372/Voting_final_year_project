import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImage from "@/assets/img/politico.png";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLock } from "react-icons/md";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = emailOrPhone.includes("@");
      const credentials = {
        [isEmail ? "email" : "phone"]: emailOrPhone,
        password,
      };
      await login(credentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#aec4ee] min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0 bg-white shadow-lg rounded-xl">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* ===== Form Section ===== */}
            <form
              className="p-6 md:p-8 flex flex-col justify-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-6">
                {/* Heading */}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to Smart Voting System
                  </p>
                </div>

                {/* Email or Phone */}
                <div className="grid gap-3 relative">
                  <Label htmlFor="emailOrPhone">Email or Phone</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                      {emailOrPhone.includes("@") ? (
                        <MdEmail size={20} />
                      ) : (
                        <MdPhone size={20} />
                      )}
                    </span>
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="Enter email or phone"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2c2d]">
                      <MdLock size={20} />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Your Password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="underline-offset-2 hover:underline text-primary"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </form>

            {/* ===== Right Side Image ===== */}
            <div className="bg-muted relative hidden md:block">
              <img
                src={loginImage}
                alt="Login Background"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
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

export default Login;