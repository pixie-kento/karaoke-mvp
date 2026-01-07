import { useQuery } from '@tanstack/react-query'
import { searchYouTubeKaraoke, YouTubeSearchParams } from '@/lib/youtube'

export function useYouTubeSearch(params: YouTubeSearchParams) {
  return useQuery({
    queryKey: ['youtube-search', params.query],
    queryFn: () => searchYouTubeKaraoke(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

