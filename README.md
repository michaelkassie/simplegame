# Simple Game
-------------

A small web-based game featuring user signup/login, a playable game screen, and a leaderboard to track top scores. 
live demo: https://simplegame-phi.vercel.app/

## Tech Stack  
- Frontend: HTML5, CSS3, JavaScript  
- Backend: Node.js (Express)  
- Storage: LocalStorage (for users & scores)  
- Deployment:  
  - Frontend – Vercel  
  - Backend – Render  

## Project Structure  
- backend/ – Node.js server files (API endpoints)  
- frontend/  
  - css/ – stylesheets  
  - img/ – game assets  
  - js/ – scripts (auth, game logic, leaderboard)  
  - index.html – home page  
  - game.html – main game screen  
  - leaderboard.html – leaderboard screen  

## Setup & Deployment 
  - Clone the respository
    - git clone https://github.com/michaelkassie/simplegame.git 

  - Install Dependencies
    - npm install 

  - Run Locally
    -node backend/index.js

  - Deploy
    - Frontend:
      - Push the frontend/ folder to a GitHub repo.
      - Connect the repo to Vercel and deploy.
        
    - Backend:
      - Push the backend/ folder to a GitHub repo.
      - Connect the repo to Render as a Web Service.
      - node index.js
        


    

