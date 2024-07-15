import { MenuItemRepository } from "../repositories/menuItemRepository";

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor() {
    this.menuItemRepository = new MenuItemRepository();
  }

  async viewMenu() {
    try {
      return await this.menuItemRepository.getAllMenuItems();
    } catch (error) {
      return "Failed to fetch menu items.";
    }
  }

  async addItem(item: any) {
    try {
      return await this.menuItemRepository.addMenuItem(item);
    } catch (error) {
      return { success: false, message: "Failed to add menu item." };
    }
  }

  async updateItem(item: any) {
    try {
      return await this.menuItemRepository.updateMenuItem(item);
    } catch (error) {
      return { success: false, message: "Failed to update menu item." };
    }
  }

  async deleteItem(name: any) {
    try {
      return await this.menuItemRepository.deleteMenuItem(name);
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete menu item "${name}".`,
      };
    }
  }

  async getItemName(itemId: number) {
    try {
      return await this.menuItemRepository.getItemName(itemId);
    } catch (error) {
      return { success: false, message: `Failed to get menu item name.` };
    }
  }

  async addItemInFinalMenu(payload: any) {
    if (!payload.proceed) return payload.message;
    try {
      return await this.menuItemRepository.finalizeTheMenu(payload.message);
    } catch (error) {
      return `Failed to finalize the menu.`;
    }
  }

  async addItemSentiments(score: number, sentiment: string, foodItem: any) {
    try {
      return await this.menuItemRepository.addSentiments(
        score,
        sentiment,
        foodItem.itemId
      );
    } catch (error) {
      return "Failed to adding the sentiments.\n";
    }
  }

  async viewRecommendationMenu() {
    try {
      return await this.menuItemRepository.getMenuWithRecommendation();
    } catch (error) {
      return `Failed to view recommendation.`;
    }
  }

  async checkMenuFinalize() {
    try {
      return await this.menuItemRepository.checkFinalMenu();
    } catch (error) {
      return "Error while checking the final menu";
    }
  }
}
