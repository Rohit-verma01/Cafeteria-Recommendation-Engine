import { FeedbackRepository } from "../repositories/feedbackRepository";
import { MenuItemRepository } from "../repositories/menuItemRepository";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";

export class FeedbackService {
    private menuItemRepository: MenuItemRepository;
    private feedbackRepository: FeedbackRepository
  
    constructor() {
      this.menuItemRepository = new MenuItemRepository();
      this.feedbackRepository = new FeedbackRepository();
    }
  
    async sendFeedback(payload: any, user: any) {
        try {
          return await this.feedbackRepository.sendFeedback(payload, user);
        } catch (error:any) {
            console.log("error = ",error.message)
          throw new Error(error.message);
        }
      }
  
    async addItem(item: any) {
      return await this.menuItemRepository.addMenuItem(item);
    }
  
    async updateItem(item: any) {
      return await this.menuItemRepository.updateMenuItem(item);
    }
  
    async deleteItem(name: any) {
      return await this.menuItemRepository.deleteMenuItem(name);
    }

    
  }