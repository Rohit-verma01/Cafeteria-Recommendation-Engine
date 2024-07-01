import { MenuItemRepository } from "../repositories/menuItemRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private recommendedItemRepository: RecommendedMenuRepository;
  private notificationRepository: NotificationRepository;

  constructor() {
    this.menuItemRepository = new MenuItemRepository();
    this.recommendedItemRepository = new RecommendedMenuRepository();
    this.notificationRepository = new NotificationRepository();
  }

  async viewMenu() {
    try {
      return await this.menuItemRepository.getAllMenuItems();
    } catch (error) {
      console.error("Error in service while fetching menu items:", error);
      return "Failed to fetch menu items.";
    }
  }

  async addItem(item: any) {
    try {
      return  await this.menuItemRepository.addMenuItem(item);
    } catch (error) {
      console.error("Error in service while adding menu item:", error);
      return {success:false,message:"Failed to add menu item."};
    }
  }

  async updateItem(item: any) {
    try {
      return await this.menuItemRepository.updateMenuItem(item);
    } catch (error) {
      console.error("Error in service while updating menu item:", error);
      return {success:false,message:"Failed to update menu item."};
    }
  }

  async deleteItem(name: any) {
    try {
      return await this.menuItemRepository.deleteMenuItem(name);
    } catch (error) {
      console.error("Error in service while deleting menu item:", error);
      return {success:false,message:`Failed to delete menu item "${name}".`};
    }
  }

  async addItemInRecommendedMenu(item: any) {
    try {
      return await this.recommendedItemRepository.addItem(item);
    } catch (error) {
      console.error(
        "Error in service while adding item to recommended menu:",
        error
      );
      return {success:false,message:"Failed to add item to recommended menu."};
    }
  }

  async addItemInFinalMenu(){
    try {
      return await this.menuItemRepository.finalizeTheMenu();
    } catch (error) {
      console.error("Error in service while finalizing the menu:", error);
      return `Failed to finalize the menu.`;
    }
  }

  async addItemSentiments(score:number,sentiment:string,foodItem:any){
    try {
      return await this.menuItemRepository.addSentiments(score,sentiment,foodItem.itemId);
    } catch (error) {
      console.error("Error in adding sentiment Score:", error);
      return `Failed to add score.`;
    }
  }

  async viewRecommendationMenu(){
    try {
      return await this.menuItemRepository.getMenuWithRecommendation();
    } catch (error) {
      console.error("Error in getting Recommendation", error);
      return `Failed to view recommendation.`;
    }
  }
}
