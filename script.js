// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Redirect to tickets page if already logged in
    if (sessionStorage.getItem("loggedIn")) {
        if (!window.location.href.includes("tickets.html")) {
            window.location.href = "tickets.html";
        }
    }

    // Handle Login Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            login();
        });
    }

    // Handle Ticket Submission
    const ticketForm = document.getElementById("ticket-form");
    if (ticketForm) {
        ticketForm.addEventListener("submit", function (e) {
            e.preventDefault();
            submitTicket();
        });
        loadTickets();  // Load tickets when on the tickets page
    }
});

// Login Function
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("backend/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem("loggedIn", true);
            window.location.href = "tickets.html";
        } else {
            alert("Invalid login credentials");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Ticket Submission Function
function submitTicket() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    fetch("backend/tickets", {  // Changed from tickets.ps1 to tickets
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTickets();  // Refresh tickets after submission
            document.getElementById("ticket-form").reset();
        } else {
            alert("Error submitting ticket");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Load Tickets Function
function loadTickets() {
    fetch("backend/tickets")  // Changed from tickets.ps1 to tickets
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector("#ticket-table tbody");
        tableBody.innerHTML = "";

        if (data.tickets && data.tickets.length > 0) {
            data.tickets.forEach(ticket => {
                const row = `
                    <tr>
                        <td>${ticket.id}</td>
                        <td>${ticket.title}</td>
                        <td>${ticket.description}</td>
                        <td>${ticket.status}</td>
                        <td><button onclick="updateStatus(${ticket.id})">Update</button></td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="5">No tickets found.</td></tr>`;
        }
    })
    .catch(error => console.error("Error loading tickets:", error));
}

// Update Ticket Status Function
function updateStatus(ticketId) {
    fetch(`backend/tickets/${ticketId}`, { method: "PUT" })  // Changed from tickets.ps1?id= to RESTful format
    .then(response => response.json())
    .then(() => loadTickets())
    .catch(error => console.error("Error updating status:", error));
}
