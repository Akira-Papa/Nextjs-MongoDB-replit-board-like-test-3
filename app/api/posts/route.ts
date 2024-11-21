import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Post } from "@/app/models/post";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'newest';
    const search = url.searchParams.get('search');

    await connectDB();
    
    const aggregationPipeline = [
      search ? {
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ]
        }
      } : { $match: {} }, // Use empty match instead of null
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" }
        }
      },
      sort === 'likes' 
        ? { $sort: { likeCount: -1, createdAt: -1 } }
        : { $sort: { createdAt: -1 } }
    ].filter(Boolean); // This removes any null/undefined stages

    const posts = await Post.aggregate(aggregationPipeline);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json();
    const { title, content, userId, username } = json;

    if (!title || !content || !userId || !username) {
      return NextResponse.json(
        { error: "すべての必須フィールドを入力してください" },
        { status: 400 },
      );
    }

    const post = await Post.create({
      title,
      content,
      userId,
      username,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "投稿の作成に失敗しました" },
      { status: 500 },
    );
  }
}
