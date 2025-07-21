
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Edit, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { formationsService } from "@/services/formations.service";
import { AddFormationModal } from "@/components/admin/formations/AddFormationModal";
import { EditFormationModal } from "@/components/admin/formations/EditFormationModal";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export default function FormationsManagePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: formations = [], isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: formationsService.getAllFormations
  });

  const deleteFormationMutation = useMutation({
    mutationFn: formationsService.deleteFormation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formations"] });
      toast.success("Formation deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting formation:", error);
      toast.error("Failed to delete formation");
    }
  });

  const filteredFormations = formations.filter((formation) => 
    formation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFormation = () => {
    setIsAddModalOpen(true);
  };

  const handleEditFormation = (id: number) => {
    setSelectedFormationId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteFormation = (id: number) => {
    deleteFormationMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Formations</h1>
            <p className="text-muted-foreground mt-1">Manage training formations</p>
          </div>
          <Button onClick={handleAddFormation}>
            <Plus className="mr-2 h-4 w-4" />
            Add Formation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Formations</CardDescription>
              <CardTitle className="text-4xl font-bold">{formations.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Active and upcoming formations
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Formations</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {formations.filter(f => 
                  new Date(f.startDate) <= new Date() && 
                  new Date(f.endDate) >= new Date()
                ).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Currently running formations
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Upcoming Formations</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {formations.filter(f => new Date(f.startDate) > new Date()).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Scheduled to start soon
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Formations</CardTitle>
            <CardDescription>Manage and overview all training formations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search formations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading formations...
                      </TableCell>
                    </TableRow>
                  ) : filteredFormations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No formations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFormations.map((formation) => {
                      const now = new Date();
                      const startDate = new Date(formation.startDate);
                      const endDate = new Date(formation.endDate);
                      const status = 
                        now < startDate ? "upcoming" : 
                        now > endDate ? "completed" : "active";

                      return (
                        <TableRow key={formation.id}>
                          <TableCell>
                            <div className="font-medium">{formation.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {formation.description || "No description"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(formation.startDate)} - {formatDate(formation.endDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formation.durationInHours} hours</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {formation.remainingSpots !== undefined 
                                  ? `${formation.remainingSpots}/${formation.availableSpots} spots`
                                  : `${formation.availableSpots} spots`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                status === "active" ? "default" : 
                                status === "upcoming" ? "outline" : "secondary"
                              }
                            >
                              {status === "active" ? "Active" : 
                               status === "upcoming" ? "Upcoming" : "Completed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditFormation(formation.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Formation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this formation? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteFormation(formation.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddFormationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditFormationModal
        formationId={selectedFormationId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </MainLayout>
  );
}
