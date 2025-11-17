const User = require('../models/userModel');
const MondayMock = require('../monday-mock');

class UserController {
  constructor() {
    // Bind methods to maintain 'this' context
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getUserStats = this.getUserStats.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.getUsersByDepartment = this.getUsersByDepartment.bind(this);
    this.getActiveUsers = this.getActiveUsers.bind(this);
  }

  // Get all users with advanced filtering
  async getAllUsers(req, res) {
    try {
      const { 
        department, 
        status, 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const filters = {};
      if (department) filters.department = department;
      if (status) filters.status = status;
      
      const users = await User.findAll(filters);
      
      // Sorting
      const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
      
      // Update Monday.com about API usage (mock in development)
      await this.updateMondayCom('API_ACCESS', `Users list accessed - Page ${page}`);
      
      res.json({
        success: true,
        data: paginatedUsers,
        pagination: {
          current: parseInt(page),
          total: users.length,
          pages: Math.ceil(users.length / limit),
          hasNext: endIndex < users.length,
          hasPrev: startIndex > 0
        },
        total: users.length,
        filters: {
          department: department || 'all',
          status: status || 'all'
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        message: error.message
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`
        });
      }
      
      await this.updateMondayCom('USER_ACCESS', `User ${id} accessed`);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
        message: error.message
      });
    }
  }

  // Create new user
  async createUser(req, res) {
    try {
      const { name, email, age, department, status = 'active' } = req.body;
      
      // Validation
      if (!name || !email || !age || !department) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'All fields are required: name, email, age, department'
        });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        });
      }
      
      // Age validation
      if (age < 18 || age > 100) {
        return res.status(400).json({
          success: false,
          error: 'Invalid age',
          message: 'Age must be between 18 and 100'
        });
      }
      
      const newUser = await User.create({
        name,
        email,
        age: parseInt(age),
        department,
        status
      });
      
      // Update Monday.com about new user creation
      await this.updateMondayCom('USER_CREATED', `New user created: ${name} (${email})`);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      console.error('Error creating user:', error.message);
      
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validate age if provided
      if (updateData.age && (updateData.age < 18 || updateData.age > 100)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid age',
          message: 'Age must be between 18 and 100'
        });
      }
      
      if (updateData.age) {
        updateData.age = parseInt(updateData.age);
      }
      
      const updatedUser = await User.update(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`
        });
      }
      
      await this.updateMondayCom('USER_UPDATED', `User ${id} updated`);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to update user',
        message: error.message
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.delete(id);
      
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`
        });
      }
      
      await this.updateMondayCom('USER_DELETED', `User ${id} (${deletedUser.name}) deleted`);
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
      });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        message: error.message
      });
    }
  }

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const stats = await User.getStats();
      
      await this.updateMondayCom('STATS_ACCESS', 'User statistics accessed');
      
      res.json({
        success: true,
        data: stats,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics',
        message: error.message
      });
    }
  }

  // Search users
  async searchUsers(req, res) {
    try {
      const { q, field = 'all' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query required',
          message: 'Please provide a search query (q parameter)'
        });
      }
      
      const users = await User.findAll();
      let searchResults = [];
      
      if (field === 'all' || field === 'name') {
        searchResults = users.filter(user => 
          user.name.toLowerCase().includes(q.toLowerCase())
        );
      }
      
      if (field === 'all' || field === 'email') {
        const emailResults = users.filter(user => 
          user.email.toLowerCase().includes(q.toLowerCase())
        );
        // Merge without duplicates
        searchResults = [...new Set([...searchResults, ...emailResults])];
      }
      
      if (field === 'all' || field === 'department') {
        const deptResults = users.filter(user => 
          user.department.toLowerCase().includes(q.toLowerCase())
        );
        searchResults = [...new Set([...searchResults, ...deptResults])];
      }
      
      await this.updateMondayCom('USER_SEARCH', `Search performed for: ${q} in field: ${field}`);
      
      res.json({
        success: true,
        data: searchResults,
        total: searchResults.length,
        query: q,
        field: field,
        searchPerformedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error searching users:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error.message
      });
    }
  }

  // Get users by department
  async getUsersByDepartment(req, res) {
    try {
      const { dept } = req.params;
      const users = await User.getUsersByDepartment(dept);
      
      await this.updateMondayCom('DEPT_ACCESS', `Department ${dept} users accessed`);
      
      res.json({
        success: true,
        data: users,
        department: dept,
        total: users.length
      });
    } catch (error) {
      console.error('Error fetching department users:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch department users',
        message: error.message
      });
    }
  }

  // Get active users
  async getActiveUsers(req, res) {
    try {
      const users = await User.getActiveUsers();
      
      await this.updateMondayCom('ACTIVE_USERS_ACCESS', 'Active users list accessed');
      
      res.json({
        success: true,
        data: users,
        total: users.length,
        status: 'active'
      });
    } catch (error) {
      console.error('Error fetching active users:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch active users',
        message: error.message
      });
    }
  }

  // Update Monday.com - uses mock in development, real in production
  async updateMondayCom(status, message) {
    try {
      const mondayApiKey = process.env.MONDAY_API_KEY;
      const boardId = process.env.MONDAY_BOARD_ID;
      const itemId = process.env.MONDAY_ITEM_ID;
      
      // Use real Monday.com if credentials are available in production
      if (process.env.NODE_ENV === 'production' && mondayApiKey && boardId && itemId) {
        await this.updateRealMondayCom(status, message);
      } else {
        // Use mock service in development
        await MondayMock.updateMondayCom(status, message);
      }
    } catch (error) {
      console.error('Monday.com update failed:', error.message);
      // Don't throw error - Monday.com failure shouldn't break the API
    }
  }

  // Real Monday.com integration
  async updateRealMondayCom(status, message) {
    // This would make actual API call to Monday.com
    // For now, we'll log it since we're using mock in development
    console.log(`📋 [REAL] Monday.com Update: ${status} - ${message}`);
    
    // In a real implementation, you would use axios to call Monday.com API
    /*
    const axios = require('axios');
    await axios.post('https://api.monday.com/v2', {
      query: `mutation {
        create_update (
          item_id: ${process.env.MONDAY_ITEM_ID}, 
          body: "${new Date().toISOString()} - ${status}: ${message}"
        ) { 
          id 
        }
      }`
    }, {
      headers: {
        'Authorization': process.env.MONDAY_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    */
  }
}

// Create instance with proper binding
const userController = new UserController();

module.exports = userController;