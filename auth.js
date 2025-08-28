// This script should be included in every page that has a navbar.
document.addEventListener('DOMContentLoaded', () => {
    // Check if firebase.auth is defined before calling it
    const auth = firebase.auth(); // Now it's safe to call firebase.auth()
    const authLink = document.getElementById('auth-link');
    const userDisplay = document.getElementById('user-display'); // Keep this for now

    async function isAdmin() {
        const user = firebase.auth().currentUser;
        if (user) {
            try {
                const doc = await firebase.firestore().collection('users').doc(user.uid).get();
                return doc.exists && doc.data().role === 'admin';
            } catch (error) {
                console.error("Error checking admin status:", error);
                return false; // Assume not admin on error
            }
        }
        return false;
    }

    auth.onAuthStateChanged(async user => {
        if (user) {
            // User is signed in.
            // We can get user information directly from the 'user' object
            const username = user.displayName || user.email; // Use display name or email as username

            const admin = await isAdmin();
            let adminLink = '';
            if (admin) {
                adminLink = '<a href="/admin/admin_panel.html" style="padding: 12px 16px; display: block; text-decoration: none; color: black; font-weight: bold;">Admin Panel</a>';
            }

            // Replace login link with username and dropdown
            authLink.innerHTML = `
                <div class="dropdown">
                    <button class="dropbtn">${username}</button>
                    <div class="dropdown-content">
                        <a href="/Pages/user.html" style="padding: 12px 16px; display: block; text-decoration: none; color: black; font-weight: bold;">Dashboard</a>
                        ${adminLink}
                        <a href="#" id="logout-link" style="padding: 12px 16px; display: block; text-decoration: none; color: black; font-weight: bold;">Logout</a>
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