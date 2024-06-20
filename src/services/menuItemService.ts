import { MenuItemRepository } from "../repositories/menuItemRepository";

export class MenuItemService {
    private menuItemRepository: MenuItemRepository;
  
    constructor() {
      this.menuItemRepository = new MenuItemRepository();
    }
  
    async viewMenu() {
      // Implement viewMenu functionality
      return await this.menuItemRepository.getAllMenuItems();
    }
  
    async addItem(item: any) {
      return await this.menuItemRepository.addMenuItem(item);
    }
  
    async updateItem(item: any) {
      return await this.menuItemRepository.updateMenuItem(item);
    }
  
    async deleteItem(name: any) {
      // Implement deleteItem functionality
      return await this.menuItemRepository.deleteMenuItem(name);
    }
  }