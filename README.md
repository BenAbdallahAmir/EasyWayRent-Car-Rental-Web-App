# 🚗 EasyWayRent | Web App

![Laravel](https://img.shields.io/badge/Laravel-v12-red?style=flat-square&logo=laravel)
![Angular](https://img.shields.io/badge/Angular-v19-DD0031?style=flat-square&logo=angular)
![PHP](https://img.shields.io/badge/Angular-v19-DD0031?style=flat-square&logo=php)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

A full-stack car rental web application built with **Laravel 12** (REST API) and **Angular 19**. Customers can browse and reserve vehicles, while administrators manage cars, categories, and users via a secure back office.

---

## 🌟 Features

### Front Office (Clients)
- 🔐 User registration & login
- 🪪 Edit profile
- 🚘 Browse and filter available cars
- 🛒 Add cars to cart & reserve
- 📆 Manage personal reservations

### Back Office (Admins)
- 🛡️ Secure admin login
- 📁 CRUD operations: cars & categories
- 👤 Manage users
- 📋 View reservation history (client, car, date)

---

## 🧰 Tech Stack

| Layer         | Technology              |
|---------------|--------------------------|
| Frontend      | Angular 19               |
| Backend       | Laravel 12 (REST API)    |
| Database      | MySQL (phpMyAdmin)       |
| Authentication| Laravel Sanctum          |
| Testing       | Postman  |
| Dev Tools     | VS Code, Git, GitHub     |

---

## 💻 Technologies Used

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-F55247?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8892BF?style=for-the-badge&logo=php&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-264de4?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![VS Code](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![XAMPP](https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)

---

## 🌐 Find Me Online

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/benabdallahamir)
[![GitHub](https://img.shields.io/badge/GitHub-Profil-black?style=for-the-badge&logo=github)](https://github.com/BenAbdallahAmir)
[![Behance](https://img.shields.io/badge/Behance-Portfolio-1769ff?style=for-the-badge&logo=behance)](https://www.behance.net/aba_artworks)

---

## 🖼️ Screenshots

![App Screenshot](blob:https://web.whatsapp.com/04778618-9389-4fd5-94ba-7bee419e286a)

---

## 💻⚙️ Installation

### Prerequisites

- PHP ≥ 8.2  
- XAMPP
- Composer  
- Node.js & npm  
- Angular CLI  
- MySQL / phpMyAdmin

---

### 🔧 Backend Setup (Laravel)

```bash
cd easywayrent_backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
---

### ⚙️ Frontend Setup (Angular)

```bash
cd easywayrent_frontend
npm install
ng serve
```
---

### 🛢️ Import Database

- Use phpMyAdmin to import the file at: sql/car_rental_db.sql  

---

## 🔐 API Authentication

- All admin routes are protected using auth:sanctum.

- Example endpoints:
  - POST /api/register

  - POST /api/login

  - GET /api/cars

  - POST /api/reservations
