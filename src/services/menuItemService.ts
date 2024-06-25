import { MenuItemRepository } from "../repositories/menuItemRepository";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private recommendedItemRepository: RecommendedMenuRepository;

  constructor() {
    this.menuItemRepository = new MenuItemRepository();
    this.recommendedItemRepository = new RecommendedMenuRepository();
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
      return await this.menuItemRepository.addMenuItem(item);
    } catch (error) {
      console.error("Error in service while adding menu item:", error);
      return "Failed to add menu item.";
    }
  }

  async updateItem(item: any) {
    try {
      return await this.menuItemRepository.updateMenuItem(item);
    } catch (error) {
      console.error("Error in service while updating menu item:", error);
      return "Failed to update menu item.";
    }
  }

  async deleteItem(name: any) {
    try {
      return await this.menuItemRepository.deleteMenuItem(name);
    } catch (error) {
      console.error("Error in service while deleting menu item:", error);
      return `Failed to delete menu item "${name}".`;
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
      return "Failed to add item to recommended menu.";
    }
  }
}
