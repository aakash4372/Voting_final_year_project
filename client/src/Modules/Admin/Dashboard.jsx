import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Vote, UserCheck } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [filter, setFilter] = useState('today');
  const [dashboardData, setDashboardData] = useState({
    totalVoters: 0,
    todayVoters: 0,
    totalElections: 0,
    todayElections: 0,
    totalCandidates: 0,
    todayCandidates: 0,
  });
  const [chartData, setChartData] = useState({
    labels: ['Voters', 'Elections', 'Candidates'],
    datasets: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const now = new Date();

        // Fetch voters (excluding admins)
        const votersResponse = await axiosInstance.get('/users', {
          params: { role: 'voter' },
        });
        const voters = votersResponse.data;
        let filteredVoters = voters;

        if (filter === 'today') {
          filteredVoters = voters.filter(user => 
            new Date(user.createdAt).toDateString() === now.toDateString()
          );
        } else if (filter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          filteredVoters = voters.filter(user => 
            new Date(user.createdAt).toDateString() === yesterday.toDateString()
          );
        } else if (filter === 'lastMonth') {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          filteredVoters = voters.filter(user => 
            new Date(user.createdAt) >= lastMonth
          );
        }

        // Fetch elections
        const electionsResponse = await axiosInstance.get('/elections');
        const elections = electionsResponse.data;
        let filteredElections = elections;

        if (filter === 'today') {
          filteredElections = elections.filter(election => 
            new Date(election.createdAt).toDateString() === now.toDateString()
          );
        } else if (filter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          filteredElections = elections.filter(election => 
            new Date(election.createdAt).toDateString() === yesterday.toDateString()
          );
        } else if (filter === 'lastMonth') {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          filteredElections = elections.filter(election => 
            new Date(election.createdAt) >= lastMonth
          );
        }

        // Fetch candidates
        const candidatesResponse = await axiosInstance.get('/candidates');
        const candidates = candidatesResponse.data;
        let filteredCandidates = candidates;

        if (filter === 'today') {
          filteredCandidates = candidates.filter(candidate => 
            new Date(candidate.createdAt).toDateString() === now.toDateString()
          );
        } else if (filter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          filteredCandidates = candidates.filter(candidate => 
            new Date(candidate.createdAt).toDateString() === yesterday.toDateString()
          );
        } else if (filter === 'lastMonth') {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          filteredCandidates = candidates.filter(candidate => 
            new Date(candidate.createdAt) >= lastMonth
          );
        }

        setDashboardData({
          totalVoters: voters.length,
          todayVoters: voters.filter(user => 
            new Date(user.createdAt).toDateString() === now.toDateString()
          ).length,
          totalElections: elections.length,
          todayElections: elections.filter(election => 
            new Date(election.createdAt).toDateString() === now.toDateString()
          ).length,
          totalCandidates: candidates.length,
          todayCandidates: candidates.filter(candidate => 
            new Date(candidate.createdAt).toDateString() === now.toDateString()
          ).length,
        });

        // Prepare chart data with vibrant colors
        setChartData({
          labels: ['Voters', 'Elections', 'Candidates'],
          datasets: [
            {
              label: `Total Counts (${filter.charAt(0).toUpperCase() + filter.slice(1)})`,
              data: [
                filteredVoters.length,
                filteredElections.length,
                filteredCandidates.length,
              ],
              backgroundColor: [
                'rgba(34, 197, 94, 0.7)',  // Green
                'rgba(249, 115, 22, 0.7)', // Orange
                'rgba(139, 92, 246, 0.7)', // Purple
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
  }, [filter]);

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
        text: `Total Counts (${filter.charAt(0).toUpperCase() + filter.slice(1)})`,
        font: {
          size: 18,
          family: 'Inter, sans-serif',
          weight: '700',
        },
        color: '#e5e7eb',
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0. telefonenummer9)',
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
          text: 'Categories',
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
        {/* Total Voters Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Total Voters
            </CardTitle>
            <Users className="h-8 w-8 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.totalVoters.toLocaleString()}
            </div>
            <Badge
              className="mt-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              +{dashboardData.todayVoters} today
            </Badge>
          </CardContent>
        </Card>

        {/* Total Elections Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Total Elections
            </CardTitle>
            <Vote className="h-8 w-8 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.totalElections}
            </div>
            <Badge
              className="mt-3 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              +{dashboardData.todayElections} today
            </Badge>
          </CardContent>
        </Card>

        {/* Total Candidates Card */}
        <Card className="bg-gray-700 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white">
              Total Candidates
            </CardTitle>
            <UserCheck className="h-8 w-8 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {dashboardData.totalCandidates}
            </div>
            <Badge
              className="mt-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              +{dashboardData.todayCandidates} today
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Filter Section */}
      <Card className="bg-gray-700 shadow-lg rounded-2xl border-0">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-white">
             Overview
          </CardTitle>
          <Select
            value={filter}
            onValueChange={setFilter}
            className="mt-4 sm:mt-0 w-full sm:w-48"
          >
            <SelectTrigger className="bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-600 text-white border-gray-500">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.datasets[0]?.data.some(count => count > 0) ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-gray-300 text-center text-lg">
                No data available for {filter}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;