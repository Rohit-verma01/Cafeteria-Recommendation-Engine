import { FeedbackRepository } from "../repositories/feedbackRepository";
import { MenuItemService } from "./menuItemService";
import { RecommendationService } from "./recommendationService";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;
  private menuItemSerive: MenuItemService;
  private recommendationService: RecommendationService;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
    this.recommendationService = new RecommendationService();  
    this.menuItemSerive = new MenuItemService();  
  }

  async sendFeedback(payload: any, user: any) {
    try {
      const result = await this.feedbackRepository.sendFeedback(payload, user);
      if (result.success) {
        const sentiment = await this.recommendationService.sentimentAnalysis(
          payload
        );
        if(sentiment.success){
          await this.menuItemSerive.addItemSentiments(sentiment.score!,sentiment.summary!,payload)
        }
      }
      return result.message;
    } catch (error) {
      console.error(
        "Unknown error in FeedbackService while sending feedback:",
        error
      );
      return { success: false, message: "Failed to send feedback." };
    }
  }
}
