import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restricted_udl_students')
        .select('*');
      
      if (error) {
        toast.error('Failed to fetch students');
        throw error;
      }
      
      return data || [];
    },
  });

  // Calculate KPIs
  const totalStudents = students.length;
  const assignedStudents = students.filter(s => s.batch).length;
  const unassignedStudents = totalStudents - assignedStudents;
  const assignmentRate = totalStudents > 0 ? (assignedStudents / totalStudents) * 100 : 0;

  // Prepare data for charts
  const batchDistribution = students.reduce((acc, student) => {
    const batch = student.batch || 'Unassigned';
    acc[batch] = (acc[batch] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(batchDistribution).map(([batch, count]) => ({
    batch,
    students: count,
  }));

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor key metrics and student distribution
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:200ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Students</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedStudents}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:400ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned Students</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unassignedStudents}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:600ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignment Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentRate.toFixed(1)}%</div>
              <Progress value={assignmentRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4 animate-fade-in [animation-delay:800ms]">
          <CardHeader>
            <CardTitle>Student Distribution by Batch</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;