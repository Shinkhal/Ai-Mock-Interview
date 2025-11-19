// utils/scoring.js

/**
 * IMPROVED SCORING ALGORITHM (v2)
 * --------------------------------
 * Features added:
 * - Weighted + semantic keyword scoring
 * - Filler ratio instead of raw filler count
 * - Structure scoring (intro, example, conclusion)
 * - Fluency scoring using sentence length & filler ratio
 * - Completeness scoring using word count + lexical diversity
 * - Basic grammar scoring (run-on detection)
 * - Actionable, detailed feedback generation
 */

/**
 * Helper: Normalize text
 */
const normalize = (str) =>
  str.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Helper: Check semantic keyword match
 */
const matchesSemantic = (transcript, keywordObj) => {
  const { word, synonyms = [] } = keywordObj;
  const all = [word.toLowerCase(), ...synonyms.map((s) => s.toLowerCase())];
  return all.some((w) => transcript.includes(w));
};

/**
 * Helper: Calculate filler ratio
 */
const getFillerStats = (transcript) => {
  const fillers = [
    "um", "uh", "like", "you know", "umm", "actually", "basically",
    "i mean", "kinda", "sort of", "right?", "so"
  ];

  const fillerRegex = new RegExp(`\\b(${fillers.join("|")})\\b`, "gi");
  const matches = transcript.match(fillerRegex) || [];

  return matches.length;
};

/**
 * Helper: Sentence segmentation
 */
const splitSentences = (text) =>
  text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);

/**
 * Main scoring function
 */
export const scoreAnswer = (rawTranscript = "", expectedKeywords = []) => {
  const transcript = normalize(rawTranscript);

  if (!transcript) return 0;

  const words = transcript.split(" ");
  const wordCount = words.length;

  // ---------------------------------------------------------------------
  // 1. WEIGHTED KEYWORD SCORE (40%)
  // ---------------------------------------------------------------------
  let matchedWeight = 0;
  let totalWeight = 0;

  expectedKeywords.forEach((kw) => {
    totalWeight += kw.weight ?? 1;
    if (matchesSemantic(transcript, kw)) matchedWeight += (kw.weight ?? 1);
  });

  const keywordScore =
    totalWeight === 0 ? 10 : (matchedWeight / totalWeight) * 10;

  // ---------------------------------------------------------------------
  // 2. FILLER RATIO (5% penalty via fluency)
  // ---------------------------------------------------------------------
  const fillerCount = getFillerStats(transcript);
  const fillerRatio = fillerCount / Math.max(wordCount, 1);

  // ---------------------------------------------------------------------
  // 3. FLUENCY SCORE (20%)
  // Uses:
  // - sentence length
  // - filler ratio
  // - run-on detection
  // ---------------------------------------------------------------------
  const sentences = splitSentences(transcript);

  let fluencyScore = 10;

  // Too many long sentences (25+ words)
  const longSentences = sentences.filter((s) => s.split(" ").length > 25).length;
  if (longSentences >= 2) fluencyScore -= 2;

  // Very short sentences → choppy
  const shortSentences = sentences.filter((s) => s.split(" ").length <= 4).length;
  if (shortSentences > 3) fluencyScore -= 1;

  // Filler penalty
  if (fillerRatio > 0.03) fluencyScore -= 2;
  if (fillerRatio > 0.06) fluencyScore -= 3;

  fluencyScore = Math.max(0, fluencyScore);

  // ---------------------------------------------------------------------
  // 4. STRUCTURE SCORE (20%)
  // Check for:
  // intro, explanation, example, conclusion
  // ---------------------------------------------------------------------
  let structureScore = 0;

  if (transcript.startsWith("so") || transcript.startsWith("the") || transcript.startsWith("in my opinion"))
    structureScore += 2; // intro

  if (transcript.includes("because") || transcript.includes("this means"))
    structureScore += 3; // explanation

  if (transcript.includes("for example") || transcript.includes("for instance"))
    structureScore += 3; // example

  if (transcript.includes("in summary") || transcript.includes("overall"))
    structureScore += 2; // conclusion

  structureScore = Math.min(10, structureScore);

  // ---------------------------------------------------------------------
  // 5. COMPLETENESS SCORE (15%)
  // Combines:
  // - word count target (40–80 optimal)
  // - lexical diversity check
  // ---------------------------------------------------------------------
  let completenessScore = 0;

  // Word count scaling (target 40+)
  completenessScore += Math.min(10, (wordCount / 40) * 7);

  // Diversity (unique words / total)
  const uniqueWords = new Set(words).size;
  const diversity = uniqueWords / wordCount;

  if (diversity > 0.55) completenessScore += 3;
  completenessScore = Math.min(10, completenessScore);

  // ---------------------------------------------------------------------
  // FINAL WEIGHTED SCORE
  // ---------------------------------------------------------------------
  const finalScore =
    keywordScore * 0.4 +
    fluencyScore * 0.2 +
    structureScore * 0.2 +
    completenessScore * 0.15;

  return Math.round(finalScore * 10) / 10;
};

/**
 * Feedback generator (detailed and actionable)
 */
export const generateFeedback = (rawTranscript = "", expectedKeywords = []) => {
  const transcript = normalize(rawTranscript);
  const words = transcript.split(" ");
  const wordCount = words.length;

  let feedback = [];

  // ------------------------------------------------------
  // Missing keyword feedback
  // ------------------------------------------------------
  const missing = expectedKeywords
    .filter((kw) => !matchesSemantic(transcript, kw))
    .map((kw) => kw.word);

  if (missing.length)
    feedback.push(`Try including key points such as: ${missing.join(", ")}.`);
  else
    feedback.push("Great job! You covered all the important concepts.");

  // ------------------------------------------------------
  // Filler feedback
  // ------------------------------------------------------
  const fillerCount = getFillerStats(transcript);
  const fillerRatio = fillerCount / Math.max(wordCount, 1);

  if (fillerRatio > 0.05)
    feedback.push(`Try reducing filler words. Your filler ratio is ${(fillerRatio * 100).toFixed(1)}%.`);

  // ------------------------------------------------------
  // Completeness feedback
  // ------------------------------------------------------
  if (wordCount < 25)
    feedback.push("Try providing a more detailed explanation with examples.");
  else if (wordCount > 90)
    feedback.push("Try being more concise and stick to the core points.");

  // ------------------------------------------------------
  // Structure feedback
  // ------------------------------------------------------
  if (!transcript.includes("for example"))
    feedback.push("Add an example to strengthen your answer.");

  if (!transcript.includes("in summary") && !transcript.includes("overall"))
    feedback.push("End with a short conclusion to summarize your points.");

  return feedback;
};
