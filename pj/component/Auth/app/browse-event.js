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
      userId: 'user2'
    },
    {
      id: '3',
      name: 'Art Exhibition',
      description: 'Contemporary art from emerging artists',
      date: '2023-08-05',
      time: '10:00',
      location: 'Modern Art Museum',
      userId: 'user3'
    }
  ];
  
  // Mock user
  let currentUser = {
    id: 'user1'
  };
  
  // Mock booked events
  let bookedEvents = [];
  
  // Mock API functions
  function getAllEvents() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...mockEvents]);
      }, 1000);
    });
  }
  
  function bookEvent(eventData) {
    return new Promise(resolve => {
      setTimeout(() => {
        bookedEvents.push(eventData);
        resolve();
      }, 800);
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
  const app = document.getElementById('app');
  const loadingState = document.getElementById('loadingState');
  const toast = document.getElementById('toast');
  
  // State
  let bookingEventId = null;
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
  
  // Handle book event
  async function handleBookEvent(eventData, eventId, eventName) {
    if (!currentUser) return;
    bookingEventId = eventId;
    renderBrowseEvents();
    
    try {
      await bookEvent(eventData);
      showToast('Event Booked', `"${eventName}" has been added to your event log.`);
      renderBrowseEvents();
    } catch (error) {
      showToast('Booking Failed', error.message || 'Could not book the event.', 'destructive');
    } finally {
      bookingEventId = null;
      renderBrowseEvents();
    }
  }
  
  // Handle delete event
  async function handleDeleteEvent(eventId, eventName) {
    if (!currentUser) return;
    deletingEventId = eventId;
    renderBrowseEvents();
    
    try {
      await deleteEvent(eventId);
      showToast('Event Deleted', `"${eventName}" has been successfully deleted.`);
      renderBrowseEvents();
    } catch (error) {
      showToast('Error Deleting Event', error.message || 'Could not delete the event.', 'destructive');
    } finally {
      deletingEventId = null;
      renderBrowseEvents();
    }
  }
  
  // Render empty states
  function renderNoEventsState() {
    app.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="empty-state-title">No Events Available</h3>
        <p class="empty-state-description">There are currently no events to browse or book.</p>
        ${currentUser ? `
          <a href="event-form.html" class="btn btn-accent">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create an Event
          </a>
        ` : ''}
      </div>
    `;
  }
  
  function renderAllBookedState() {
    app.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="empty-state-title">All Available Events Booked</h3>
        <p class="empty-state-description">You've booked all available events, or they are your own creations!</p>
        <div class="empty-state-actions">
          <a href="event-list.html" class="btn btn-outline">
            View My Events
          </a>
          <a href="event-form.html" class="btn btn-accent">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create More Events
          </a>
        </div>
      </div>
    `;
  }
  
  function renderNoMatchingEventsState() {
    app.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="empty-state-title">No Matching Events</h3>
        <p class="empty-state-description">No events to display based on current filters or availability.</p>
      </div>
    `;
  }
  
  // Render event cards
  function renderEventCard(event) {
    const isUserEvent = currentUser && event.userId === currentUser.id;
    const isBooked = bookedEvents.some(
      booked => booked.name === event.name && booked.date === event.date && booked.time === event.time
    );
    
    return `
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
          ${isUserEvent ? `
            <div class="owner-actions">
              <a href="event-form.html?edit=${event.id}" class="btn btn-outline">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </a>
              <button class="btn btn-destructive" onclick="handleDeleteEvent('${event.id}', '${event.name.replace(/'/g, "\\'")}')" ${deletingEventId === event.id ? 'disabled' : ''}>
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
          ` : `
            <button class="btn btn-accent" onclick="handleBookEvent(${JSON.stringify({
              name: event.name,
              date: event.date,
              time: event.time,
              location: event.location,
              description: event.description
            }).replace(/</g, '\\u003c')}, '${event.id}', '${event.name.replace(/'/g, "\\'")}')" ${isBooked || (bookingEventId === event.id) ? 'disabled' : ''}>
              ${bookingEventId === event.id ? `
                <span class="spinner" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"></span>
                Booking...
              ` : `
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                ${isBooked ? 'Already Booked' : 'Book Event'}
              `}
            </button>
          `}
        </div>
      </div>
    `;
  }
  
  // Render browse events page
  async function renderBrowseEvents() {
    loadingState.style.display = 'flex';
    
    try {
      const allEvents = await getAllEvents();
      
      if (allEvents.length === 0) {
        renderNoEventsState();
        return;
      }
      
      // Filter events to display
      let eventsToDisplay = [...allEvents];
      if (currentUser) {
        eventsToDisplay = allEvents.filter(event => {
          if (event.userId === currentUser.id) return true;
          
          const eventSignature = `${event.name}-${event.date}-${event.time}`;
          const isBooked = bookedEvents.some(
            booked => `${booked.name}-${booked.date}-${booked.time}` === eventSignature
          );
          return !isBooked;
        });
      }
      
      if (eventsToDisplay.length === 0 && allEvents.length > 0 && currentUser) {
        renderAllBookedState();
        return;
      }
      
      if (eventsToDisplay.length === 0) {
        renderNoMatchingEventsState();
        return;
      }
      
      // Sort events by date and time
      const sortedEvents = [...eventsToDisplay].sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.time.localeCompare(b.time);
      });
      
      // Create events grid HTML
      const eventsHTML = sortedEvents.map(renderEventCard).join('');
      
      // Set the app HTML
      app.innerHTML = `
        <div class="content-container">
          <div class="page-header">
            <h1 class="page-title">Browse Events</h1>
            ${currentUser ? `
              <a href="event-form.html" class="btn btn-accent">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Event
              </a>
            ` : ''}
          </div>
          <div class="events-grid">
            ${eventsHTML}
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading events:', error);
      app.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="empty-state-title">Error Loading Events</h3>
          <p class="empty-state-description">Could not load events. Please try again later.</p>
          <button class="btn btn-accent" onclick="renderBrowseEvents()">
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
  
  // Make functions available globally
  window.handleBookEvent = handleBookEvent;
  window.handleDeleteEvent = handleDeleteEvent;
  window.renderBrowseEvents = renderBrowseEvents;
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', renderBrowseEvents);