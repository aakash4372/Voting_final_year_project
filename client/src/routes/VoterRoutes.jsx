// src/routes/VoterRoutes.js
import PrivateRoute from '@/context/PrivateRoute';
import Profile from '@/Modules/Auth/Profile';
import VoterDashboard from '@/Modules/Voters/Dashbaord';
import VoterCandidates from '@/Modules/Voters/VoterCandidates';
// Assume this component exists

export const voterRoutes = [
  {
    path: '/voter_dashboard',
    element: (
      <PrivateRoute allowedRole="voter">
        <VoterDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/voter_dashboard/candidates',
    element: (
      <PrivateRoute allowedRole="voter">
        <VoterCandidates />
      </PrivateRoute>
    ),
  },
  {
    path: '/voter_dashboard/profile',
    element: (
      <PrivateRoute allowedRole="voter">
        <Profile />
      </PrivateRoute>
    ),
  },
];