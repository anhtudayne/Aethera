import { cosineSimilarity } from '../utils/vectorMath.js';

/**
 * Retrieves the most relevant context chunks based on vector similarity,
 * including adjacent chunks for context preservation (Windowing).
 *
 * @param {Array} queryVector - The embedding vector of the user query.
 * @param {Array} chunks - The array of transcript chunks, each with an embedding.
 * @param {Object} options - Options for retrieval (threshold, maxWindows).
 * @returns {Object} - An object containing contextText and sources.
 */
export const retrieveRelevantContext = (queryVector, chunks, options = {}) => {
    const threshold = options.threshold || 0.7; // Tùy chỉnh theo yêu cầu, mặc định 0.7
    const maxWindows = options.maxWindows || 4; // Số lượng chunk cốt lõi (chưa tính windowing)

    if (!queryVector || queryVector.length === 0 || !chunks || chunks.length === 0) {
        return { contextText: "[Context]: No relevant data found in this video.", sources: [] };
    }

    // 1. Tính toán điểm Cosine Similarity cho từng chunk
    const scoredChunks = chunks.map((chunk, index) => {
        const score = chunk.embedding ? cosineSimilarity(queryVector, chunk.embedding) : 0;
        return { ...chunk, originalIndex: index, score };
    });

    // 2. Lọc các chunk qua ngưỡng threshold và sắp xếp điểm giảm dần
    const relevantChunks = scoredChunks
        .filter(c => c.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxWindows); // Chỉ lấy tối đa N chunk tốt nhất làm hạt nhân

    // 3. Xử lý Fallback: Không có chunk nào thoả mãn
    if (relevantChunks.length === 0) {
        return {
            contextText: "[Context]: No relevant data found in this video.",
            sources: []
        };
    }

    // 4. Windowing: Lấy thêm ngữ cảnh xung quanh (i-1 và i+1)
    const indicesToInclude = new Set();
    relevantChunks.forEach(chunk => {
        const i = chunk.originalIndex;
        if (i > 0) indicesToInclude.add(i - 1);
        indicesToInclude.add(i);
        if (i < chunks.length - 1) indicesToInclude.add(i + 1);
    });

    // 5. Sắp xếp lại các index để duy trì đúng thứ tự thời gian của video
    const sortedIndices = Array.from(indicesToInclude).sort((a, b) => a - b);

    // 6. Xây dựng Context Text và trích xuất Sources
    const finalChunks = sortedIndices.map(index => chunks[index]);

    const contextText = finalChunks.map(c => `[${c.start_time} - ${c.end_time}]: ${c.text}`).join('\n');
    const sources = finalChunks.map(c => ({ start: c.start_time, end: c.end_time }));

    return { contextText, sources };
};
