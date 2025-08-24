import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaPen } from "react-icons/fa";

const Profile = () => {
  const user = {
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Aakash M",
    email: "aakash@example.com",
    phone: "+91 9876543210",
    department: "BCA",
    year: "2nd Year",
  };

  return (
    <div className="flex p-8 bg-gray-100 justify-start items-start">
      <Card className="w-96 shadow-lg relative">
        {/* Edit Icon Top Right */}
        <FaPen
          className="absolute top-4 right-4 text-gray-500 hover:text-indigo-500 cursor-pointer"
          size={14}
          title="Edit Profile"
          onClick={() => alert("Edit Profile clicked!")}
        />

        <CardHeader className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription>{user.department}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 mt-4">
          <div className="flex items-center text-gray-700">
            <FaEnvelope className="mr-3 text-indigo-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaPhone className="mr-3 text-indigo-500" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBuilding className="mr-3 text-indigo-500" />
            <span>{user.department}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-3 text-indigo-500" />
            <span>{user.year}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
