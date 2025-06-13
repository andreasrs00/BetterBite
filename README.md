# BetterBite — Intelligent Food Recognition & Nutrition Estimator

**BetterBite** is an image-based application designed to help users identify types of food and estimate their nutritional content simply by uploading a photo. This project was created to address a common problem: the difficulty of accurately estimating the nutritional value of meals, especially when detailed food information isn’t readily available.

By leveraging image classification technology and a comprehensive nutrition database, BetterBite enables users to receive instant, practical nutrition insights. The app aims to improve public nutritional awareness, encourage healthier decisions, and bridge the gap between the need for healthy eating and the lack of accessible information.

---

## Live Demo (Deployment)

BetterBite has been fully deployed and consists of three main components:

| Component           | GitHub Repository                                                                 | Link Deployment                                                                 |
|--------------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| Frontend (React)   | [project_capstone](https://github.com/nadiaoktarina/project_capstone)             | [Frontend Live](https://nadiaoktarina.github.io/project_capstone/)          |
| Backend API (Hapi.js) | [backend_capstone](https://github.com/nadiaoktarina/backend_capstone)         | [Backend Live](https://backendcapstone-production-2dd2.up.railway.app/)     |
| Flask Model Server | [Backend_capstone_flask](https://github.com/yesiarisas/Backend_capstone_flask)    | [Flask Model Live](https://grateful-magic-production-761e.up.railway.app/)  |


## How to Use

```
1. Start the Flask model server.
2. Launch the Hapi.js backend API.
3. Start the React frontend app.
4. Upload a photo of food and get instant nutrition insights.
```

---

## Installation & Setup

### 1. **Clone the repository**

```sh
git clone https://github.com/andreasrs00/BetterBite.git
cd BetterBite
```

---

### 2. **Setup Model Server (Flask)**

```sh
cd BetterBite_Flask
```

#### Create Virtual Environment

**Linux / macOS**:
```sh
python3 -m virtualenv venv
```

**Windows**:
```sh
python -m virtualenv venv
```

#### Activate Virtual Environment

**Linux / macOS**:
```sh
source venv/bin/activate
```

**Windows**:
```sh
venv\Scripts\activate
```

#### Install Requirements

```sh
pip install -r requirements.txt
```

#### Run Flask Model Server

**Linux / macOS**:
```sh
python3 app.py
```

**Windows**:
```sh
python app.py
```

---

### 3. **Setup Backend API (Hapi.js)**

```sh
cd ../BetterBite_Backend
```

```sh
npm install
npx sequelize-cli db:migrate
npm run dev
```

---

### 4. **Setup Frontend (React.js)**

```sh
cd ../BetterBite_Frontend
```

```sh
npm install
npm start
```

---

## Features

```
✔ Upload a photo to detect food items  
✔ Get instant nutritional estimates  
✔ Clean and responsive UI built with React  
✔ Scalable backend with Hapi.js & Sequelize  
✔ Model integration via Flask API  
```

---

## Project Structure

```
/BetterBite
│
├── BetterBite_Backend      # Node.js backend with Hapi.js & Sequelize
│   ├── config/
│   ├── migrations/
│   ├── models/
│   └── ...
│
├── BetterBite_Flask        # Flask model server (Python)
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── BetterBite_Frontend     # Frontend : React.js 
│   ├── public/
│   ├── src/
│   └── ...
│
├──BetterBite_MachineLearning   # Build Model, Scraping Data, Cleaning Data, Inference Model
|  ├──Data_Final
|  ├──Inference_Final
|  ├──building_model
|  ├──cleaning_data
|  ├──scraping_data
|
└── README.md               # Project documentation
```

---

## Example Usage

```
$ cd BetterBite_Flask
$ source venv/bin/activate
$ python3 app.py
Flask server running on http://localhost:5000

$ cd ../BetterBite_Backend
$ npm run dev
Hapi.js API running on http://localhost:3001

$ cd ../BetterBite_Frontend
$ npm start
React app running on http://localhost:3000
```

---


## Credits

```
- Created by andreasrs00 , ficosibagariang , fadhilsrg, yesiarisas, zulfarma, nadiaoktarina
- Built using:
  - React.js for the frontend   
  - Hapi.js (Node.js) for the backend API  
  - Flask (Python) for the model server
  - Build Model with MobileNetV2 
```

---

### Better Life with BetterBite & Fly Higher!
