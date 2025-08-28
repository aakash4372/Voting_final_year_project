// src/components/Profile.jsx
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Profileimg from "@/assets/profile.png";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-6">
        No user data available. Please log in.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-lg shadow-lg">
        {/* Header section */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-20 h-20 mx-auto sm:mx-0">
            <AvatarImage src={Profileimg} alt={user.name} />
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              {user.name}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {user.department?.name || "No Department"}{" "}
              <span className="ml-1">
                {user.department?.year || "Not provided"}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        {/* Content section */}
        <CardContent className="space-y-4 mt-2">
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <FaEnvelope className="mr-3 text-indigo-500 flex-shrink-0" />
            <span className="break-all">{user.email || "Not provided"}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <FaPhone className="mr-3 text-indigo-500 flex-shrink-0" />
            <span>{user.phone || "Not provided"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
