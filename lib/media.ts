/** Helpers for turning the stored sermon video/audio URLs into something playable. */

export type VideoType = 'youtube' | 'facebook' | 'other';

export function getVideoType(url?: string | null): VideoType | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  return 'other';
}

export function extractYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return match ? match[1] : null;
}

/** The stored thumbnail, or a YouTube still derived from the video URL. */
export function sermonThumbnail(sermon: { thumbnailUrl?: string | null; videoUrl?: string | null }) {
  if (sermon.thumbnailUrl) return sermon.thumbnailUrl;
  if (sermon.videoUrl && getVideoType(sermon.videoUrl) === 'youtube') {
    const id = extractYouTubeId(sermon.videoUrl);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
}

export const isDirectAudio = (url?: string | null) =>
  !!url && /\.(mp3|m4a|aac|wav|ogg|oga)(\?.*)?$/i.test(url);
