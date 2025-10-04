class LoginSystem {
    constructor() {
        this.init();
    }

    init() {
        this.initializeUsers();
        this.setupEventListeners();
        this.checkExistingSession();
    }

    initializeUsers() {
        // Clear existing users and create fresh ones
        localStorage.removeItem('hospital_users');
        
        const defaultUsers = [
            { 
                username: 'admin', 
                password: 'admin123', 
                role: 'admin', 
                fullName: 'System Administrator'
            },
            { 
                username: 'doctor', 
                password: 'doctor123', 
                role: 'doctor', 
                fullName: 'Dr. Sarah Johnson'
            },
            { 
                username: 'receptionist', 
                password: 'reception123', 
                role: 'receptionist', 
                fullName: 'Emily Davis'
            },
            { 
                username: 'labtech', 
                password: 'labtech123', 
                role: 'labtech', 
                fullName: 'Michael Chen'
            }
        ];
        
        localStorage.setItem('hospital_users', JSON.stringify(defaultUsers));
        console.log('Users initialized:', defaultUsers);
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        // Clear validation on input
        usernameInput.addEventListener('input', () => this.clearValidation('username'));
        passwordInput.addEventListener('input', () => this.clearValidation('password'));

        // Form submission
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    clearValidation(field) {
        const input = document.getElementById(field);
        const error = document.getElementById(`${field}-error`);
        
        input.classList.remove('is-invalid');
        error.textContent = '';
        this.hideMessage();
    }

    showFieldError(field, message) {
        const input = document.getElementById(field);
        const error = document.getElementById(`${field}-error`);
        
        input.classList.add('is-invalid');
        error.textContent = message;
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('login-message');
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type} mt-3`;
        messageDiv.classList.remove('d-none');
    }

    hideMessage() {
        const messageDiv = document.getElementById('login-message');
        messageDiv.classList.add('d-none');
    }

    validateForm() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        let isValid = true;

        // Clear previous errors
        this.clearValidation('username');
        this.clearValidation('password');

        // Validate username
        if (!username) {
            this.showFieldError('username', 'Username is required');
            isValid = false;
        }

        // Validate password
        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    async handleLogin(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.querySelector('.login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');

        console.log('Login attempt with:', { username, password });

        // Show loading state
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        loginBtn.disabled = true;

        // Hide previous messages
        this.hideMessage();

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get users from localStorage
            const usersData = localStorage.getItem('hospital_users');
            console.log('Users data from localStorage:', usersData);
            
            if (!usersData) {
                this.showMessage('System error: Users not found. Please refresh the page.', 'danger');
                this.resetButton(btnText, btnLoading, loginBtn);
                return;
            }

            const users = JSON.parse(usersData);
            console.log('Parsed users:', users);

            // Find matching user
            const user = users.find(u => {
                console.log(`Checking: ${u.username} === ${username} && ${u.password} === ${password}`);
                return u.username === username && u.password === password;
            });

            console.log('Found user:', user);

            if (!user) {
                this.showMessage('Invalid username or password. Please try again.', 'danger');
                this.resetButton(btnText, btnLoading, loginBtn);
                return;
            }

            // Store session
            const sessionData = {
                username: user.username,
                role: user.role,
                fullName: user.fullName,
                loginTime: new Date().toISOString(),
                sessionId: 'session_' + Math.random().toString(36).substr(2, 9)
            };
            
            localStorage.setItem('hospital_session', JSON.stringify(sessionData));
            console.log('Session stored:', sessionData);

            // Show success message
            this.showMessage(`Welcome back, ${user.fullName}! Redirecting to dashboard...`, 'success');

            // Redirect based on role
            setTimeout(() => {
                this.redirectToDashboard(user.role);
            }, 2000);

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('An error occurred during login. Please try again.', 'danger');
            this.resetButton(btnText, btnLoading, loginBtn);
        }
    }

    resetButton(btnText, btnLoading, loginBtn) {
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        loginBtn.disabled = false;
    }

    redirectToDashboard(role) {
        const dashboards = {
            'admin': 'admin.html',
            'doctor': 'doctor.html',
            'receptionist': 'receptionist.html',
            'labtech': 'labtech.html'
        };
        
        const dashboardUrl = dashboards[role];
        console.log('Redirecting to:', dashboardUrl);
        window.location.href = dashboardUrl;
    }

    checkExistingSession() {
        const session = localStorage.getItem('hospital_session');
        if (session) {
            try {
                const user = JSON.parse(session);
                this.showMessage(`Welcome back, ${user.fullName}! Redirecting...`, 'success');
                setTimeout(() => this.redirectToDashboard(user.role), 1500);
            } catch (error) {
                console.error('Session error:', error);
                localStorage.removeItem('hospital_session');
            }
        }
    }
}

// Initialize login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Debug function to check localStorage
function debugLocalStorage() {
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('hospital_users:', localStorage.getItem('hospital_users'));
    console.log('hospital_session:', localStorage.getItem('hospital_session'));
    console.log('========================');
}

// Call this in browser console if needed
window.debugLocalStorage = debugLocalStorage;