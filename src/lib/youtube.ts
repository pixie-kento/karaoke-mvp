import { YouTubeVideo } from '@/types'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

export interface YouTubeSearchParams {
  query: string
  maxResults?: number
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[]
  error?: string
}

/**
 * Search YouTube for karaoke videos
 * Filters results to only include videos with "karaoke" in the title
 */
export async function searchYouTubeKaraoke(
  params: YouTubeSearchParams
): Promise<YouTubeSearchResponse> {
  if (!YOUTUBE_API_KEY) {
    return {
      items: [],
      error: 'YouTube API key not configured',
    }
  }

  const searchQuery = `${params.query} karaoke`
  const maxResults = params.maxResults || 10

  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        items: [],
        error: errorData.error?.message || 'Failed to search YouTube',
      }
    }

    const data = await response.json()

    // Filter to only include videos with "karaoke" in the title (case-insensitive)
    const karaokeVideos = (data.items || [])
      .filter((item: any) => {
        const title = item.snippet?.title?.toLowerCase() || ''
        return title.includes('karaoke')
      })
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channelName: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }))

    return {
      items: karaokeVideos,
    }
  } catch (error) {
    console.error('YouTube search error:', error)
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Check if YouTube API quota is available
 * Returns true if we can make requests, false if quota is likely exceeded
 */
export function checkYouTubeQuota(error: any): boolean {
  if (!error) return true

  const errorMessage = error.message?.toLowerCase() || ''
  return !errorMessage.includes('quota') && !errorMessage.includes('exceeded')
}

