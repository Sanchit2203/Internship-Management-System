// Add JS here

// Initialize Firebase (assuming firebaseConfig is defined elsewhere or you add it here)
// firebase.initializeApp(firebaseConfig);

// Get Firestore instance
// var db = firebase.firestore();

// Function to fetch and display job listings from Firestore
function loadJobListings(category) {
    const jobTableBody = document.getElementById('job-listings-table').querySelector('tbody');
    jobTableBody.innerHTML = ''; // Clear existing rows

    db.collection('jobs').where('category', '==', category).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const job = doc.data();
            const row = jobTableBody.insertRow();
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
function loadInternshipListings(category) {
    const internshipTableBody = document.getElementById('internship-listings-table').querySelector('tbody');
    internshipTableBody.innerHTML = ''; // Clear existing rows

    db.collection('internships').where('category', '==', category).get().then((querySnapshot) => {
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
            applyButton.onclick = function() { location.href = 'internship_registration.html?title=' + encodeURIComponent(internship.title) + ''; };
            applyCell.appendChild(applyButton);
        });
    })
    .catch((error) => {
        console.error("Error getting internship documents: ", error);
    });
}
