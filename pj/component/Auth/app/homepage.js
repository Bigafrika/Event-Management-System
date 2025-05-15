// Check if user is logged in (mock implementation)
function checkAuth() {
    // In a real app, this would check localStorage or make an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(false); // Change to true to test logged-in state
      }, 500);
    });
  }
  
  // Redirect if user is logged in
  async function handleAuthRedirect() {
    const loadingState = document.getElementById('loadingState');
    const app = document.getElementById('app');
    
    loadingState.style.display = 'flex';
    
    try {
      const isLoggedIn = await checkAuth();
      
      if (isLoggedIn) {
        // In a real app, this would redirect to the events page
        window.location.href = 'events.html';
      } else {
        app.style.display = 'flex';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      app.style.display = 'flex';
    } finally {
      loadingState.style.display = 'none';
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', handleAuthRedirect);