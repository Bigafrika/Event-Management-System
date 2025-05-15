document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    const loadingState = document.getElementById('loadingState');
    const app = document.getElementById('app');
    
    loadingState.style.display = 'flex';
    
    setTimeout(() => {
      loadingState.style.display = 'none';
      app.style.display = 'flex';
    }, 800);
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        // In a real app, this would clear auth tokens and redirect
        loadingState.style.display = 'flex';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      });
    }
    
    // Calendar navigation
    const monthDisplay = document.querySelector('.calendar-month');
    const prevMonthBtn = document.querySelectorAll('.calendar-nav')[0];
    const nextMonthBtn = document.querySelectorAll('.calendar-nav')[1];
    
    let currentDate = new Date();
    
    function updateCalendar() {
      const options = { month: 'long', year: 'numeric' };
      monthDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
      
      // In a real app, you would fetch events for this month
      // and update the calendar grid accordingly
    }
    
    prevMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
    });
    
    // Initialize calendar
    updateCalendar();
    
    // Event card click handlers
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Don't trigger if clicking on action buttons
        if (!e.target.closest('.event-actions')) {
          // In a real app, this would open event details
          console.log('Viewing event:', card.querySelector('.event-name').textContent);
        }
      });
    });
  });