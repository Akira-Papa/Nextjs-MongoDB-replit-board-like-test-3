export interface Post {
  _id: string
  title: string
  content: string
  userId: string
  username: string
  createdAt: string
  updatedAt: string
  likes: Array<{
    _id: string
    postId: string
    userId: string
    createdAt: string
  }>
}

export interface LikeResponse {
  likeCount: number
  message: string
  isLiked: boolean
}

export interface CreatePostData {
  title: string
  content: string
  userId: string
  username: string
}
