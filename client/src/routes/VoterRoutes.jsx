// src/routes/VoterRoutes.js
import PrivateRoute from '@/context/PrivateRoute';
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
//   {
//     path: '/voter_dashboard/Profile',
//     element: (
//       <PrivateRoute allowedRole="voter">
//         <Profile />
//       </PrivateRoute>
//     ),
//   },
];