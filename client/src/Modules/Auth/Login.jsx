// src/components/Login.jsx
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {  Loader2, Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#4c35ae] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all hover:shadow-2xl">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Welcome Back
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email or Phone */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Email or Phone
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                placeholder="Enter your email or phone"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Register
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
 className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;