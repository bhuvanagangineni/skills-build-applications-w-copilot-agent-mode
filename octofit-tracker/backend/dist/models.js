import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'octopus' },
    weeklyGoal: { type: Number, default: 150 },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });
const teamSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#f4b942' },
    motto: { type: String, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const activitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Run', 'Walk', 'Strength', 'Cycle', 'Swim'], required: true },
    duration: { type: Number, required: true },
    distance: { type: Number, default: 0 },
    points: { type: Number, required: true },
    note: { type: String, default: '' },
    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true },
    change: { type: Number, default: 0 },
    period: { type: String, default: 'This month' },
}, { timestamps: true });
const workoutSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
    description: { type: String, required: true },
    exercises: [{ type: String }],
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
