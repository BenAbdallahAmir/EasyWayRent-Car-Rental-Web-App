# 🚗 Car Rental Web App

![Laravel](https://img.shields.io/badge/Laravel-v12-red?style=flat-square&logo=laravel)
![Angular](https://img.shields.io/badge/Angular-v19-DD0031?style=flat-square&logo=angular)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=githubactions)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

A full-stack car rental web application built with **Laravel 12** (REST API) and **Angular 19**. Customers can browse and reserve vehicles, while administrators manage cars, categories, and users via a secure back office.

---

## 🌟 Features

### Front Office (Clients)
- 🔐 User registration & login
- 🚘 Browse and filter available cars
- 🛒 Add cars to cart & reserve
- 📆 Manage personal reservations

### Back Office (Admins)
- 🔐 Secure admin login
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
| Testing       | Postman, Thunder Client  |
| Dev Tools     | VS Code, Git, GitHub     |

---

## 💻 Technologies Used

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-F55247?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8892BF?style=for-the-badge&logo=php&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![VS Code](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)

---

## 🌐 Find Me Online

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ton-profil)
[![GitHub](https://img.shields.io/badge/GitHub-Profil-black?style=for-the-badge&logo=github)](https://github.com/ton-username)
[![Behance](https://img.shields.io/badge/Behance-Portfolio-1769ff?style=for-the-badge&logo=behance)](https://www.behance.net/ton-profil)

---

## 🖼️ Screenshots

> *(Add screenshots below, such as: dashboard view, reservation form, car listing, admin panel, etc.)*

---

## ⚙️ Installation

### Prerequisites

- PHP ≥ 8.2  
- Composer  
- Node.js & npm  
- Angular CLI  
- MySQL / phpMyAdmin

---

### 🔧 Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
