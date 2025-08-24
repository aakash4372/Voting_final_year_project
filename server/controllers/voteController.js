import Vote from "../models/Vote.js";

// Cast vote
export const castVote = async (req, res) => {
  try {
    const { election, candidate } = req.body;
    const vote = await Vote.create({
      election,
      candidate,
      voter: req.user.id,
    });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ message: "Error casting vote", error: error.message });
  }
};

// Get votes for election
export const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ election: req.params.electionId })
      .populate("voter", "name email")
      .populate("candidate");
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error: error.message });
  }
};
