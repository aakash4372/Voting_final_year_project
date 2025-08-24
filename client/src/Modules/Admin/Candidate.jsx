import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2, Pencil, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";

// Simple in-memory cache
const cache = new Map();

const Candidate = () => {
  const [candidatesByElection, setCandidatesByElection] = useState({});
  const [elections, setElections] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    electionId: "",
    image: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    try {
      if (cache.has("candidates")) {
        setCandidatesByElection(cache.get("candidates"));
        return;
      }

      const response = await axiosInstance.get("/candidates");
      const candidates = response.data;

      const grouped = candidates.reduce((acc, candidate) => {
        const electionId = candidate.election?._id;
        if (electionId) {
          if (!acc[electionId]) {
            acc[electionId] = {
              title: candidate.election.title,
              candidates: [],
            };
          }
          acc[electionId].candidates.push(candidate);
        }
        return acc;
      }, {});

      cache.set("candidates", grouped);
      setCandidatesByElection(grouped);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      showToast("error", error.response?.data?.message || "Failed to fetch candidates.");
    }
  };

  const fetchElections = async () => {
    try {
      if (cache.has("elections")) {
        setElections(cache.get("elections"));
        return;
      }

      const response = await axiosInstance.get("/elections");
      const electionsData = response.data;
      cache.set("elections", electionsData);
      setElections(electionsData);
    } catch (error) {
      console.error("Error fetching elections:", error);
      showToast("error", error.response?.data?.message || "Failed to fetch elections.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (isEditing) {
      setEditingCandidate((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    } else {
      setNewCandidate((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSelectChange = (value) => {
    if (isEditing) {
      setEditingCandidate((prev) => ({
        ...prev,
        electionId: value,
      }));
    } else {
      setNewCandidate((prev) => ({
        ...prev,
        electionId: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const candidateData = isEditing ? editingCandidate : newCandidate;

    if (!candidateData.name || !candidateData.electionId || (!candidateData.image && !isEditing)) {
      showToast("error", "Please fill all fields and select an image.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", candidateData.name);
    formData.append("election", candidateData.electionId);
    if (candidateData.image instanceof File) {
      formData.append("image", candidateData.image);
    }

    try {
      if (isEditing) {
        await axiosInstance.put(`/candidates/${editingCandidate._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("success", "Candidate updated successfully!");
      } else {
        await axiosInstance.post("/candidates", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("success", "Candidate added successfully!");
      }
      cache.delete("candidates");
      fetchCandidates();
      setIsModalOpen(false);
      setIsEditing(false);
      setNewCandidate({ name: "", electionId: "", image: null });
      setEditingCandidate(null);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} candidate:`, error.response?.data);
      showToast("error", error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} candidate.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axiosInstance.delete(`/candidates/${candidateId}`);
        showToast("success", "Candidate deleted successfully!");
        cache.delete("candidates");
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate:", error);
        showToast("error", error.response?.data?.message || "Failed to delete candidate.");
      }
    }
  };

  const handleEdit = (candidate) => {
    setIsEditing(true);
    setEditingCandidate({
      ...candidate,
      electionId: candidate.election._id,
      image: null, // Reset image field
    });
    setIsModalOpen(true);
  };

  const renderedCandidates = useMemo(() => {
    return Object.keys(candidatesByElection).map((electionId) => (
      <div key={electionId} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {candidatesByElection[electionId].title}
          </h3>
          <span className="text-gray-500">
            ({candidatesByElection[electionId].candidates.length} candidates)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {candidatesByElection[electionId].candidates.map((candidate) => (
            <Card
              key={candidate._id}
              className="rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition relative"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="absolute top-2 right-2">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(candidate)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(candidate._id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CardHeader className="flex flex-col items-center">
                <img
                  src={candidate.image_url || "https://via.placeholder.com/150"}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <CardTitle className="mt-4 text-lg">{candidate.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-600">
                {candidate.election?.title}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ));
  }, [candidatesByElection]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"></h2>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setIsEditing(false);
            setEditingCandidate(null);
            setNewCandidate({ name: "", electionId: "", image: null });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl shadow-md hover:scale-105 transition">
              + Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update the candidate's details." : "Fill out the form below to add a new candidate."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Candidate Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={isEditing ? editingCandidate?.name || "" : newCandidate.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="election">Election</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={isEditing ? editingCandidate?.electionId : newCandidate.electionId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election._id} value={election._id}>
                        {election.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Candidate Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleChange}
                  required={!isEditing}
                />
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Leave blank to keep the existing image.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Submitting..."}
                    </span>
                  ) : (
                    isEditing ? "Update" : "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(candidatesByElection).length === 0 ? (
        <p className="text-center text-gray-500">No candidates found.</p>
      ) : (
        renderedCandidates
      )}
    </div>
  );
};

export default Candidate;