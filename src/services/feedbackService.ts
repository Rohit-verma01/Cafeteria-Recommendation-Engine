import { FeedbackRepository } from "../repositories/feedbackRepository";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async sendFeedback(payload: any, user: any) {
    try {
      return await this.feedbackRepository.sendFeedback(payload, user);
    } catch (error) {
      console.error(
        "Unknown error in FeedbackService while sending feedback:",
        error
      );
      return "Failed to send feedback.";
    }
  }
}
