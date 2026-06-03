System Log - Attendance Management System
System Log is a modern, full-stack Employee Attendance Tracking and Management System. Designed to replace outdated spreadsheets and paper logs, it provides a secure, automated way for companies to track when and where their employees are working, while offering HR and administrators a powerful "God-mode" dashboard to oversee the entire workforce.

📖 Purpose & Overview
The primary goal of the application is to answer two critical operational questions every day:

Who is currently working?

Where are they working from? (e.g., In-Office, Work-From-Home, Client Site, Leave).

The project implements strict Role-Based Access Control (RBAC), meaning the application physically changes shape and capabilities depending on whether a standard employee or an administrator logs in.

✨ Key Features
For Standard Employees (/dashboard)
Automated Onboarding: Employees sign up by entering their name and project. The system automatically generates and assigns a secure, unique EMP##### ID to prevent collisions.

Daily Punch-Clock: A minimalist home screen to select their daily work status and "Clock In." The system tracks active shifts and provides a "Clock Out" button.

Attendance History: A clean, tabular view of all past shifts, formatted beautifully with localized dates and times.

Profile Management: A read-only view of their corporate identity, active status, and project assignments.

For Administrators (/admin)
Company Overview: A live feed of all corporate attendance logs.

Dynamic Search & Filtering: Admins can search for specific employee logs or filter records before a specific date.

Data Management: Direct capabilities to permanently delete erroneous logs or terminate employee accounts.

Auto-Close Protocol: A manual trigger that sweeps the database for employees who forgot to clock out on previous days and forcibly closes their shifts.

💻 Technology Stack
Frontend (Client-Side)
React.js (Vite): Lightning-fast build tool and component-based UI architecture.

React Router DOM: Manages seamless, single-page application (SPA) routing with nested layouts (frozen sidebars with dynamic content).

Axios: Handles HTTP requests with a custom interceptor configured to automatically attach JWT authorization headers.

CSS3: Custom, zero-dependency styling focusing on a modern, soft-pastel minimalist aesthetic for the dashboard, and a sleek dark mode for the onboarding flow.

Backend (Server-Side)
Python / Django: The core server framework handling business logic, database ORM, and secure routing.

Django REST Framework (DRF): Serializes database models into JSON for the React frontend.

Simple JWT: Manages JSON Web Tokens (Access and Refresh tokens) for stateless, highly secure API authentication.

django-cors-headers: Middleware configured to securely manage Cross-Origin Resource Sharing between the Vite server and Django server.

🗄️ Database Schema
The backend utilizes a relational database structure centered around two heavily customized models.

1. Employee (Extends Django's AbstractUser)
Acts as the system's core user authentication model.

EmployeeId: String (e.g., EMP12345) - The unique identifier and primary login username.

password: String - Securely hashed password.

FirstName / LastName: Strings - The employee's actual name.

ProjectInvolved: String - Current department or project assignment.

IsAdmin: Boolean - Flags the user with administrative privileges.

IsActive: Boolean - Determines if the account is currently permitted to log in.

2. AttendanceLog
Records individual shift data for every system punch-in.

EmployeeRef: ForeignKey - A relational link pointing directly to the EmployeeId.

LoginTime: DateTime - Captures the exact server timestamp on "Clock In".

LogoutTime: DateTime - Captures the timestamp on "Clock Out" (Nullable for active shifts).

WorkStatus: String - Environmental state (e.g., 'In-Office', 'WFH').

🏗️ Architecture & Authentication Flow
This application uses a decoupled, stateless architecture.

The Handshake: A user logs in via React. Django verifies the credentials and issues a short-lived access_token and a long-lived refresh_token.

The Vault: React stores these tokens securely in localStorage.

The Interceptor: For every subsequent API call (e.g., fetching history), Axios automatically intercepts the request and stamps the access_token into the HTTP Authorization header.

The Bouncer: Django's CORS middleware and JWT authentication classes verify the token. If valid, the DRF views process the request (filtering data so non-admins only see their own records) and return the JSON payload.