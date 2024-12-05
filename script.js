document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate");
    const optimizeBtn = document.getElementById("optimize");
    const instructorScheduleInputs = document.getElementById("instructor-schedule-inputs");
    const allocationResultsDiv = document.getElementById("allocation-results");
    const vacancyResultsDiv = document.getElementById("vacancy-results");

    let rooms, instructors, instructorData = [];

    // Generate input fields for instructor schedules
    generateBtn.addEventListener("click", () => {
        rooms = parseInt(document.getElementById("rooms").value);
        instructors = parseInt(document.getElementById("instructors").value);

        if (!rooms || !instructors || rooms < 1 || instructors < 1) {
            alert("Please enter valid numbers for rooms and instructors.");
            return;
        }

        instructorScheduleInputs.innerHTML = `<h3>Instructor Schedule Details</h3>`;
        for (let i = 0; i < instructors; i++) {
            instructorScheduleInputs.innerHTML += `
                <label>Instructor ${i + 1} Schedule (Enter hours as comma-separated values):</label>
                <input type="text" id="instructor-${i}" required placeholder="e.g., 9, 10, 11 for 9AM-12PM">
            `;
        }

        instructorScheduleInputs.innerHTML += `
            <button type="button" id="submit-schedules">Submit Schedules</button>
        `;

        document.getElementById("submit-schedules").addEventListener("click", () => {
            instructorData = [];
            for (let i = 0; i < instructors; i++) {
                const scheduleInput = document.getElementById(`instructor-${i}`).value;
                const hours = scheduleInput.split(",").map(hour => parseInt(hour.trim()));

                if (hours.some(hour => hour < 1 || hour > 24)) {
                    alert(`Invalid hours for Instructor ${i + 1}`);
                    return;
                }

                instructorData.push({ id: i + 1, schedule: hours });
            }
            alert("Schedules submitted successfully!");
        });
    });

    // Optimize room allocation using a basic algorithm
    optimizeBtn.addEventListener("click", () => {
        if (!rooms || !instructorData || instructorData.length === 0) {
            alert("Please generate and submit instructor data first!");
            return;
        }

        const roomAllocation = Array.from({ length: rooms }, () => []);
        const timeSlots = Array.from({ length: 24 }, () => []); // Tracks the time slots for each hour (1-24)

        // Assign instructors to rooms
        instructorData.forEach(instructor => {
            instructor.schedule.forEach(hour => {
                roomAllocation[hour % rooms].push(instructor);
                timeSlots[hour - 1].push(instructor);
            });
        });

        // Display room allocation results
        allocationResultsDiv.innerHTML = `<h3>Optimized Room Allocation</h3>`;
        roomAllocation.forEach((room, idx) => {
            allocationResultsDiv.innerHTML += `<div class="room-allocation">
                <h4>Room ${idx + 1}</h4>`;
            room.forEach(instructor => {
                allocationResultsDiv.innerHTML += `<p>Instructor ${instructor.id} - Scheduled at: ${instructor.schedule.join(", ")}</p>`;
            });
            allocationResultsDiv.innerHTML += `</div>`;
        });

        // Display vacancy results for each time slot
        vacancyResultsDiv.innerHTML = `<h3>Room Vacancy Overview</h3>`;
        timeSlots.forEach((slot, idx) => {
            vacancyResultsDiv.innerHTML += `<div class="vacancy-time-slot">
                <h4>Time Slot: ${idx + 1}:00 - ${idx + 2}:00</h4>
                <p>Rooms Occupied: ${rooms - slot.length}</p>
                <p>Instructors With Classes: ${slot.length}</p>
                <p>Vacant Rooms: ${slot.length ? rooms - slot.length : rooms}</p>
            </div>`;
        });
    });
});
