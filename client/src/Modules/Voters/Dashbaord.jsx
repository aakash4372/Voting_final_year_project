import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vote } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingElections: 0,
    ongoingElections: 0,
    completedElections: 0,
  });
  const [chartData, setChartData] = useState({
    labels: ['Upcoming', 'Ongoing', 'Completed'],
    datasets: [
      {
        label: 'Election Status Counts',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // Green for upcoming
          'rgba(249, 115, 22, 0.7)', // Orange for ongoing
          'rgba(139, 92, 246, 0.7)', // Purple for completed
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch elections
        const electionsResponse = await axiosInstance.get('/elections');
        const elections = electionsResponse.data;

        // Count elections by status
        const upcomingElections = elections.filter(election => election.status === 'upcoming').length;
        const ongoingElections = elections.filter(election => election.status === 'ongoing').length;
        const completedElections = elections.filter(election => election.status === 'completed').length;

        setDashboardData({
          upcomingElections,
          ongoingElections,
          completedElections,
        });

        // Update chart data
        setChartData({
          labels: ['Upcoming', 'Ongoing', 'Completed'],
          datasets: [
            {
              label: 'Election Status Counts',
              data: [upcomingElections, ongoingElections, completedElections],
              backgroundColor: [
                'rgba(34, 197, 94, 0.7)',  // Green for upcoming
                'rgba(249, 115, 22, 0.7)', // Orange for ongoing
                'rgba(139, 92, 246, 0.7)', // Purple for completed
              ],
              borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(249, 115, 22, 1)',
                'rgba(139, 92, 246, 1)',
              ],
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        showToast('error', 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart options with customized styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
            weight: '600',
          },
          color: '#e5e7eb',
        },
      },
      title: {
        display: true,
        text: 'Election Status Counts',
        font: {
          size: 18,
          family: 'Inter, sans-serif',
          weight: '700',
        },
        color: '#e5e7eb',
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: { size: 14, family: 'Inter, sans-serif', weight: '600' },
          color: '#e5e7eb',
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
        },
        ticks: {
          color: '#e5e7eb',
          font: { size: 12, family: 'Inter, sans-serif' },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Election Status',
          font: { size: 14, family: 'Inter, sans-serif', weight: '600' },
          color: '#e5e7eb',
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#e5e7eb',
          font: { size: 12, family: 'Inter, sans-serif' },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Elections Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Upcoming Elections
            </CardTitle>
            <Vote className="h-8 w-8 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.upcomingElections}
            </div>
            <Badge
              className="mt-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Upcoming
            </Badge>
          </CardContent>
        </Card>

        {/* Ongoing Elections Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Ongoing Elections
            </CardTitle>
            <Vote className="h-8 w-8 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.ongoingElections}
            </div>
            <Badge
              className="mt-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Ongoing
            </Badge>
          </CardContent>
        </Card>

        {/* Completed Elections Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Completed Elections
            </CardTitle>
            <Vote className="h-8 w-8 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.completedElections}
            </div>
            <Badge
              className="mt-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Completed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-gray-700 shadow-lg rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Election Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.datasets[0].data.some(count => count > 0) ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-gray-300 text-center text-lg">
                No election data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;