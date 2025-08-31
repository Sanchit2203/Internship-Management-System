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
function loadInternshipListings(category, registrationUrlPrefix = 'Pages/internship_registration.html?title=') {
    const internshipTableBody = document.getElementById('internship-listings-table').querySelector('tbody');
    internshipTableBody.innerHTML = ''; // Clear existing rows

    let query = db.collection('internships');
    if (category) {
        query = query.where('category', '==', category);
    }

    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const internship = doc.data();
            const row = internshipTableBody.insertRow(); 
            row.insertCell().textContent = internship.title || 'N/A';
            row.insertCell().textContent = internship.location || 'N/A';
            row.insertCell().textContent = internship.description || 'N/A';
            row.insertCell().textContent = internship.deadline || 'N/A';
            const applyCell = row.insertCell();
            const applyButton = document.createElement('button');
            applyButton.textContent = 'Apply';
            applyButton.onclick = async function() { 
                const user = firebase.auth().currentUser;
                if (!user) {
                    alert('Please login to apply.');
                    window.location.href = 'Pages/login.html';
                    return;
                }

                const adminStatus = await isAdmin();
                if (adminStatus) {
                    location.href = registrationUrlPrefix + encodeURIComponent(internship.title);
                    return;
                }

                const hasExisting = await hasExistingApplication(user.uid);
                if (hasExisting) {
                    alert('You already have an application in the system. You can apply for a new internship only after your previous application has been deleted by an administrator.');
                } else {
                    location.href = registrationUrlPrefix + encodeURIComponent(internship.title);
                }
            };
            applyCell.appendChild(applyButton);
        });
    })
    .catch((error) => {
        console.error("Error getting internship documents: ", error);
    });
}

async function hasExistingApplication(userId) {
    if (!userId) return false;
    try {
        const applicationsRef = db.collection('internshipApplications');
        // Check if any document exists for this user, regardless of status.
        const snapshot = await applicationsRef.where('userId', '==', userId).limit(1).get();
        return !snapshot.empty;
    } catch (error) {
        console.error("Error checking for existing application:", error);
        // To be safe, prevent application if an error occurs.
        return true; 
    }
}


// Function to check if the current logged in user is an admin
let isAdminStatus = null; // Variable to store the admin status

async function isAdmin() {
    if (isAdminStatus !== null) {
        return isAdminStatus; // Return the cached status if available
    }
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            isAdminStatus = doc.exists && doc.data().role === 'admin';
            return isAdminStatus;
        } catch (error) {
            console.error("Error checking admin status:", error);
            isAdminStatus = false; // Assume not admin on error
        }
    }
    return false;
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
    localStorage.removeItem('loggedInUser');
    window.location.href = 'Pages/login.html'; 
    alert('You have been logged out due to inactivity.');
}

// Add event listeners to detect user activity
document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);
document.addEventListener('click', resetLogoutTimer);
document.addEventListener('scroll', resetLogoutTimer); 

// Start the timer when the script loads
startLogoutTimer();
