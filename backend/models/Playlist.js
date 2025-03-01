import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist;
