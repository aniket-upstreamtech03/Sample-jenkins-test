const contacts = [];
let contactIdCounter = 1;

// Submit a contact form
exports.submitContact = (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Name, email, and message are required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    // Create contact entry
    const contact = {
      id: contactIdCounter++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    contacts.push(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact.id,
        submittedAt: contact.submittedAt
      }
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to submit contact form'
    });
  }
};

// Get all contact submissions (for admin purposes)
exports.getAllContacts = (req, res) => {
  try {
    const { status } = req.query;
    let filteredContacts = contacts;

    if (status) {
      filteredContacts = contacts.filter(c => c.status === status);
    }

    res.status(200).json({
      success: true,
      count: filteredContacts.length,
      data: filteredContacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch contacts'
    });
  }
};

// Get contact by ID
exports.getContactById = (req, res) => {
  try {
    const { id } = req.params;
    const contact = contacts.find(c => c.id === parseInt(id));

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Contact with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch contact'
    });
  }
};

// Update contact status (for admin purposes)
exports.updateContactStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const contact = contacts.find(c => c.id === parseInt(id));
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Contact with ID ${id} not found`
      });
    }

    contact.status = status;
    contact.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update contact status'
    });
  }
};

// Delete contact
exports.deleteContact = (req, res) => {
  try {
    const { id } = req.params;
    const contactIndex = contacts.findIndex(c => c.id === parseInt(id));

    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Contact with ID ${id} not found`
      });
    }

    contacts.splice(contactIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete contact'
    });
  }
};

// Get contact statistics
exports.getContactStats = (req, res) => {
  try {
    const stats = {
      total: contacts.length,
      pending: contacts.filter(c => c.status === 'pending').length,
      inProgress: contacts.filter(c => c.status === 'in-progress').length,
      resolved: contacts.filter(c => c.status === 'resolved').length,
      closed: contacts.filter(c => c.status === 'closed').length
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch contact statistics'
    });
  }
};
