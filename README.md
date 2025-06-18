# TrainMate – Fitness App

TrainMate is a full-stack web application that connects **trainees** with their **personal trainers**. It helps trainees follow structured workout plans and allows trainers to manage their clients easily.

## Description

There are two types of users:

- **Trainees**:
  - View their daily workout plan
  - Track workouts for each day of the week
  - See GIF demos for exercises
  - Edit personal info (like weight, height, coach)

- **Trainers**:
  - View and manage all assigned trainees
  - Assign daily workout routines to each trainee
  - Search and add exercises from a public exercise API
  - Remove exercises from trainee plans

Login is required for both roles. Each user sees different pages depending on their role.

## User Requirements

1. **Login or Sign Up** with an email and password
2. On sign up, you're saved as either a trainee or trainer (can be set in DB)
3. After login:
   - **Trainees**:
     - See their dashboard and today's workout
     - Access their weekly plan and coach info
   - **Trainers**:
     - View all their trainees
     - Assign/remove workouts day by day
4. Session is saved using `localStorage` so you stay logged in

## 🛠️ Technologies Used
- React 18
- React Router
- Axios (for HTTP requests)
- CSS Modules

### 3rd Party API:
- [ExerciseDB] (used for exercise data and GIFs)

## 🚀 Getting Started (Frontend)

```bash
cd client
npm install
npm run dev
