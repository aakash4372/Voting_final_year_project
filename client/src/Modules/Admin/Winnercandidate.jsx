import React, { useState, useEffect, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { AuthContext } from "../../context/AuthContext";
import { showToast } from "../../toast/customToast";
import { useNavigate } from "react-router-dom";

const Winnercandidate = () => {
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🎨 Color schemes per election
  const colors = [
    { winner: "bg-green-200 border-green-400", loser: "bg-gray-100 border-gray-200" },
    { winner: "bg-blue-200 border-blue-400", loser: "bg-gray-100 border-gray-200" },
    { winner: "bg-yellow-200 border-yellow-400", loser: "bg-gray-100 border-gray-200" },
    { winner: "bg-purple-200 border-purple-400", loser: "bg-gray-100 border-gray-200" },
    { winner: "bg-pink-200 border-pink-400", loser: "bg-gray-100 border-gray-200" },
  ];

  useEffect(() => {
    if (!user) {
      showToast("error", "Please log in to view election results.");
      navigate("/login");
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchCompletedElections = async () => {
      try {
        const response = await axiosInstance.get("/elections?status=completed");
        if (!isMounted) return;
        const completedElections = response.data;
        setElections(completedElections);

        if (completedElections.length === 0) {
          showToast("info", "No completed elections found.");
        } else {
          const resultsData = {};
          const noVotesMessages = [];
          const errorMessages = [];

          await Promise.all(
            completedElections.map(async (election) => {
              try {
                let resultResponse = await axiosInstance.get(`/results/${election._id}`);
                resultsData[election._id] = resultResponse.data;

                if (resultResponse.data.length === 0) {
                  const voteResponse = await axiosInstance.get(`/votes/${election._id}`);
                  if (voteResponse.data.length > 0) {
                    await axiosInstance.post(`/results/${election._id}/calculate`);
                    resultResponse = await axiosInstance.get(`/results/${election._id}`);
                    resultsData[election._id] = resultResponse.data;
                  } else {
                    noVotesMessages.push(`No votes cast for ${election.title}.`);
                  }
                }
              } catch (error) {
                errorMessages.push(`Failed to fetch results for ${election.title}.`);
                resultsData[election._id] = [];
              }
            })
          );

          if (noVotesMessages.length > 0) {
            showToast("info", noVotesMessages.join(" "));
          }
          if (errorMessages.length > 0) {
            showToast("error", errorMessages.join(" "));
          }

          if (isMounted) setResults(resultsData);
        }
      } catch (error) {
        if (isMounted) {
          showToast(
            "error",
            error.response?.data?.message || "Failed to fetch completed elections."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompletedElections();

    return () => {
      isMounted = false;
    };
  }, [user, navigate]);

  const getWinner = (electionId) => {
    const electionResults = results[electionId] || [];
    if (electionResults.length === 0) return null;

    const maxVotes = Math.max(...electionResults.map((r) => r.total_votes));
    const winners = electionResults.filter((r) => r.total_votes === maxVotes);
    return winners.length === 1 ? winners[0] : winners;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[100vw] mx-auto">
      {elections.length > 0 ? (
        elections.map((election, index) => {
          const winner = getWinner(election._id);
          const scheme = colors[index % colors.length]; // rotate colors

          return (
            <div key={election._id} className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-left border-l-4 border-blue-600 pl-3  py-2 rounded-r-lg">
                {election.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {results[election._id] && results[election._id].length > 0 ? (
                  results[election._id].map((result) => (
                    <Card
                      key={result.candidate._id}
                      className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border min-w-[250px]
                        ${
                          winner && Array.isArray(winner)
                            ? winner.some((w) => w.candidate._id === result.candidate._id)
                              ? scheme.winner
                              : scheme.loser + " grayscale"
                            : winner && result.candidate._id === winner.candidate._id
                            ? scheme.winner
                            : scheme.loser + " grayscale"
                        }
                      `}
                    >
                      {(winner &&
                        (Array.isArray(winner)
                          ? winner.some((w) => w.candidate._id === result.candidate._id)
                          : result.candidate._id === winner.candidate._id)) && (
                        <div className="absolute top-0 left-0 bg-green-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-br-lg rounded-tl-lg shadow-md">
                          {Array.isArray(winner) ? "Tied Winner" : "Winner"}
                        </div>
                      )}
                      <CardHeader className="p-4">
                        <img
                          src={result.candidate.image_url || "/path/to/fallback-image.jpg"}
                          alt={result.candidate.name}
                          className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
                          onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
                        />
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                          {result.candidate.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-xs sm:text-sm text-gray-600">
                        <p className="text-base sm:text-lg font-bold text-blue-600">
                          Votes: {result.total_votes}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-left col-span-full text-sm sm:text-base">
                    {results[election._id] && results[election._id].length === 0
                      ? "No votes cast for this election."
                      : "No results available for this election."}
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-left text-sm sm:text-base">
          No completed elections found.
        </p>
      )}
    </div>
  );
};

export default Winnercandidate;
