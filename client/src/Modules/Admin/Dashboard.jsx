import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Vote, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const [filter, setFilter] = useState('year');

  return (
    <div className="p-6 space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <Badge variant="secondary" className="mt-2">+5% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <Badge variant="secondary" className="mt-2">+3 ongoing</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,892</div>
            <Badge variant="secondary" className="mt-2">+12 new this week</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Voting Trends</CardTitle>
            <div className="space-x-2">
              <Button
                variant={filter === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('year')}
              >
                Last Year
              </Button>
              <Button
                variant={filter === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('month')}
              >
                Last Month
              </Button>
              <Button
                variant={filter === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('week')}
              >
                Last Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Chart Placeholder (Use a charting library like Chart.js here)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;