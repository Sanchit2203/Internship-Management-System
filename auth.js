// This script should be included in every page that has a navbar.
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const authLink = document.getElementById('auth-link');
    const userDisplay = document.getElementById('user-display');

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (loggedInUser && loggedInUser.username) {
                userDisplay.textContent = `Welcome, ${loggedInUser.username}!`;
                userDisplay.style.display = 'block';
            }

            authLink.innerHTML = '<a href="#" id="logout-link">Logout</a>';
            document.getElementById('logout-link').addEventListener('click', e => {
                e.preventDefault();
                auth.signOut().then(() => {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/Pages/login.html'; // Redirect to login on logout
                });
            });
        } else {
            // User is signed out.
            authLink.innerHTML = '<a href="/Pages/login.html">Login</a>';
            userDisplay.style.display = 'none';
        }
    });
});
