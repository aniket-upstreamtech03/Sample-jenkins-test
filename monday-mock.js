/**
 * Mock Monday.com service for development and testing
 * This allows the application to work without real Monday.com credentials
 */

class MondayMock {
  static async updateMondayCom(status, message) {
    const timestamp = new Date().toISOString();
    const mockUpdate = {
      status,
      message,
      timestamp,
      mock: true,
      note: 'This is a mock update - real Monday.com integration would send this to your board'
    };
    
    console.log('📋 [MOCK] Monday.com Update:', JSON.stringify(mockUpdate, null, 2));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      mock: true,
      data: {
        update_id: `mock_${Date.now()}`,
        status: 'success',
        message: 'Mock update processed successfully'
      }
    };
  }

  static async createItem(boardId, itemName, columnValues = {}) {
    console.log(`📋 [MOCK] Creating item in board ${boardId}: ${itemName}`);
    
    return {
      success: true,
      mock: true,
      data: {
        id: `mock_item_${Date.now()}`,
        name: itemName,
        board_id: boardId,
        column_values: columnValues
      }
    };
  }

  static logMockInfo() {
    console.log('\n📋 Monday.com Mock Service Active');
    console.log('================================');
    console.log('In development mode, Monday.com updates are mocked.');
    console.log('To enable real Monday.com integration:');
    console.log('1. Set MONDAY_API_KEY environment variable');
    console.log('2. Set MONDAY_BOARD_ID environment variable');
    console.log('3. Set MONDAY_ITEM_ID environment variable');
    console.log('================================\n');
  }
}

module.exports = MondayMock;