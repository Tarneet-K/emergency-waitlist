# Hospital Triage Application  
CST3106 – Web Development  
Assignment 3  
Student: Tarneet Kaur  

## 1. Overview
The Hospital Triage App is a full-stack web application that simulates an emergency room triage process. Patients submit injury information and pain levels through a user interface, and triage staff manage priorities, rooms, and queue ordering through an admin dashboard. This assignment integrates all concepts from Lab 10 (Design System), Lab 11 (Database Schema), and Lab 12 (Node.js + PostgreSQL Integration).

## 2. Features

### Patient Features
- Select injury type  
- Select pain level (1–10)  
- Enter optional personal information  
- Submit triage entry  
- Automatically receive approximate wait time  

### Admin Features
- Load all patients  
- View injury, priority, room, and wait time  
- Select patient to manage  
- Update patient priority  
- Assign treatment room  
- Remove patient from queue  
- Queue automatically sorts by severity + arrival  

## 3. Technologies Used

### Frontend
- HTML5  
- CSS3 (Times New Roman design system from Lab 10)  
- Vanilla JavaScript  

### Backend
- Node.js  
- Express.js  
- PostgreSQL  

### Tools
- GitHub  
- VS Code  
- Postman  
- pgAdmin 4  

## 4. Project Structure
ASSIGNMENT03/
│
├── public/
│ ├── index.html
│ ├── patient.html
│ ├── admin.html
│ ├── patient.js
│ ├── admin.js
│ └── styles.css
│
├── server.js
├── db.js
└── README.md

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


