// Form validation schema
const loginSchema = {
  username: {
    minLength: 3,
    errorMessage: 'Username must be at least 3 characters'
  },
  password: {
    minLength: 6,
    errorMessage: 'Password must be at least 6 characters'
  }
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const toast = document.getElementById('toast');

// Check for user data passed from signup when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Get username from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const usernameFromSignup = urlParams.get('username');
  
  // Get stored user data from localStorage
  const storedUserData = localStorage.getItem('tempUserData');
  
  // Auto-fill the login form if username parameter exists
  if (usernameFromSignup && usernameInput) {
    usernameInput.value = decodeURIComponent(usernameFromSignup);
    // Focus on password field for better UX
    passwordInput.focus();
  }
});

// Form validation
function validateForm() {
  let isValid = true;
  
  // Validate username
  if (usernameInput.value.length < loginSchema.username.minLength) {
    usernameError.textContent = loginSchema.username.errorMessage;
    isValid = false;
  } else {
    usernameError.textContent = '';
  }
  
  // Validate password
  if (passwordInput.value.length < loginSchema.password.minLength) {
    passwordError.textContent = loginSchema.password.errorMessage;
    isValid = false;
  } else {
    passwordError.textContent = '';
  }
  
  return isValid;
}

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

// Mock login function that checks against stored data
async function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check against hardcoded demo credentials (for backward compatibility)
      if (username === 'demo' && password === 'password123') {
        return resolve();
      }
      
      // Check against stored user data from signup
      const storedUserData = JSON.parse(localStorage.getItem('tempUserData') || 'null');
      
      if (storedUserData && 
          storedUserData.username === username && 
          storedUserData.password === password) {
        resolve();
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 1000);
  });
}

// Form submission with dashboard redirect
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  // Show loading state
  submitBtn.disabled = true;
  spinner.style.display = 'inline-block';
  btnText.textContent = 'Logging in...';
  
  try {
    await mockLogin(usernameInput.value, passwordInput.value);
    showToast('Login Successful', 'Redirecting to dashboard...', 'success');
    
    // Clear temporary user data after successful login
    localStorage.removeItem('tempUserData');
    
    // Redirect to dashboard after a short delay to show the success message
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } catch (error) {
    showToast('Login Failed', error.message, 'destructive');
  } finally {
    // Reset loading state
    submitBtn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Login';
  }
});

// Input validation on blur
usernameInput.addEventListener('blur', validateForm);
passwordInput.addEventListener('blur', validateForm);