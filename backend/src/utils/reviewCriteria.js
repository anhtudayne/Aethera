export const REVIEW_CRITERIA = {
    AUDIO_POOR: {
        id: 'AUDIO_POOR',
        label: 'Poor Audio Quality',
        description: 'The video audio is too quiet, distorted, or contains excessive background noise, making it difficult for learners to understand.'
    },
    VIDEO_WATERMARK: {
        id: 'VIDEO_WATERMARK',
        label: 'Video contains unknown watermarks/logos',
        description: 'The video contains watermarks, logos from other apps (e.g. TikTok, CapCut) or brands unrelated to the course.'
    },
    CONTENT_TOO_SHORT: {
        id: 'CONTENT_TOO_SHORT',
        label: 'Content duration is too short',
        description: 'The total duration of the course does not meet the minimum requirement (at least 15 minutes of video content).'
    },
    MISSING_DESCRIPTION: {
        id: 'MISSING_DESCRIPTION',
        label: 'Missing detailed description',
        description: 'The course description is too brief. Please provide more detailed information about the content, target audience, and course objectives.'
    },
    INAPPROPRIATE_CONTENT: {
        id: 'INAPPROPRIATE_CONTENT',
        label: 'Inappropriate content',
        description: 'The course contains content that is not suitable for the platform (e.g. offensive language, violence, or violating platform policies).'
    },
    MISSING_THUMBNAIL: {
        id: 'MISSING_THUMBNAIL',
        label: 'Missing course thumbnail',
        description: 'Please upload a representative image (Thumbnail) for the course to help students easily recognize your course.'
    }
};

export const getReviewCriteriaById = (id) => {
    return REVIEW_CRITERIA[id] || {
        id,
        label: 'Other Reason',
        description: 'Please refer to the detailed notes for more information.'
    };
};