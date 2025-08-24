import Result from "../models/Result.js";
import Vote from "../models/Vote.js";

// Calculate results for an election
export const calculateResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const results = await Vote.aggregate([
      { $match: { election: new mongoose.Types.ObjectId(electionId) } },
      { $group: { _id: "$candidate", total_votes: { $sum: 1 } } }
    ]);

    // Save/update results
    const updatedResults = await Promise.all(results.map(async (r) => {
      return await Result.findOneAndUpdate(
        { election: electionId, candidate: r._id },
        { total_votes: r.total_votes },
        { new: true, upsert: true }
      );
    }));

    res.json(updatedResults);
  } catch (error) {
    res.status(500).json({ message: "Error calculating results", error: error.message });
  }
};

// Get results
export const getResults = async (req, res) => {
  try {
    const results = await Result.find({ election: req.params.electionId })
      .populate("candidate")
      .populate("election");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};
