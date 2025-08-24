// src/routes/AdminRoutes.js
import PrivateRoute from '@/context/PrivateRoute';
import Candidate from '@/Modules/Admin/Candidate';
import Dashboard from '@/Modules/Admin/Dashboard';
import Department from '@/Modules/Admin/Departments';
import ElectionAdd from '@/Modules/Admin/ElectionAdd';
import ElectionList from '@/Modules/Admin/ElectionList';
import Profile from '@/Modules/Auth/Profile';

export const adminRoutes = [
  {
    path: '/admin_dashboard',
    element: (
      <PrivateRoute allowedRole="admin">
        <Dashboard/>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/electionadd',
    element: (
      <PrivateRoute allowedRole="admin">
       <ElectionAdd/>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/electionlist',
    element: (
      <PrivateRoute allowedRole="admin">
       <ElectionList/>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/candidates',
    element: (
      <PrivateRoute allowedRole="admin">
       <Candidate/>
      </PrivateRoute>
    ),
  },
  {
    path:'/admin_dashboard/profile',
    element: (
      <PrivateRoute allowedRole="admin">
       <Profile/>
      </PrivateRoute>
    ),

  },
  {
    path:'/admin_dashboard/departments',
    element: (
      <PrivateRoute allowedRole="admin">
       <Department/>
      </PrivateRoute>
    ),

  },
];