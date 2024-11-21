import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Post, Like } from '@/app/models/post';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    // Find existing like
    const existingLike = await Like.findOne({
      postId: new mongoose.Types.ObjectId(params.id),
      userId: userId
    });

    if (existingLike) {
      // Remove like
      await Like.findByIdAndDelete(existingLike._id);

      const updatedPost = await Post.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(params.id) }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postId',
            as: 'likes'
          }
        },
        {
          $addFields: {
            likeCount: { $size: '$likes' }
          }
        }
      ]).then(results => results[0]);

      return NextResponse.json({
        message: 'いいねを取り消しました',
        likeCount: updatedPost.likeCount,
        isLiked: false
      });
    } else {
      // Add new like
      await Like.create({
        postId: new mongoose.Types.ObjectId(params.id),
        userId: userId
      });

      const updatedPost = await Post.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(params.id) }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postId',
            as: 'likes'
          }
        },
        {
          $addFields: {
            likeCount: { $size: '$likes' }
          }
        }
      ]).then(results => results[0]);

      return NextResponse.json({
        message: 'いいねしました',
        likeCount: updatedPost.likeCount,
        isLiked: true
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'いいねの処理に失敗しました' },
      { status: 500 }
    );
  }
}
