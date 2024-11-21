import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Post } from '@/app/models/post';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const json = await request.json();
    const { title, content, userId } = json;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      );
    }

    // Find the post first to check ownership
    const existingPost = await Post.findById(params.id);

    if (!existingPost) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    if (existingPost.userId !== userId) {
      return NextResponse.json(
        { error: '投稿の編集権限がありません' },
        { status: 403 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      {
        title,
        content,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('likes');

    const post = await Post.aggregate([
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

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: '投稿の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { userId } = await request.json();

    // Find the post first to check ownership
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    if (post.userId !== userId) {
      return NextResponse.json(
        { error: '投稿の削除権限がありません' },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: '投稿の削除に失敗しました' },
      { status: 500 }
    );
  }
}
