import { RiDashboardLine } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import { FaVoteYea,FaUserTie } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUserCheck } from "react-icons/fa6";

export const sidebarMenuItems = {
  admin: [
    { url: "/admin_dashboard", title: "Dashboard", icon: RiDashboardLine },
    { url: "/admin_dashboard/electionadd", title: "Election Add", icon: FaVoteYea },
    { url: "/admin_dashboard/candidates", title: "Candidate", icon: FaUserTie },
    { url: "/admin_dashboard/departments", title: "Departments", icon: SiGoogleclassroom },
    { url: "/admin_dashboard/winnercandidate", title: "Winnercandidates", icon: FaUserCheck },
  ],
  voter: [
    { url: "/voter_dashboard", title: "Dashboard", icon: RiDashboardLine },
    { url: "/voter_dashboard/candidates", title: "Candidates", icon: FaUserTie },
  ],
};

export const validRoles = ["admin", "voter"];