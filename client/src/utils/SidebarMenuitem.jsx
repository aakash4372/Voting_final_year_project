import { RiDashboardLine } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import { FaVoteYea,FaUserTie } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";

export const sidebarMenuItems = {
  admin: [
    { url: "/admin_dashboard", title: "Dashboard", icon: RiDashboardLine },
    { url: "/admin_dashboard/electionadd", title: "Election Add", icon: FaVoteYea },
    { url: "/admin_dashboard/electionlist", title: "Election List", icon: HiUsers },
    { url: "/admin_dashboard/candidates", title: "Candidate", icon: FaUserTie },
    { url: "/admin_dashboard/departments", title: "Departments", icon: SiGoogleclassroom },
  ],
  voter: [
    { url: "/voter_dashboard", title: "Dashboard", icon: RiDashboardLine },
  ],
};

export const validRoles = ["admin", "voter"];