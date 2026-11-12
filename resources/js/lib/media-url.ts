export type VideoPlatform =
    | 'direct'
    | 'youtube'
    | 'instagram'
    | 'tiktok'
    | 'vimeo'
    | 'gdrive'
    | 'facebook';

export interface ParsedVideo {
    platform: VideoPlatform;
    label: string;
    embedUrl: string;
    heroEmbedUrl: string;
    thumbnailUrl: string | null;
    originalUrl: string;
    isVertical: boolean;
    isDirect: boolean;
}

const DIRECT_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

/**
 * Ekstrak ID file Google Drive dari berbagai pola URL sharing Drive.
 */
export function extractGoogleDriveId(rawUrl: string): string | null {
    if (!rawUrl || !rawUrl.includes('drive.google.com')) return null;

    const fileMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    const idParamMatch = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch) return idParamMatch[1];

    return null;
}

/**
 * Konversi link gambar Google Drive agar bisa tampil langsung pada tag <img>.
 */
export function resolveImageUrl(rawUrl?: string | null): string {
    if (!rawUrl) return '';
    const trimmed = rawUrl.trim();
    const driveId = extractGoogleDriveId(trimmed);
    if (driveId) {
        return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
    }
    return trimmed;
}

/**
 * Parse berbagai link URL video (Instagram Reel, YouTube, TikTok, Vimeo, Google Drive, Facebook, atau file MP4 langsung).
 */
export function parseVideoUrl(rawUrl?: string | null): ParsedVideo {
    const url = (rawUrl || '').trim();

    if (!url) {
        return {
            platform: 'direct',
            label: 'Video',
            embedUrl: '',
            heroEmbedUrl: '',
            thumbnailUrl: null,
            originalUrl: '',
            isVertical: false,
            isDirect: true,
        };
    }

    // 1. YouTube (watch, youtu.be, shorts, live, embed)
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?.*?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) {
        const videoId = ytMatch[1];
        const isShorts = url.includes('/shorts/');
        return {
            platform: 'youtube',
            label: isShorts ? 'YouTube Shorts' : 'YouTube Video',
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
            heroEmbedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            originalUrl: url,
            isVertical: isShorts,
            isDirect: false,
        };
    }

    // 2. Instagram (reel, reels, p, tv)
    const igMatch = url.match(
        /instagram\.com\/(?:[^/]+\/)?(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i,
    );
    if (igMatch) {
        const rawSegment = igMatch[1].toLowerCase();
        const segment = rawSegment === 'reels' ? 'reel' : rawSegment;
        const code = igMatch[2];
        const embedUrl = `https://www.instagram.com/${segment}/${code}/embed/`;
        return {
            platform: 'instagram',
            label: segment === 'reel' ? 'Instagram Reel' : 'Instagram Video',
            embedUrl,
            heroEmbedUrl: embedUrl,
            thumbnailUrl: null,
            originalUrl: url,
            isVertical: segment === 'reel',
            isDirect: false,
        };
    }

    // 3. TikTok (@user/video/ID)
    const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
    if (ttMatch) {
        const videoId = ttMatch[1];
        const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
        return {
            platform: 'tiktok',
            label: 'TikTok Video',
            embedUrl,
            heroEmbedUrl: embedUrl,
            thumbnailUrl: null,
            originalUrl: url,
            isVertical: true,
            isDirect: false,
        };
    }

    // 4. Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        return {
            platform: 'vimeo',
            label: 'Vimeo Video',
            embedUrl: `https://player.vimeo.com/video/${videoId}`,
            heroEmbedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`,
            thumbnailUrl: null,
            originalUrl: url,
            isVertical: false,
            isDirect: false,
        };
    }

    // 5. Google Drive Video
    const driveId = extractGoogleDriveId(url);
    if (driveId) {
        const embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
        return {
            platform: 'gdrive',
            label: 'Google Drive Video',
            embedUrl,
            heroEmbedUrl: embedUrl,
            thumbnailUrl: null,
            originalUrl: url,
            isVertical: false,
            isDirect: false,
        };
    }

    // 6. Facebook Video / Reel
    if (
        url.includes('facebook.com/') &&
        (url.includes('/videos/') || url.includes('/reel/') || url.includes('/watch'))
    ) {
        const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
        return {
            platform: 'facebook',
            label: url.includes('/reel/') ? 'Facebook Reel' : 'Facebook Video',
            embedUrl,
            heroEmbedUrl: embedUrl,
            thumbnailUrl: null,
            originalUrl: url,
            isVertical: url.includes('/reel/'),
            isDirect: false,
        };
    }

    // 7. Default Direct Video (.mp4, .webm, /storage/..., blob:...)
    return {
        platform: 'direct',
        label: 'Video MP4',
        embedUrl: url,
        heroEmbedUrl: url,
        thumbnailUrl: null,
        originalUrl: url,
        isVertical: false,
        isDirect: true,
    };
}

/**
 * Deteksi apakah sebuah media URL / File berjenis video atau gambar.
 */
export function detectMediaType(
    url: string,
    file?: File | null,
    explicitType?: 'video' | 'image',
): 'video' | 'image' {
    if (file) {
        return file.type.startsWith('video/') ? 'video' : 'image';
    }

    if (!url) {
        return explicitType || 'image';
    }

    const lowerUrl = url.toLowerCase();
    const isDirectVideoExt = DIRECT_VIDEO_EXTENSIONS.some(
        (ext) =>
            lowerUrl.endsWith(ext) ||
            lowerUrl.includes(`${ext}?`) ||
            lowerUrl.includes(`${ext}#`),
    );
    if (isDirectVideoExt) return 'video';

    const parsed = parseVideoUrl(url);
    if (!parsed.isDirect && parsed.platform !== 'gdrive') {
        return 'video';
    }

    if (parsed.platform === 'gdrive' && explicitType === 'video') {
        return 'video';
    }

    return explicitType === 'video' && !lowerUrl.match(/\.(jpe?g|png|gif|webp|svg)(\?|#|$)/i)
        ? 'video'
        : 'image';
}

