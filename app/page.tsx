'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { getCurrentUser, User } from './lib/user'
import Post from './components/Post'
import { Box, Paper, TextField, Button, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Post as PostType } from '@/app/types/post'

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest')
  const [isSorting, setIsSorting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    fetchPosts()
  }, [])

  const handleSortChange = async (
    _event: React.MouseEvent<HTMLElement>,
    newSort: 'newest' | 'likes'
  ) => {
    if (newSort !== null && newSort !== sortBy) {
      setSortBy(newSort)
      fetchPosts(newSort)
    }
  }

  const fetchPosts = async (sortOrder: 'newest' | 'likes' = sortBy, search: string = searchTerm) => {
    setIsSorting(true)
    setIsSearching(!!search)
    try {
      const searchParams = new URLSearchParams({
        sort: sortOrder,
        ...(search && { search })
      });
      const response = await fetch(`/api/posts?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setIsSorting(false)
      setIsSearching(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      fetchPosts(sortBy, search);
    }, 500),
    [sortBy]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchTerm(search);
    debouncedSearch(search);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || isSubmitting || !currentUser) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          userId: currentUser.userId,
          username: currentUser.username,
        }),
      })

      if (response.ok) {
        const newPost = await response.json()
        setPosts([newPost, ...posts])
        setTitle('')
        setContent('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.userId }),
      })
      
      if (response.ok) {
        // Fetch latest posts after successful deletion
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEdit = async (postId: string, newTitle: string, newContent: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          userId: currentUser.userId,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update post')
      }
      
      // Fetch latest posts after successful edit
      fetchPosts()
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          placeholder="投稿を検索..."
          variant="outlined"
          InputProps={{
            endAdornment: isSearching && (
              <CircularProgress size={20} color="inherit" />
            ),
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={handleSortChange}
          aria-label="投稿の並び替え"
          disabled={isSorting}
        >
          <ToggleButton value="newest" aria-label="新着順">
            <AccessTimeIcon sx={{ mr: 1 }} />
            新着順
          </ToggleButton>
          <ToggleButton value="likes" aria-label="いいね数順">
            <FavoriteIcon sx={{ mr: 1 }} />
            いいね数順
          </ToggleButton>
        </ToggleButtonGroup>
        </Box>
      </Box>

      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力..."
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿を書いてください..."
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !currentUser}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              minWidth: 120,
              position: 'relative',
            }}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post) => (
          <Post 
            key={post._id} 
            post={post}
            currentUser={currentUser}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Box>
    </Box>
  )
}
