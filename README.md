# Borrowing and return SE LAB Management System

## 1. Introduction

-----

### 1.1 Features

- **Database Management:** Maintain a comprehensive database of SE LAB resources, including information about new acquisitions, borrowed items, and due dates.
- **User Management:** Manage SE memberships, issue library cards, and handle user requests and inquiries.
- **Admin Panel:** Provides administrative functionalities such as  managing Items resources, generating reports, and maintaining records.
- **Student Panel:** Allows students to search for books, view book details, reserve and borrow books, borrowed items, and analyze their transaction history.

## 2. Tools & Technology

### 2.1 Tools

- **MS Visual Studio Code:** Integrated development environment (IDE) for coding and project management.
- **MS Visio:** Diagramming tool for visualizing system architectures and workflows.
- **Rational Rose:** Modeling tool for creating visual representations of software designs.
- **Mongo DB Compass:** GUI tool for MongoDB database management and administration.
- **Thunder Client:** API testing tool for testing and debugging API endpoints.
- **Figma:** Design tool for creating user interface (UI) mockups and prototypes.
- **MS Word:** Word processing software for documentation and report writing.

### 2.2 Technology

- **React:** Markup language for creating the structure of web pages.
- **Tailwind CSS :** Styling language for enhancing the presentation of web pages.
- **JavaScript:** Programming language for adding interactivity and dynamic functionality to web pages.
- **React JS:** JavaScript  for building user interfaces, particularly for single-page applications.
- **Node JS:** JavaScript runtime environment for server-side development.
- **Mongo DB:** NoSQL database for storing and managing data in a flexible and scalable manner.
- **Node Mailer:** Module for sending email notifications and managing email communication within the application.

## 3. Instruction to Run Project

### 3.1 Prerequisites

Before running the project, ensure that the following software tools and dependencies are installed on your system:

- **Node.js:** JavaScript runtime environment for executing JavaScript code outside of a web browser.
- **Mongo DB:** NoSQL database used for storing and managing SE LAB data.
- **Chrome:** Web browser for accessing and interacting with the web-based application.
- **VS Code (optional):** Integrated development environment (IDE) for code editing and project management.

### 3.2 Steps

Follow these steps to set up and run the project on your local machine:
```
npm run dev
npm run build:all
```
concurrently \"cd client && npm run dev\" \"cd server && npm run dev\

1. **Download git repositary:**

2. **Backend Setup:**
   - Open the backend folder in VS Code or any preferred text editor.
   - Open the terminal and navigate to the backend folder.
   - Run the following commands to install dependencies and start the backend server: cd server
     ```
     npm install
     pm2 start server.js --node-args="--experimental-modules"

     ```

3. **Frontend Setup:**
   - Open the frontend folder in VS Code or any preferred text editor.
   - Open the terminal and navigate to the frontend folder.
   - Run the following commands to install dependencies and start the frontend server:
     ```
     npm install
     npm install uuid axios sweetalert2 date-fns
     ```

4. **Access the Application:**
   - Open a web browser (preferably Chrome) and navigate to the following URL:
     ```
     localhost:3000
     

### 3.3 Admin Credentials

Use the following credentials to access the admin panel of the application:

- **Email:** admin@lamduan.mfu.ac.th
- **Password:** 123456

### 3.4 Note
```
     {"_id":{
      "$oid":"66c85ac6c00c73842a7b6909"
      },
      "name":"Admin",
      "email":"admin@lamduan.mfu.ac.th",
      "password":"$2a$10$vyAFjaSctmikbHLgtRj3Ue4R2xSmEGIJVnFptZVYReWO/uZ76F6Cq",
      "isAdmin":true,
      "__v":{"$numberInt":"0"},
      "updatedAt":{
          "$date":{"$numberLong":"1724406470184"}
      }
     }

```

## 4. Conclusion

## ทำหน้า client
```
cd client ไปยังโปรเจคหลักเรา
npm i
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
npm install uuid //เพิ่มมาเพิ่อจัดการ id
npm install @emotion/react 
----------------
npm i react-router-dom react-icons
npm install react-modal 
npm install @mui/material //เพิ่มมาใหม่
npm install @emotion/styled //เพิ่มมาใหม่
npm run dev
----------------
cd.. ให้มาหน้าsparktech-youtube
npm i concurrently
```
## ทำหน้า server
```
npm install mongoose
cd.. ไปยังหน้าหลัก
npm init -y
cd server
npm i npm i bcryptjs
npm i express mongoose dotenv
npm install -D nodemon
npm start
npm i jsonwebtoken แล้วเพิ่มในหน้า controllers (import jwt from 'jsonwebtoken') เพื่อเรียกใช้
npm install passport-google-oauth20 express-session passport axios
npm install joi
npm install csv-parser fs


ของแดน ทำหน้าหลัก
-npm install antd 
-npm install bootstrap
```
