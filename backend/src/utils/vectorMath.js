function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    if (vecA.length !== vecB.length) {
        console.warn("Hai vector không cùng số chiều");
        return 0;
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { cosineSimilarity };
