// Auth state management
const authState = {
  isAuthenticated: true,
  user: {
    username: 'peejay',
    avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80'
  },
  loading: false
};

// Navigation links
const navLinks = [
  { 
    href: 'dashboard.html', 
    label: 'Dashboard', 
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>`
  },
  { 
    href: 'eventform.html', 
    label: 'Create Event', 
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>`
  },
  { 
    href: 'eventlog.html', 
    label: 'Event Log', 
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>`
  }
];

// State management
let state = {
  user: authState.user,
  allEvents: [],
  bookedEventIds: [],
  searchTerm: '',
  sortBy: 'date',
  showCreateForm: false
};

// Initialize the app
function init() {
  // Setup navbar
  renderUserDropdown();
  renderDesktopNav();
  renderMobileNav();
  setupMobileMenu();
  
  // Setup dashboard
  loadEvents();
  loadBookedEvents();
  setupEventListeners();
  renderEvents();
  
  // Handle hash changes for navigation
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// Handle hash changes for navigation
function handleHashChange() {
  const hash = window.location.hash;
  state.showCreateForm = hash === '#create-event';
  
  if (state.showCreateForm) {
    renderCreateEventForm();
  } else {
    renderEvents();
  }
}

// Navbar functions
function renderUserDropdown() {
  const container = document.getElementById('userDropdownContainer');
  if (!container) return;

  if (state.user) {
    container.innerHTML = `
      <div class="dropdown-menu">
        <button id="dropdownTrigger" class="button button-ghost relative h-10 w-10 rounded-full p-0">
          <div class="avatar h-10 w-10 border-2 border-accent-foreground/50 hover:border-accent-foreground transition-colors">
            <img src="${state.user.avatarUrl}" alt="${state.user.username}" class="avatar-image">
            <div class="avatar-fallback">${state.user.username.substring(0, 2).toUpperCase()}</div>
          </div>
        </button>
        <div id="dropdownContent" class="dropdown-menu-content hidden">
          <div class="dropdown-menu-label">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">${state.user.username}</p>
              <p class="text-xs leading-none text-muted-foreground">Welcome!</p>
            </div>
          </div>
          <div class="dropdown-menu-separator"></div>
          <div class="dropdown-menu-item" id="logoutButton">
            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log out</span>
          </div>
        </div>
      </div>
    `;

    // Set up dropdown toggle
    const trigger = document.getElementById('dropdownTrigger');
    const content = document.getElementById('dropdownContent');
    
    trigger?.addEventListener('click', () => {
      content?.classList.toggle('hidden');
    });

    // Set up logout
    document.getElementById('logoutButton')?.addEventListener('click', () => {
      localStorage.removeItem('eventlog_session');
      window.location.href = './login.html';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        content?.classList.add('hidden');
      }
    });
  }
}

function renderDesktopNav() {
  const nav = document.getElementById('desktopNav');
  if (!nav) return;

  nav.innerHTML = navLinks.map(link => `
    <a href="${link.href}" class="button button-ghost text-sm font-medium text-accent-foreground hover:bg-accent-foreground/10">
      ${link.icon}
      <span class="ml-2">${link.label}</span>
    </a>
  `).join('');
}

function renderMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;

  nav.innerHTML = navLinks.map(link => `
    <a href="${link.href}" class="button button-ghost justify-start text-base font-medium text-accent-foreground hover:bg-accent-foreground/10">
      ${link.icon}
      <span class="ml-2">${link.label}</span>
    </a>
  `).join('');
}

function setupMobileMenu() {
  const button = document.getElementById('mobileMenuButton');
  const menu = document.getElementById('mobileMenu');
  
  button?.addEventListener('click', () => {
    menu?.classList.toggle('open');
  });

  // Close menu when clicking on a link
  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
    });
  });
}

// Dashboard functions
function loadEvents() {
  const storedEvents = localStorage.getItem('eventlog_all_events');
  state.allEvents = storedEvents ? JSON.parse(storedEvents) : [];
}

function loadBookedEvents() {
  if (state.user) {
    const userKey = `eventlog_bookings_${state.user.username}`;
    const storedBookedEvents = localStorage.getItem(userKey);
    state.bookedEventIds = storedBookedEvents ? JSON.parse(storedBookedEvents) : [];
  } else {
    state.bookedEventIds = [];
  }
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', (e) => {
    state.searchTerm = e.target.value;
    renderEvents();
  });
  
  // Select trigger
  const selectTrigger = document.getElementById('selectTrigger');
  selectTrigger?.addEventListener('click', () => {
    const content = document.getElementById('selectContent');
    content?.classList.toggle('hidden');
  });
  
  // Select items
  document.querySelectorAll('.select-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const value = e.target.getAttribute('data-value');
      state.sortBy = value;
      document.getElementById('selectValue').textContent = e.target.textContent;
      document.getElementById('selectContent').classList.add('hidden');
      renderEvents();
    });
  });
  
  // Close select when clicking outside
  document.addEventListener('click', (e) => {
    if (!selectTrigger?.contains(e.target)) {
      document.getElementById('selectContent')?.classList.add('hidden');
    }
  });
}

// Event management functions
function handleBookEvent(eventId) {
  if (!authState.isAuthenticated) {
    showToast('Login Required', 'Please log in to book events', 'destructive');
    return;
  }
  
  if (state.bookedEventIds.includes(eventId)) {
    showToast('Already Booked', 'You have already booked this event');
    return;
  }
  
  // Add to booked events
  state.bookedEventIds = [...state.bookedEventIds, eventId];
  
  // Save to localStorage
  const userKey = `eventlog_bookings_${state.user.username}`;
  localStorage.setItem(userKey, JSON.stringify(state.bookedEventIds));
  
  // Update UI
  renderEvents();
  showToast('Event Booked!', 'You can view it in your Event Log', 'success');
  
  // Update the "Book Event" button to "Booked"
  const eventCard = document.querySelector(`.event-card[data-id="${eventId}"]`);
  if (eventCard) {
    const button = eventCard.querySelector('.event-card-button');
    if (button) {
      button.textContent = 'Booked';
      button.classList.add('booked');
    }
  }
}

function getFilteredAndSortedEvents() {
  return state.allEvents
    .filter(event => 
      event.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || 
      event.location.toLowerCase().includes(state.searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (state.sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (state.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
}

function renderEvents() {
  const filteredEvents = getFilteredAndSortedEvents();
  const eventsContainer = document.getElementById('eventsContainer');
  const noEventsMessage = document.getElementById('noEventsMessage');
  const noEventsText = document.getElementById('noEventsText');
  
  if (!eventsContainer || !noEventsMessage || !noEventsText) return;
  
  if (filteredEvents.length === 0) {
    eventsContainer.innerHTML = '';
    noEventsMessage.classList.remove('hidden');
    noEventsText.textContent = state.allEvents.length === 0 
      ? "There are no events available right now. Check back later or create one!" 
      : "Try adjusting your search or sort criteria.";
  } else {
    noEventsMessage.classList.add('hidden');
    eventsContainer.innerHTML = filteredEvents.map(event => `
      <div class="event-card" data-id="${event.id}">
        <img src="${event.image}" alt="${event.name}" class="event-card-image">
        <div class="event-card-content">
          <h3 class="event-card-title">${event.name}</h3>
          <div class="event-card-details">
            <p>${formatDate(event.date)} at ${event.time}</p>
            <p>${event.location}</p>
            <p>${event.description}</p>
          </div>
          <button 
            class="event-card-button ${state.bookedEventIds.includes(event.id) ? 'booked' : ''}" 
            onclick="handleBookEvent('${event.id}')"
          >
            ${state.bookedEventIds.includes(event.id) ? 'Booked' : 'Book Event'}
          </button>
        </div>
      </div>
    `).join('');
  }
}

// Helper functions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showToast(title, description, variant = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${variant}`;
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div>${description}</div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make handleBookEvent available globally
window.handleBookEvent = handleBookEvent;
function handleBookEvent(eventId) {
  if (!authState.isAuthenticated) {
    showToast('Login Required', 'Please log in to book events', 'destructive');
    return;
  }
  
  if (state.bookedEventIds.includes(eventId)) {
    showToast('Already Booked', 'You have already booked this event');
    return;
  }
  
  // Add to booked events
  state.bookedEventIds = [...state.bookedEventIds, eventId];
  
  // Save to localStorage
  const userKey = `eventlog_bookings_${state.user.username}`;
  localStorage.setItem(userKey, JSON.stringify(state.bookedEventIds));
  
  // Update UI
  renderEvents();
  showToast('Event Booked!', 'You can view it in your Event Log', 'success');
  
  // Update button text
  const button = document.querySelector(`.event-card[data-id="${eventId}"] .event-card-button`);
  if (button) {
    button.textContent = 'Booked';
    button.classList.add('booked');
  }
}