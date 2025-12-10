# Hospital Triage Application  
CST3106 – Web Development  
Assignment 3  
Student: Tarneet Kaur  

---

## 1. Overview

The Hospital Triage App is a full-stack web application that simulates an emergency room triage workflow.  
Patients can submit injury information and pain levels, and triage staff can manage priorities, assign rooms, and reorder the queue in real time.

This project is the final integration of three labs:

- **Lab 10** – UI/UX Design System (Typography, colour palette, components)
- **Lab 11** – Database Schema & ERD
- **Lab 12** – PostgreSQL + Node.js API integration

Assignment 3 brings all of these together into one working application.

---

## 2. Features

### **Patient Features**
- Select injury type  
- Select pain level (1–10)  
- Enter optional personal details  
- Submit triage request  
- Receive approximate wait time based on severity  

### **Admin Features**
- Load all patients  
- View injury, pain level, and wait time  
- Select a patient  
- Assign or change priority (Low → Critical)  
- Assign a treatment room  
- Remove patient from the queue  
- Queue automatically sorts by priority + arrival time  

---

## 3. Technologies Used

### **Frontend**
- HTML5  
- CSS3 (Times New Roman design system from Lab 10)  
- JavaScript (DOM updates, fetch API)

### **Backend**
- Node.js  
- Express.js  
- PostgreSQL  

### **Tools**
- Postman  
- Git & GitHub  
- pgAdmin 4  
- VS Code  

---

## 4. Project Structure

ASSIGNMENT03/
│
├── public/
│ ├── index.html # Landing page (choose User/Admin)
│ ├── patient.html # Patient triage form
│ ├── admin.html # Admin dashboard
│ ├── patient.js # Handles patient form submission
│ ├── admin.js # Handles list loading, selection, updating
│ └── styles.css # Main UI styling (Lab 10 design system)
│
├── server.js # Node.js Express server & API routes
├── db.js # PostgreSQL connection file
└── README.md # Main documentation (this file)

---

## 5. Database Schema (Lab 11 → Assignment 3)

### Table: patients
| Column | Type | Description |
|--------|------|-------------|
| patient_id | SERIAL PK | Unique ID |
| full_name | VARCHAR | Patient name |
| gender | VARCHAR | Optional |
| injury_type | VARCHAR | Selected injury |
| pain_level | INT | 1–10 |
| arrival_time | TIMESTAMP | Defaults to NOW() |
| priority_id | INT FK | Links to priorities |
| room_id | INT FK | Links to rooms |

### Table: priorities
| Column | Type |
|--------|------|
| priority_id | INT PK |
| label | VARCHAR |
| description | VARCHAR |
| approximate_time | INT |
| ui_colour | VARCHAR |

### Table: rooms
| Column | Type |
|--------|------|
| room_id | INT PK |
| room_name | VARCHAR |
| doctor_assigned | VARCHAR |
| status | BOOLEAN |

### Relationships
- patients.priority_id → priorities.priority_id  
- patients.room_id → rooms.room_id  
  

## 6. API Endpoints

### GET /patients
Returns all patients sorted by priority and arrival time.

### POST /patients
Creates a new patient record.

### PUT /patients/:id
Updates a patient’s priority or room.

### DELETE /patients/:id
Removes a patient from the queue.

## 7. Testing (Postman)
Recommended tests:
- POST new patient  
- GET verify record  
- PUT update priority  
- PUT assign room  
- DELETE remove patient  
- GET confirm updates  

## 8. UI Design Summary (from Lab 10)

### Typography
- Times New Roman  
- Regular: paragraphs, labels  
- Bold: headings, buttons  

### Colour Palette
Primary: #006D77  
Secondary: #83C5BE  
Background: #F6F9FA  
Severity Colours:  
- Low: #74C69D  
- Medium: #F9C74F  
- High: #F8961E  
- Critical: #D00000  

### Components
- Rounded cards  
- Shadows  
- Consistent spacing  
- Priority badges using severity colours  

(Full design system in DESIGN_SYSTEM.md)

## 9. Application Summary
- Patient submits triage data → stored in PostgreSQL  
- Admin loads queue → sorted by severity  
- Admin assigns priority + room  
- Real-time queue adjustments  
- Patients removed when treated  

## 10. Conclusion
This assignment demonstrates full-stack development including UI design, client-side JavaScript, server-side APIs, and database integration. The app meets all requirements for Assignment 3 and accurately models a simplified triage workflow.
