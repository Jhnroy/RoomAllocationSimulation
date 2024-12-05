document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("allocation-form");
    const generateBtn = document.getElementById("generate");
    const optimizeBtn = document.getElementById("optimize");
    const scheduleTable = document.getElementById("schedule-table");
    const resultsDiv = document.getElementById("results");
    const roomGrid = document.getElementById("room-grid");
    const vacancyInfo = document.getElementById("vacancy-info");

    let rooms, instructors, instructorSchedule = [];

    // Generate input fields for instructors' schedule
    generateBtn.addEventListener("click", () => {
        rooms = parseInt(document.getElementById("rooms").value);
        instructors = parseInt(document.getElementById("instructors").value);

        if (!rooms || !instructors || rooms < 1 || instructors < 1) {
            alert("Please enter valid numbers for rooms and instructors.");
            return;
        }

        scheduleTable.innerHTML = `<h3>Instructor Schedule</h3>`;
        for (let i = 0; i < instructors; i++) {
            scheduleTable.innerHTML += `
                <label>Instructor ${i + 1} - Time:</label>
                <input type="text" id="time-${i}" placeholder="e.g., 1:00-2:30">
                <label>Instructor ${i + 1} - Days:</label>
                <input type="text" id="days-${i}" placeholder="e.g., TTh">
            `;
        }

        scheduleTable.innerHTML += `
            <button type="button" id="submit-schedule">Submit Schedule</button>
        `;

        document.getElementById("submit-schedule").addEventListener("click", () => {
            instructorSchedule = [];
            for (let i = 0; i < instructors; i++) {
                const time = document.getElementById(`time-${i}`).value;
                const days = document.getElementById(`days-${i}`).value;
                if (!time || !days) {
                    alert(`Please fill out the schedule for Instructor ${i + 1}`);
                    return;
                }
                instructorSchedule.push({ id: i + 1, time, days });
            }

            alert("Instructor schedule submitted successfully!");
        });
    });

    // Optimize allocation using a basic algorithm
    optimizeBtn.addEventListener("click", () => {
        if (!rooms || !instructorSchedule || instructorSchedule.length === 0) {
            alert("Please generate and submit the instructor schedule first!");
            return;
        }

        // Basic MILP Simulation
        const roomAllocation = Array.from({ length: rooms }, () => []);
        instructorSchedule.forEach(instructor => {
            // Basic room allocation (greedy allocation by instructor)
            const availableRoom = roomAllocation.find(room => room.length < 1); // Choose the first available room
            if (availableRoom) {
                availableRoom.push(instructor);
            }
        });

        // Clear previous room grid
        roomGrid.innerHTML = '';

        // Display room grid
        roomAllocation.forEach((room, idx) => {
            const roomCell = document.createElement('div');
            roomCell.classList.add('room-cell');
            if (room.length > 0) {
                roomCell.classList.add('filled');
                roomCell.innerHTML = `<strong>Room ${idx + 1}</strong><br/>`;
                room.forEach(instructor => {
                    roomCell.innerHTML += `<div class="room-info">Instructor ${instructor.id}: ${instructor.time}, ${instructor.days}</div>`;
                });
            } else {
                roomCell.classList.add('empty');
                roomCell.innerHTML = `<strong>Room ${idx + 1}</strong><br/>Vacant`;
            }
            roomGrid.appendChild(roomCell);
        });

        // Show number of vacant rooms
        const vacantRooms = roomAllocation.filter(room => room.length === 0).length;
        vacancyInfo.innerHTML = `<strong>Vacant Rooms:</strong> ${vacantRooms}`;
    });
});