import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

const mockStudents = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Unassigned" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Assigned" },
  // Add more mock data as needed
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
    // Implementation for CSV export
    console.log("Exporting to CSV...");
  };

  const StudentTable = ({ students }: { students: typeof mockStudents }) => (
    <div className="space-y-4">
      {students.map((student) => (
        <div key={student.id} className="table-row">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{student.name}</h3>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
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
    </div>
  );
};

export default Dashboard;