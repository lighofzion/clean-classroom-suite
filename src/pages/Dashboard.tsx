import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
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

const mockStudents = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    status: "Unassigned",
    grade: "10th",
    joinDate: "2024-01-15" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    status: "Assigned",
    grade: "11th",
    joinDate: "2024-01-16" 
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unassignedStudents = filteredStudents.filter(
    (student) => student.status === "Unassigned"
  );

  const exportToCSV = () => {
    console.log("Exporting to CSV...");
  };

  const StudentTable = ({ students }: { students: typeof mockStudents }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>{student.joinDate}</TableCell>
              <TableCell>{student.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Student Management</h1>
              <p className="text-muted-foreground">
                Manage and view all student records
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
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

          <Tabs defaultValue="unassigned" className="space-y-4">
            <TabsList>
              <TabsTrigger value="unassigned">Unassigned Users</TabsTrigger>
              <TabsTrigger value="all">All Students</TabsTrigger>
            </TabsList>

            <TabsContent value="unassigned">
              <StudentTable students={unassignedStudents} />
            </TabsContent>

            <TabsContent value="all">
              <StudentTable students={filteredStudents} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;