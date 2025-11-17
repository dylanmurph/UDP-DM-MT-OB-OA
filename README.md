
# IoT Door Entry System with Facial Recognition

### SD3B UDP 2025

**Authors:** Dylan Murphy, Matthew Tomkins, Oisin Bell, Oluwadamilare David Adekeye

## Context

This product is designed to be used at the main staff entrance of a medium sized office building. Employees must use this system daily to securely enter this building. It gives confidence to all staff about the security of the building by preventing unauthorised access.

## Description

The main goal of this project is to grant entry into a building securely using an RFID/NFC reader with a second layer of protection via facial recognition.

The system first verifies that the ID of the keyfob/NFC code corresponds with information stored in a user database and validates the user on the system. It then uses a camera with facial recognition to confirm the person at the door matches the employee photo stored in the database.

If the user matches the system, it will release a door lock and grant entry into the building, logging when the person has entered and storing the information in the database.

If the keyfob ID is incorrect, facial recognition fails, or the system cannot read the user's face, the system will respond with an audible alert notifying the user that entry failed and this event will be logged in the database. An audible alert can also be sent inside the building to a receptionist or security officer.

The system is capable of logging all entrants and maintaining a record of employees currently in the building.

## Prerequisites

- Python 3.10 or newer installed and available on PATH
- Git (optional, for cloning or pushing to GitHub)
- Recommended: an internet connection to install dependencies

# Project Setup

## 1. Clone the repo and navigate to the project folder
```bash
git clone <repo-url>
cd <project-folder>
```

## 2. Setup Python backend
```bash
python -m venv venv
```

### On Windows:
```bash
venv\Scripts\Activate
```
### On macOS/Linux:
```bash
source venv/bin/activate
```

pip install -r server/requirements.txt

## 3. Setup React frontend
```bash
npm install (in root)
cd client
npm install
```

## 4. Setup Database
```bash
create database on xampp
```
## 5. Setup env files

### a. Setup env file in Root

```bash
JWT_SECRET_KEY=supersecretdevkey123

DATABASE_URL=mysql+pymysql://root:password@localhost/dbname

REACT_APP_API_URL=http://localhost:5000
```

### b. setup env file in Client
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 6. Set Up Tailwind in Client

# Install Tailwind (v3) + PostCSS stuff
npm install -D tailwindcss@3 postcss autoprefixer

# Generate Tailwind + PostCSS config files 
( No Need to do this )
npx tailwindcss init -p

# Icons
npm install lucide-react

## 7. Access the app
```bash
npm start (at root)
```