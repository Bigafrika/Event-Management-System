// Mock data and functions
const mockEvents = [
    {
      id: '1',
      name: 'Tech Conference 2023',
      description: 'Annual technology conference featuring the latest innovations',
      date: '2023-06-15',
      time: '14:00',
      location: 'Convention Center, San Francisco',
      userId: 'user1'
    },
    {
      id: '2',
      name: 'Music Festival',
      description: 'Three days of music from top artists around the world',
      date: '2023-07-20',
      time: '18:00',
      location: 'Central Park, New York',
      userId: 'user1'
    }
  ];
  
  // Mock user
  const currentUser = {
    id: 'user1'
  };
  
  // Mock API functions
  function getUserEvents() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockEvents.filter(event => event.userId === currentUser.id));
      }, 1000);
    });
  }
  
  function deleteEvent(eventId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
          mockEvents.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Event not found'));
        }
      }, 800);
    });
  }
  
  // DOM elements
  const eventListContainer = document.getElementById('eventListContainer');
  const loadingState = document.getElementById('loadingState');
  const toast = document.getElementById('toast');
  
  // State
  let deletingEventId = null;
  
  // Show toast notification
  function showToast(title, description, type = 'success') {
    toast.innerHTML = `
      <div>
        <p class="toast-title">${title}</p>
        <p class="toast-description">${description}</p>
      </div>
    `;
    toast.className = `toast show toast-${type}`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Handle delete event
  async function handleDelete(eventId) {
    deletingEventId = eventId;
    renderEventList();
    
    try {
      await deleteEvent(eventId);
      showToast('Event Deleted', 'The event has been successfully deleted.');
      renderEventList();
    } catch (error) {
      showToast('Error Deleting Event', error.message || 'Could not delete the event.', 'destructive');
    } finally {
      deletingEventId = null;
      renderEventList();
    }
  }
  
  // Render empty state
  function renderEmptyState() {
    eventListContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="empty-state-title">No events yet!</h3>
        <p class="empty-state-description">It looks like you haven't created or booked any events.</p>
        <a href="event-form.html" class="btn btn-accent">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Your First Event
        </a>
      </div>
    `;
  }
  
  // Render event list
  async function renderEventList() {
    loadingState.style.display = 'flex';
    
    try {
      const userEvents = await getUserEvents();
      
      if (userEvents.length === 0) {
        renderEmptyState();
        return;
      }
      
      // Sort events by date and time
      const sortedEvents = [...userEvents].sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.time.localeCompare(b.time);
      });
      
      // Create event cards HTML
      const eventsHTML = sortedEvents.map(event => `
        <div class="event-card">
          <div class="card-header">
            <h2 class="card-title">${event.name}</h2>
            <p class="card-description">${event.description.length > 100 ? 
              `${event.description.substring(0, 100)}...` : event.description}</p>
          </div>
          <div class="card-content">
            <div class="event-detail">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="event-date">${new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}</span>
            </div>
            <div class="event-detail">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="event-time">${event.time}</span>
            </div>
            <div class="event-detail">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="event-location">${event.location}</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="owner-actions">
              <a href="event-form.html?edit=${event.id}" class="btn btn-outline">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </a>
              <button class="btn btn-destructive" onclick="handleDelete('${event.id}')" ${deletingEventId === event.id ? 'disabled' : ''}>
                ${deletingEventId === event.id ? `
                  <span class="spinner" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"></span>
                  Deleting...
                ` : `
                  <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                `}
              </button>
            </div>
          </div>
        </div>
      `).join('');
      
      // Set the container HTML
      eventListContainer.innerHTML = `
        <div class="event-list-container">
          <div class="event-list-header">
            <h1 class="event-list-title">Your Events</h1>
            <a href="event-form.html" class="btn btn-accent">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Event
            </a>
          </div>
          <div class="event-list-grid">
            ${eventsHTML}
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading events:', error);
      eventListContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="empty-state-title">Error Loading Events</h3>
          <p class="empty-state-description">Could not load your events. Please try again later.</p>
          <button class="btn btn-accent" onclick="renderEventList()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      `;
    } finally {
      loadingState.style.display = 'none';
    }
  }
  
  // Make handleDelete available globally
  window.handleDelete = handleDelete;
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', renderEventList);