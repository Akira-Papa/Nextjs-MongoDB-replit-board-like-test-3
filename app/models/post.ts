import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です'],
  },
  content: {
    type: String,
    required: [true, '内容は必須です'],
  },
  userId: {
    type: String,
    required: [true, 'ユーザーIDは必須です'],
  },
  username: {
    type: String,
    required: [true, 'ユーザー名は必須です'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster queries
postSchema.index({ userId: 1 });
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Add pre-save middleware to update the updatedAt timestamp
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for likes count and liked status
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId',
});

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
