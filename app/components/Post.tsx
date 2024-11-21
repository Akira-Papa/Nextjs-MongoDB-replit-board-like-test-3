"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { User } from "../lib/user";

interface PostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    userId: string;
    username: string;
    createdAt: string;
    likes: any[];
  };
  currentUser: User;
  onDelete: (postId: string) => Promise<void>;
  onEdit: (postId: string, title: string, content: string) => Promise<void>;
}

export default function Post({
  post,
  currentUser,
  onDelete,
  onEdit,
}: PostProps) {
  const isOwner = currentUser?.userId === post.userId;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((like) => like.userId === currentUser?.userId) || false,
  );
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking || !currentUser) return;
    setIsLiking(true);

    const userId = currentUser.userId;

    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setIsLiked(!isLiked);

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.userId }),
      });

      if (!response.ok) {
        setLikeCount(likeCount);
        setIsLiked(isLiked);
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      setLikeCount(data.likeCount);
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = async () => {
    try {
      await onEdit(post._id, editTitle, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (isEditing) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
        <TextField
          label="ニックネーム"
          fullWidth
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="あきらパパ"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          label="質問・感想"
          multiline
          rows={4}
          fullWidth
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Replit Agentめっちゃすげえ〜"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsEditing(false)}
          >
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleEdit}>
            更新
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            wordBreak: "break-word",
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {post.content}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          suppressHydrationWarning
          sx={{ mb: 1 }}
        >
          {new Date(post.createdAt).toLocaleDateString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          gap: 1,
        }}
      >
        <Tooltip title={isLiked ? "いいねを取り消す" : "いいね"}>
          <IconButton
            onClick={handleLike}
            disabled={isLiking}
            color={isLiked ? "error" : "default"}
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {likeCount}
            </Typography>
          </IconButton>
        </Tooltip>
        {isOwner && (
          <>
            <Tooltip title="編集">
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="削除">
              <IconButton onClick={() => onDelete(post._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Paper>
  );
}
