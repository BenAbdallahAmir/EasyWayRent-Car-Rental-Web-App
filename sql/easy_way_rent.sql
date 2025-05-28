-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 28 mai 2025 à 12:48
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `easy_way_rent`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cars`
--

CREATE TABLE `cars` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `model` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `doors` smallint(5) UNSIGNED NOT NULL,
  `luggage` smallint(5) UNSIGNED NOT NULL,
  `passengers` smallint(5) UNSIGNED NOT NULL,
  `year` year(4) NOT NULL,
  `status` enum('available','rented') NOT NULL DEFAULT 'available',
  `price_per_day` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `license_plate` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cars`
--

INSERT INTO `cars` (`id`, `category_id`, `model`, `brand`, `doors`, `luggage`, `passengers`, `year`, `status`, `price_per_day`, `image`, `license_plate`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'CAR1', 'CAR1', 2, 1, 2, '2025', 'rented', 100.00, 'car_images/1746849794_nIyshquc6WgU7g4deqHnFxLFVoy7WlzXarNlvON6.jpg', 'TEST1', 'EAZEAEAAEAA', '2025-05-01 19:05:50', '2025-05-10 03:03:14'),
(2, 1, 'CAR2', 'CAR2', 2, 10, 2, '2025', 'rented', 900.00, 'car_images/1746849933_3jN16I8auwLtbV6ATwPvbGz8maji9jfJT6mBFEgh.jpg', 'NEW1', 'NEWNEWNEW', '2025-05-02 21:56:01', '2025-05-10 03:05:33'),
(5, 1, 'CAR3', 'CAR3', 2, 4, 2, '2025', 'available', 321.00, 'car_images/1746849822_nIyshquc6WgU7g4deqHnFxLFVoy7WlzXarNlvON6.jpg', 'eazzzzzz', 'aezzzzzzzzzz', '2025-05-10 02:23:35', '2025-05-16 10:56:21'),
(6, 1, 'CAR4', 'CAR4', 2, 4, 2, '2025', 'available', 78.00, 'car_images/1746849954_3jN16I8auwLtbV6ATwPvbGz8maji9jfJT6mBFEgh.jpg', 'azraz', 'azrzarza', '2025-05-10 02:32:01', '2025-05-10 03:05:54'),
(7, 2, 'CAR5', 'CAR5', 2, 5, 2, '2025', 'available', 90.00, 'car_images/1746896631_car1.jpg', '123CAR5123', 'CAR5CAR5CAR5', '2025-05-10 16:03:52', '2025-05-10 16:03:52');

-- --------------------------------------------------------

--
-- Structure de la table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reservation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `car_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `pickup_location` varchar(255) NOT NULL,
  `dropoff_location` varchar(255) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, '4X4', '2025-05-01 19:05:09', '2025-05-01 19:05:09'),
(2, 'Sport', '2025-05-10 03:05:02', '2025-05-10 03:05:02'),
(3, 'Sedan', '2025-05-10 15:57:36', '2025-05-10 15:57:36'),
(4, 'Off road', '2025-05-10 15:57:50', '2025-05-10 15:57:50');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(17, '0001_01_01_000000_create_users_table', 1),
(18, '0001_01_01_000001_create_cache_table', 1),
(19, '0001_01_01_000002_create_jobs_table', 1),
(20, '2025_03_25_144940_create_personal_access_tokens_table', 1),
(21, '2025_03_25_153449_create_categories_table', 1),
(22, '2025_03_25_153652_create_cars_table', 1),
(23, '2025_03_25_160308_create_reservations_table', 1),
(24, '2025_03_25_160414_create_carts_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(13, 'App\\Models\\User', 1, 'auth_token', 'a9666fa1d7c81464dd406dee9a09a755b4a52c7902a86002a63579184171c6ac', '[\"*\"]', '2025-05-02 12:21:18', NULL, '2025-05-02 12:19:13', '2025-05-02 12:21:18'),
(14, 'App\\Models\\User', 3, 'auth_token', '32d1e99b41725589105f98829a9bc6290ebb3a2913a005dcc23e8f999f3758c6', '[\"*\"]', NULL, NULL, '2025-05-02 22:56:23', '2025-05-02 22:56:23'),
(15, 'App\\Models\\User', 1, 'auth_token', 'dbff4b4bf3cca011eeacc51ea080b3dd01e5f4ed80fa1d30db93e7b1926a7d53', '[\"*\"]', NULL, NULL, '2025-05-02 22:57:33', '2025-05-02 22:57:33'),
(57, 'App\\Models\\User', 2, 'auth_token', '787cdd1f67c87afe2a046d65fcaecb775ad845c73caaf8eb46adf4b12332588d', '[\"*\"]', NULL, NULL, '2025-05-16 10:54:29', '2025-05-16 10:54:29');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `car_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `pickup_location` varchar(255) NOT NULL,
  `dropoff_location` varchar(255) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `pickup_location`, `dropoff_location`, `total_price`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '2025-07-01', '2025-07-07', 'Paris', 'Lyon', 600.00, 'credit_card', 'pending', '2025-05-01 19:06:56', '2025-05-01 19:06:56'),
(2, 1, 1, '2025-09-01', '2025-09-07', 'Paris', 'Lyon', 600.00, 'credit_card', 'confirmed', '2025-05-02 12:21:18', '2025-05-02 12:28:30'),
(3, 4, 2, '2025-07-01', '2025-10-07', 'Mahdia', 'Gafsa', 88200.00, 'credit_card', 'completed', '2025-05-04 13:25:47', '2025-05-04 14:03:58'),
(5, 6, 2, '2025-05-04', '2025-05-07', 'Mahdia', 'Tunis', 2700.00, 'credit_card', 'pending', '2025-05-04 15:03:01', '2025-05-04 15:03:01'),
(6, 2, 5, '2025-05-10', '2025-05-12', 'Gafsa', 'Tunis', 642.00, 'credit_card', 'completed', '2025-05-10 13:00:54', '2025-05-10 15:41:25'),
(7, 6, 5, '2025-05-16', '2025-05-17', 'Sousse', 'Tunis', 321.00, 'credit_card', 'completed', '2025-05-16 10:54:08', '2025-05-16 10:56:21');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `address`, `phone`, `password`, `remember_token`, `created_at`, `updated_at`, `email_verified_at`) VALUES
(1, 'client', 'TEST123', 'TEST@gmail.com', 'Sousse', '23195210', '$2y$12$VecH0jtcddLY0RaZp2A2YuzkDMpx/lpYyXbpd2IGFFk/YIlW97e3m', NULL, '2025-05-01 19:02:40', '2025-05-01 19:02:40', NULL),
(2, 'admin', 'admin', 'admin@gmail.com', 'Sousse', '23195210', '$2y$12$0MtV8dExuVoMdM7hhuDmkOvqRoDvXXamT49GJICstFAR2Abuylzey', NULL, '2025-05-01 19:03:07', '2025-05-03 20:05:47', NULL),
(3, 'admin', 'gheyda', 'gheyda@gmail.com', 'Turkey', '23923570', '$2y$12$P8NEbqBHkj6R84lEjYLI/O5IWBPL2MZJ/RTSr178IcU40w2yTaf8G', NULL, '2025-05-01 19:09:53', '2025-05-01 19:09:53', NULL),
(4, 'client', 'Amir Ben Abdallah', 'test123@gmail.com', 'Sousse', '2983012', '$2y$12$t6E5tZ1oE/JCTKSRVCV4oeJQUrhKeVt0MGoxRlvNZ723Zb7gdHY3i', NULL, '2025-05-02 10:47:52', '2025-05-03 21:37:30', NULL),
(6, 'client', 'finalTestuser', 'finalTestuser@gmail.com', 'Gafsa', '12345678', '$2y$12$mbPhruGhSQspl7ZV2G7jGe3r8JVZTlGcp9woeP/KTs1Uma7otYFie', NULL, '2025-05-04 14:57:19', '2025-05-04 14:57:19', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cars_license_plate_unique` (`license_plate`),
  ADD KEY `cars_category_id_foreign` (`category_id`);

--
-- Index pour la table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_reservation_id_foreign` (`reservation_id`),
  ADD KEY `carts_user_id_foreign` (`user_id`),
  ADD KEY `carts_car_id_foreign` (`car_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservations_user_id_foreign` (`user_id`),
  ADD KEY `reservations_car_id_foreign` (`car_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_car_id_foreign` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_reservation_id_foreign` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_car_id_foreign` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
