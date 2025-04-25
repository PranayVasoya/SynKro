import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
    rank: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema); 