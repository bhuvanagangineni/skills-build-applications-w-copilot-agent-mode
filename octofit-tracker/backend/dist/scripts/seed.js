import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([User.deleteMany({}), Team.deleteMany({}), Activity.deleteMany({}), Leaderboard.deleteMany({}), Workout.deleteMany({})]);
        const users = await User.create([
            { name: 'Maya Chen', email: 'maya@mergington.edu', avatar: 'sunrise', weeklyGoal: 180 },
            { name: 'Jordan Brooks', email: 'jordan@mergington.edu', avatar: 'bolt', weeklyGoal: 150 },
            { name: 'Sam Rivera', email: 'sam@mergington.edu', avatar: 'wave', weeklyGoal: 120 },
            { name: 'Avery Patel', email: 'avery@mergington.edu', avatar: 'leaf', weeklyGoal: 200 },
        ]);
        const teams = await Team.create([
            { name: 'Morning Movers', color: '#ef8354', motto: 'Start strong, finish stronger', members: [users[0]._id, users[1]._id] },
            { name: 'Peak Performers', color: '#4f86c6', motto: 'Small steps. Big energy.', members: [users[2]._id, users[3]._id] },
        ]);
        await User.updateOne({ _id: users[0]._id }, { team: teams[0]._id });
        await User.updateOne({ _id: users[1]._id }, { team: teams[0]._id });
        await User.updateOne({ _id: users[2]._id }, { team: teams[1]._id });
        await User.updateOne({ _id: users[3]._id }, { team: teams[1]._id });
        await Activity.create([
            { user: users[0]._id, type: 'Run', duration: 32, distance: 4.8, points: 64, note: 'Easy river loop', completedAt: new Date() },
            { user: users[1]._id, type: 'Strength', duration: 26, points: 52, note: 'Upper body circuit', completedAt: new Date(Date.now() - 86400000) },
            { user: users[2]._id, type: 'Cycle', duration: 45, distance: 12.4, points: 90, note: 'Neighborhood ride', completedAt: new Date(Date.now() - 172800000) },
            { user: users[3]._id, type: 'Walk', duration: 38, distance: 3.1, points: 45, note: 'Sunset walk', completedAt: new Date(Date.now() - 259200000) },
        ]);
        await Leaderboard.create([
            { user: users[0]._id, points: 486, rank: 1, change: 2 },
            { user: users[3]._id, points: 452, rank: 2, change: 0 },
            { user: users[2]._id, points: 398, rank: 3, change: 1 },
            { user: users[1]._id, points: 364, rank: 4, change: -1 },
        ]);
        await Workout.create([
            { title: 'Core ignition', category: 'Strength', duration: 18, difficulty: 'Moderate', description: 'A focused core session for a stronger center.', exercises: ['Dead bug', 'Plank shoulder taps', 'Bird dog'] },
            { title: 'Quick cardio reset', category: 'Cardio', duration: 22, difficulty: 'Easy', description: 'A low-equipment session to lift your energy.', exercises: ['Marching high knees', 'Step jacks', 'Fast feet'] },
            { title: 'Leg day circuit', category: 'Strength', duration: 28, difficulty: 'Challenging', description: 'Build lower-body strength with a steady circuit.', exercises: ['Squats', 'Reverse lunges', 'Calf raises'] },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
