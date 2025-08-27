import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "@/lib/axios";
import { AuthContext } from "../../context/AuthContext";
import { showToast } from "../../toast/customToast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const VoterCandidates = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      showToast("error", "Please log in to view elections.");
      navigate("/login");
      return;
    }

    const fetchElections = async () => {
      try {
        const response = await axiosInstance.get("/elections?status=ongoing");
        setElections(response.data);
        if (response.data.length === 0) {
          showToast("info", "No ongoing elections found.");
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to fetch elections.");
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, [user, navigate]);

  const fetchCandidates = async (electionId) => {
    try {
      setCandidatesLoading(true);
      const response = await axiosInstance.get(`/candidates?election=${electionId}`);
      setCandidates(response.data);
      if (response.data.length === 0) {
        showToast("info", "No candidates found for this election.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("error", "Session expired. Please log in again.");
        navigate("/login");
      } else {
        showToast("error", error.response?.data?.message || "Failed to fetch candidates.");
      }
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const checkIfVoted = async (electionId) => {
    try {
      const response = await axiosInstance.get(`/votes/${electionId}`);
      const userVote = response.data.find((vote) => vote.voter.toString() === user.id);
      setHasVoted(!!userVote);
    } catch (error) {
      setHasVoted(false);
      if (error.response?.status === 401) {
        showToast("error", "Session expired. Please log in again.");
        navigate("/login");
      } else {
        showToast("error", error.response?.data?.message || "Failed to check vote status.");
      }
    }
  };

  const handleElectionClick = (election) => {
    setSelectedElection(election);
    setCandidates([]); // Clear candidates when selecting a new election
    fetchCandidates(election._id);
    checkIfVoted(election._id);
  };

  const handleVote = async (candidateId, candidateName) => {
    if (hasVoted) {
      showToast("warning", "You have already voted in this election.");
      return;
    }
    try {
      await axiosInstance.post("/votes", {
        election: selectedElection._id,
        candidate: candidateId,
      });
      showToast("success", `Vote cast successfully for ${candidateName}!`);
      setHasVoted(true);
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("error", "Session expired. Please log in again.");
        navigate("/login");
      } else {
        showToast("error", error.response?.data?.message || "Failed to cast vote.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-start items-center h-screen pl-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Ongoing Elections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.length > 0 ? (
          elections.map((election) => (
            <Card
              key={election._id}
              className={`relative cursor-pointer transition-all duration-300 rounded-lg shadow-md hover:shadow-xl ${
                selectedElection?._id === election._id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : hasVoted
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => !hasVoted && handleElectionClick(election)}
              role="button"
              aria-selected={selectedElection?._id === election._id}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && !hasVoted && handleElectionClick(election)}
            >
              {hasVoted && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="h-4 w-4 mr-1" />
                  Voted
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {election.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{election.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Ends on: {new Date(election.end_date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-left col-span-full">
            No ongoing elections found.
          </p>
        )}
      </div>

      {selectedElection && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Candidates for {selectedElection.title}
          </h3>
          {candidatesLoading ? (
            <div className="flex justify-start items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <Card
                    key={candidate._id}
                    className="relative transition-all duration-300 rounded-lg shadow-md hover:shadow-xl"
                  >
                    <CardHeader>
                      <img
                        src={candidate.image_url}
                        alt={candidate.name}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {candidate.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleVote(candidate._id, candidate.name)}
                        disabled={hasVoted}
                        className={`w-full flex items-center justify-center gap-2 transition-colors duration-300 ${
                          hasVoted
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        aria-disabled={hasVoted}
                      >
                        {hasVoted ? (
                          <>
                            <FaCheckCircle className="h-5 w-5" />
                            Voted
                          </>
                        ) : (
                          "Vote"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-left col-span-full">
                  No candidates available for this election.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterCandidates;