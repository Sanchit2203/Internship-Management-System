// Add JS here

// Initialize Firebase (assuming firebaseConfig is defined elsewhere or you add it here)
// firebase.initializeApp(firebaseConfig);

// Get Firestore instance
// var db = firebase.firestore();

// Function to fetch and display job listings from Firestore
function loadJobListings(category) {
    const jobTableBody = document.getElementById('job-listings-table').querySelector('tbody');
    jobTableBody.innerHTML = ''; // Clear existing rows

    let query = db.collection('jobs');
    if (category) {
        query = query.where('category', '==', category);
    }

    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const job = doc.data();
            const row = jobTableBody.insertRow(); // Changed from insertCell() to insertRow()
            row.insertCell().textContent = job.title || 'N/A';
            row.insertCell().textContent = job.location || 'N/A';
            row.insertCell().textContent = job.description || 'N/A';
            row.insertCell().textContent = job.deadline || 'N/A';
            const applyCell = row.insertCell();
            const applyButton = document.createElement('button');
            applyButton.textContent = 'Apply';
            applyButton.onclick = function() { location.href = 'job_registration.html?title=' + encodeURIComponent(job.title) + ''; };
            applyCell.appendChild(applyButton);
        });
    })
    .catch((error) => {
        console.error("Error getting job documents: ", error);
    });
}

// Function to fetch and display internship listings from Firestore
function loadInternshipListings(category, registrationUrlPrefix = 'internship_registration.html?title=') {
    const internshipTableBody = document.getElementById('internship-listings-table').querySelector('tbody');
    internshipTableBody.innerHTML = ''; // Clear existing rows

    let query = db.collection('internships');
    if (category) {
        query = query.where('category', '==', category);
    }

    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const internship = doc.data();
            const row = internshipTableBody.insertRow(); // Changed from insertCell() to insertRow()
            row.insertCell().textContent = internship.title || 'N/A';
            row.insertCell().textContent = internship.location || 'N/A';
            row.insertCell().textContent = internship.description || 'N/A';
            row.insertCell().textContent = internship.deadline || 'N/A';
            const applyCell = row.insertCell();
            const applyButton = document.createElement('button');
            applyButton.textContent = 'Apply';
            applyButton.onclick = function() { location.href = registrationUrlPrefix + encodeURIComponent(internship.title); };
            applyCell.appendChild(applyButton);
        });
    })
    .catch((error) => {
        console.error("Error getting internship documents: ", error);
    });
}

// Auto-logout functionality after 30 minutes of inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let timeoutId;

function startLogoutTimer() {
    clearTimeout(timeoutId); // Clear any existing timer
    timeoutId = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
}

function resetLogoutTimer() {
    startLogoutTimer(); // Restart the timer on user activity
}

function logoutUser() {
    // Perform logout actions: clear session, redirect, etc.
    // Example: Clear localStorage, assuming 'loggedInUser' is stored
    localStorage.removeItem('loggedInUser');
    // Example: Redirect to login page
    window.location.href = 'login.html'; // Or your actual login page
    alert('You have been logged out due to inactivity.');
}

// Add event listeners to detect user activity
document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);
document.addEventListener('click', resetLogoutTimer);
document.addEventListener('scroll', resetLogoutTimer); // Also listen for scroll events

// Start the timer when the script loads (e.g., on page load)
startLogoutTimer();

// Optional: If you have a Firebase authentication listener, you might want to start/stop the timer
// based on the auth state. For example:
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in, start the timer
//     startLogoutTimer();
//   } else {
//     // No user is signed in, clear the timer
//     clearTimeout(timeoutId);
//   }
// });
