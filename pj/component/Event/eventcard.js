// Sample event data
const event = {
    id: '1',
    name: 'Tech Conference 2023',
    description: 'Annual technology conference featuring the latest innovations and speakers from top tech companies.',
    date: '2023-06-15',
    time: '2:00 PM',
    location: '123 Main St, San Francisco, CA',
    userId: 'user1'
  };
  
  // Mock user data
  const currentUser = {
    id: 'user1'
  };
  
  // Initialize the event card
  function initEventCard() {
    // Set event data
    document.querySelector('.card-title').textContent = event.name;
    document.querySelector('.card-description').textContent = 
      event.description.length > 100 
        ? `${event.description.substring(0, 100)}...` 
        : event.description;
    document.querySelector('.event-date').textContent = formatDate(event.date);
    document.querySelector('.event-time').textContent = event.time;
    document.querySelector('.event-location').textContent = event.location;
  
    // Show appropriate buttons based on ownership
    const userOwnsEvent = currentUser && event.userId === currentUser.id;
    const ownerActions = document.querySelector('.owner-actions');
    const bookBtn = document.getElementById('bookBtn');
  
    if (userOwnsEvent) {
      ownerActions.style.display = 'flex';
      bookBtn.style.display = 'none';
    } else {
      ownerActions.style.display = 'none';
      bookBtn.style.display = 'inline-flex';
    }
  
    // Setup event listeners
    setupEventListeners();
  }
  
  // Format date
  function formatDate(dateString) {
    if (!dateString) return 'Date not set';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Setup event listeners
  function setupEventListeners() {
    const deleteBtn = document.getElementById('deleteBtn');
    const bookBtn = document.getElementById('bookBtn');
    const dialogOverlay = document.getElementById('dialogOverlay');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteSpinner = document.getElementById('deleteSpinner');
  
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        dialogOverlay.style.display = 'flex';
      });
    }
  
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        dialogOverlay.style.display = 'none';
      });
    }
  
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async () => {
        deleteSpinner.style.display = 'inline-block';
        confirmDeleteBtn.disabled = true;
        
        // Simulate delete operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would call onDelete(event.id) here
        console.log('Event deleted:', event.id);
        dialogOverlay.style.display = 'none';
        deleteSpinner.style.display = 'none';
        confirmDeleteBtn.disabled = false;
      });
    }
  
    if (bookBtn) {
      bookBtn.addEventListener('click', async () => {
        bookBtn.disabled = true;
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        bookBtn.prepend(spinner);
        bookBtn.querySelector('.icon-sm').style.display = 'none';
        bookBtn.textContent = 'Booking...';
        
        // Simulate booking operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would call onBook(eventData) here
        console.log('Event booked:', {
          name: event.name,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description
        });
        
        // Reset button state
        bookBtn.disabled = false;
        spinner.remove();
        bookBtn.querySelector('.icon-sm').style.display = 'inline-block';
        bookBtn.textContent = 'Book Event';
      });
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initEventCard);