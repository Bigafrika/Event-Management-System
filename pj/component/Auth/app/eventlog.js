document.addEventListener('DOMContentLoaded', function() {
  // Get user
  const session = JSON.parse(localStorage.getItem('eventlog_session') || {} );
  const username = session.user?.username;
  
  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  // DOM elements
  const eventsList = document.getElementById('bookedEventsList');
  
  // Load and show events
  loadEvents();

  function loadEvents() {
    // Get all events and user's booked events
    const allEvents = JSON.parse(localStorage.getItem('eventlog_all_events') || []);
    const bookedIds = JSON.parse(localStorage.getItem(`eventlog_bookings_${username}`) || []);
    
    // Filter and show only booked events
    const bookedEvents = allEvents.filter(event => bookedIds.includes(event.id));
    
    if (bookedEvents.length === 0) {
      eventsList.innerHTML = `
        <div class="no-events">
          <p>No events booked yet</p>
          <a href="dashboard.html">Browse Events</a>
        </div>
      `;
    } else {
      eventsList.innerHTML = bookedEvents.map(event => `
        <div class="event-card">
          <img src="${event.image}" alt="${event.name}">
          <h3>${event.name}</h3>
          <p>${new Date(event.date).toLocaleDateString()} at ${event.time}</p>
          <p>${event.location}</p>
          <button class="delete-btn" data-id="${event.id}">Remove</button>
        </div>
      `).join('');
      
      // Add delete handlers
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const eventId = this.dataset.id;
          if (confirm('Remove this event?')) {
            // Remove from bookings
            const updatedIds = bookedIds.filter(id => id !== eventId);
            localStorage.setItem(`eventlog_bookings_${username}`, JSON.stringify(updatedIds));
            // Reload
            loadEvents();
          }
        });
      });
    }
  }
});