import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { eventsAPI, usersAPI } from '@/lib/api';
import { EventStatus } from '@/types';

const Dashboard: React.FC = () => {
  const { data: eventsData } = useQuery({
    queryKey: ['events', { page: 1, limit: 100 }],
    queryFn: () => eventsAPI.getEvents({ page: 1, limit: 100 }),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers(),
  });

  const events = eventsData?.events || [];
  const users = usersData?.users || [];

  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.eventStatus === EventStatus.ACTIVE).length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
  };

  const recentEvents = events
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your events and users at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEvents} active events
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.adminUsers} administrators
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => {
                const eventMonth = new Date(e.eventDate).getMonth();
                const currentMonth = new Date().getMonth();
                return eventMonth === currentMonth;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Events this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Latest events in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.eventDate).toLocaleDateString()} • {event.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.eventStatus === EventStatus.ACTIVE 
                        ? 'bg-success/10 text-success' 
                        : event.eventStatus === EventStatus.COMPLETED
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {event.eventStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;