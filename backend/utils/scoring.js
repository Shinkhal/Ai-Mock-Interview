// utils/scoring.js

/**
 * scoreAnswer()
 * ---------------
 * Generates a score (0–10) based on:
 * - Keyword match
 * - Filler word presence
 * - Fluency (words per second estimate)
 * - Completeness (word count)
 */

export const scoreAnswer = (transcript = "", expectedKeywords = []) => {
  transcript = transcript.toLowerCase().trim();

  if (!transcript || transcript.length === 0) {
    return 0; // no answer
  }

  const words = transcript.split(/\s+/).filter(w => w.length > 0);

  // ---------------------------
  // 1. Keyword score (40%)
  // ---------------------------
  let keywordHits = 0;
  expectedKeywords.forEach((kw) => {
    if (transcript.includes(kw.toLowerCase())) {
      keywordHits++;
    }
  });

  const keywordScore =
    expectedKeywords.length === 0
      ? 10
      : (keywordHits / expectedKeywords.length) * 10;

  // ---------------------------
  // 2. Filler word penalty (affects fluency)
  // ---------------------------
  const fillers = transcript.match(/\b(um|uh|like|you know|umm)\b/gi) || [];
  const fillerCount = fillers.length;
  const fillerPenalty = Math.min(3, fillerCount); // cap penalty

  // ---------------------------
  // 3. Fluency score (25%)
  // Ideal pace ~ 130–170 wpm → approx 2–3 words/sec (rough estimate)
  // ---------------------------
  const estimatedDurationSeconds = words.length / 2; 
  const wordsPerSec = words.length / Math.max(estimatedDurationSeconds, 1);

  let fluencyScore = 10;

  // penalize if speaking too slow or too fast
  if (wordsPerSec < 1) fluencyScore -= 3;    // too slow
  if (wordsPerSec > 4) fluencyScore -= 2;    // too fast

  fluencyScore -= fillerPenalty; // filler penalty affects fluency
  fluencyScore = Math.max(0, fluencyScore);

  // ---------------------------
  // 4. Completeness score (20%)
  // 40+ words considered a complete answer
  // ---------------------------
  const completenessScore = Math.min(10, (words.length / 40) * 10);

  // ---------------------------
  // 5. Final weighted score
  // ---------------------------
  const finalScore =
    keywordScore * 0.4 +
    fluencyScore * 0.25 +
    completenessScore * 0.35;

  return Math.round(finalScore * 10) / 10; // round to 1 decimal
};


/**
 * generateFeedback()
 * -------------------
 * Generates textual feedback based on keyword misses,
 * filler words, completeness, and fluency.
 */

export const generateFeedback = (transcript = "", expectedKeywords = []) => {
  transcript = transcript.toLowerCase();

  let feedback = [];

  // Keyword feedback
  const missingKeywords = expectedKeywords.filter(
    (kw) => !transcript.includes(kw.toLowerCase())
  );
  if (missingKeywords.length > 0) {
    feedback.push(`Try including: ${missingKeywords.join(", ")}`);
  } else {
    feedback.push("Great! You covered all the key concepts.");
  }

  // Filler words
  const fillerMatches = transcript.match(/\b(um|uh|like|you know|umm)\b/gi) || [];
  if (fillerMatches.length > 2) {
    feedback.push("Try reducing filler words like 'um', 'uh', 'like'.");
  }

  // Completeness
  const wordCount = transcript.split(/\s+/).length;
  if (wordCount < 25) {
    feedback.push("Try giving a more detailed answer with examples.");
  }

  // Fluency
  if (wordCount > 80) {
    feedback.push("Try being more concise and sticking to the main points.");
  }

  return feedback;
};
