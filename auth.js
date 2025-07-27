// This script should be included in every page that has a navbar.
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const authLink = document.getElementById('auth-link');
    const userDisplay = document.getElementById('user-display'); // Keep this for now

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            // We can get user information directly from the 'user' object
            const username = user.displayName || user.email; // Use display name or email as username

            // Replace login link with username and dropdown
            authLink.innerHTML = `
                <div class="dropdown">
                    <button class="dropbtn">${username}</button>
                    <div class="dropdown-content">
                        <a href="/Pages/user.html">Profile</a>
                        <a href="#" id="logout-link">Logout</a>
                    </div>
                </div>
            `;
            userDisplay.style.display = 'none'; // Hide the separate user display

            document.getElementById('logout-link').addEventListener('click', e => {
                e.preventDefault();
                auth.signOut().then(() => {
                    // localStorage.removeItem('loggedInUser'); // No longer needed if not using local storage for user info
                    window.location.href = '/Pages/login.html'; // Redirect to login on logout
                }).catch((error) => {
                    console.error('Error signing out:', error);
                });
            });

        } else {
            // User is signed out.
            authLink.innerHTML = '<a href="/Pages/login.html">Login</a>';
            userDisplay.style.display = 'none';
        }
    });
});