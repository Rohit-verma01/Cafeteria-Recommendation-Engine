import { RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";
import { FeedbackRepository } from "../repositories/feedbackRepository";
import { negativeWords, positiveWords } from "../utils/constants";

export class RecommendationService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async sentimentAnalysis(foodItem:any) {
    try {
     const data:any = await this.feedbackRepository.getFeedbackByItemId(foodItem.itemId);
     const comments = data.map((item:{comment:string})=>item.comment)
     const score = this.sentimentScore(comments)
     console.log("Score in servie = ",score)
     return {success:true,score:score};
    } catch (error) {
      console.error(
        "Unknown error in Recommendation Service while analyzing  sentiment:",
        error
      );
      return { success: false, score: 0 };
    }
  }

   sentimentScore(comments:string[]){
    const positiveWeight = 1; // Weight for positive words
    const negativeWeight = -1; // Weight for negative words

    let score = 0;

    // Calculate sentiment score
    comments.forEach(comment => {
        const words = comment.toLowerCase().match(/\b\w+\b/g); // Extract words from comment
        if (words) {
            words.forEach(word => {
                if (positiveWords.includes(word)) {
                    score += positiveWeight;
                } else if (negativeWords.includes(word)) {
                    score += negativeWeight;
                } else if (word === 'not' && words.indexOf(word) < words.length - 1) {
                    const nextWord = words[words.indexOf(word) + 1];
                    if (positiveWords.includes(nextWord)) {
                        score += negativeWeight; // If "not" precedes a positive word
                    } else if (negativeWords.includes(nextWord)) {
                        score += positiveWeight; // If "not" precedes a negative word
                    }
                }
            });
        }
    });
    const sentimentScore = this.normalizaScore(score,comments.length);
    return sentimentScore;
  }

  normalizaScore(score:number,totalComments:number){
        const num = score/totalComments;
        if(num>5)
            return 5;
        if(num<-5)
            return -5;
        return num
  }
}
