import { FeedbackRepository } from "../repositories/feedbackRepository";
import { negativeWords, positiveWords } from "../utils/constants";
import { getTopWords } from "../utils/serverUtils";

export class RecommendationService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async sentimentAnalysis(foodItem: any) {
    try {
      const data: any = await this.feedbackRepository.getFeedbackByItemId(
        foodItem.itemId
      );
      const comments = data.map((item: { comment: string }) => item.comment);
      const { sentimentSummary, sentimentScore } =
        this.sentimentsAndScore(comments);
      return {
        success: true,
        score: sentimentScore,
        summary: sentimentSummary,
      };
    } catch (error) {
      console.error(
        "Unknown error in Recommendation Service while analyzing  sentiment:",
        error
      );
      return { success: false, score: 0 };
    }
  }

  sentimentsAndScore(comments: string[]) {
    const positiveWeight = 1; // Weight for positive words
    const negativeWeight = -1; // Weight for negative words
    let positiveSentiments: string[] = [];
    let negativeSentiments: string[] = [];

    let score = 0;

    comments.forEach((comment) => {
      const words = comment.toLowerCase().match(/\b\w+\b/g);
      if (words) {
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (positiveWords.includes(word)) {
            score += positiveWeight;
            positiveSentiments.push(word);
          } else if (negativeWords.includes(word)) {
            negativeSentiments.push(word);
            score += negativeWeight;
          } else if (word === "not" && i < words.length - 1) {
            const nextWord = words[i + 1];
            if (positiveWords.includes(nextWord)) {
              negativeSentiments.push(`not ${nextWord}`);
              score += negativeWeight;
            } else if (negativeWords.includes(nextWord)) {
              positiveSentiments.push(`not ${nextWord}`);
              score += positiveWeight;
            }
            i++;
          }
        }
      }
    });
    const sentimentScore = this.normalizaScore(score, comments.length);
    const sentimentSummary = this.generateSentimentSUmmary(
      positiveSentiments,
      negativeSentiments
    );
    return { sentimentSummary, sentimentScore };
  }

  normalizaScore(score: number, totalComments: number) {
    const num = score / totalComments;
    if (num > 5) return 5;
    if (num < -5) return -5;
    return num;
  }

  generateSentimentSUmmary(
    positiveSentiments: string[],
    negativeSentiments: string[]
  ) {
    const topPositive = getTopWords(positiveSentiments, 3);
    const topNegative = getTopWords(negativeSentiments, 3);
    const positiveSummary =
      topPositive.length > 0
        ? `The food received positive feedback for being: ${topPositive.join(
            ", "
          )}`
        : "There were no positive comments about the food.";

    const negativeSummary =
      topNegative.length > 0
        ? `However, there were some negative comments, such as: ${topNegative.join(
            ", "
          )}`
        : "There were no negative comments about the food.";

    return `${positiveSummary}. ${negativeSummary}.`;
  }
}
