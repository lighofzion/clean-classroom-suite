import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Menu } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unassignedStudents = filteredStudents.filter(
    (student) => !student.batch
  );

  const exportToCSV = () => {
    // Implementation for CSV export
    toast.success("Exporting data to CSV...");
  };

  const StudentTable = ({ students }) => (
    <div className="rounded-md border bg-white/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name || 'N/A'}</TableCell>
              <TableCell>{student.email || 'N/A'}</TableCell>
              <TableCell>{student.phone_number || 'N/A'}</TableCell>
              <TableCell>{student.city || 'N/A'}</TableCell>
              <TableCell>{student.batch || 'Unassigned'}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStudent(student)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-muted-foreground">
                Manage and view all student records
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <SidebarTrigger>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="unassigned">Unassigned Students</TabsTrigger>
                <TabsTrigger value="all">All Students</TabsTrigger>
              </TabsList>

              <TabsContent value="unassigned">
                <StudentTable students={unassignedStudents} />
              </TabsContent>

              <TabsContent value="all">
                <StudentTable students={filteredStudents} />
              </TabsContent>
            </Tabs>
          )}

          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Student Details</DialogTitle>
              </DialogHeader>
              {selectedStudent && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Personal Information</h3>
                    <p>Name: {selectedStudent.name || 'N/A'}</p>
                    <p>Email: {selectedStudent.email || 'N/A'}</p>
                    <p>Phone: {selectedStudent.phone_number || 'N/A'}</p>
                    <p>Gender: {selectedStudent.gender || 'N/A'}</p>
                    <p>Age: {selectedStudent.age || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Course Information</h3>
                    <p>Batch: {selectedStudent.batch || 'Unassigned'}</p>
                    <p>Course Type: {selectedStudent.course_type || 'N/A'}</p>
                    <p>Language: {selectedStudent.course_language || 'N/A'}</p>
                    <p>Registration Date: {selectedStudent.registration_date ? new Date(selectedStudent.registration_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;