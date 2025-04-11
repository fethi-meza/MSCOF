
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Award } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, trendValue }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Students" 
        value={412} 
        icon={<Users size={18} className="text-primary-600" />}
        trend="up"
        trendValue="8% from last month"
      />
      <StatCard 
        title="Active Formations" 
        value={24} 
        icon={<BookOpen size={18} className="text-accent" />}
        trend="neutral"
        trendValue="Same as last month"
      />
      <StatCard 
        title="Instructors" 
        value={36} 
        icon={<GraduationCap size={18} className="text-primary-600" />}
        trend="up"
        trendValue="2 new this month"
      />
      <StatCard 
        title="Avg. Grade" 
        value="82%" 
        icon={<Award size={18} className="text-accent" />}
        trend="up"
        trendValue="3% from last semester"
      />
    </div>
  );
};

export default DashboardStats;
