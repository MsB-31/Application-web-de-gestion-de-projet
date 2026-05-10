-- ============================================================
--  Digital Solutions – Plateforme de Gestion de Projets
--  Schéma MySQL complet – Compatible PhpMyAdmin / Laravel
--  Généré le : 2026-02-19
-- ============================================================

CREATE DATABASE IF NOT EXISTS `digital_solutions`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `digital_solutions`;

-- ============================================================
-- 1. UTILISATEURS
-- ============================================================
CREATE TABLE `users` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`               VARCHAR(100)    NOT NULL,
  `prenom`            VARCHAR(100)    NOT NULL,
  `email`             VARCHAR(191)    NOT NULL UNIQUE,
  `email_verified_at` TIMESTAMP       NULL DEFAULT NULL,
  `password`          VARCHAR(255)    NOT NULL,
  `role`              VARCHAR(100)    NOT NULL DEFAULT 'Membre',
  `avatar`            VARCHAR(500)    NULL DEFAULT NULL,
  `remember_token`    VARCHAR(100)    NULL DEFAULT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. TOKENS D'AUTHENTIFICATION (Laravel Sanctum)
-- ============================================================
CREATE TABLE `personal_access_tokens` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255)    NOT NULL,
  `tokenable_id`   BIGINT UNSIGNED NOT NULL,
  `name`           VARCHAR(255)    NOT NULL,
  `token`          VARCHAR(64)     NOT NULL UNIQUE,
  `abilities`      TEXT            NULL,
  `last_used_at`   TIMESTAMP       NULL DEFAULT NULL,
  `expires_at`     TIMESTAMP       NULL DEFAULT NULL,
  `created_at`     TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`     TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. PROJETS
-- ============================================================
CREATE TABLE `projects` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(255)    NOT NULL,
  `description` TEXT            NOT NULL,
  `statut`      ENUM('ACTIF','EN_PAUSE','TERMINE') NOT NULL DEFAULT 'ACTIF',
  `date_debut`  DATE            NOT NULL,
  `date_fin`    DATE            NULL DEFAULT NULL,
  `chef_id`     BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_projects_chef`
    FOREIGN KEY (`chef_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. TABLE PIVOT PROJET ↔ MEMBRES
-- ============================================================
CREATE TABLE `project_members` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_member` (`project_id`, `user_id`),
  CONSTRAINT `fk_pm_project`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pm_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. TÂCHES
-- ============================================================
CREATE TABLE `tasks` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id`    BIGINT UNSIGNED NOT NULL,
  `titre`         VARCHAR(255)    NOT NULL,
  `description`   TEXT            NULL DEFAULT NULL,
  `statut`        ENUM('A_FAIRE','EN_COURS','TERMINE') NOT NULL DEFAULT 'A_FAIRE',
  `priorite`      ENUM('BASSE','MOYENNE','HAUTE')      NOT NULL DEFAULT 'MOYENNE',
  `assigne_a_id`  BIGINT UNSIGNED NULL DEFAULT NULL,
  `date_echeance` DATE            NULL DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tasks_project` (`project_id`),
  INDEX `idx_tasks_statut`  (`statut`),
  CONSTRAINT `fk_tasks_project`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_assignee`
    FOREIGN KEY (`assigne_a_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. COMMENTAIRES SUR LES TÂCHES
-- ============================================================
CREATE TABLE `task_comments` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id`    BIGINT UNSIGNED NOT NULL,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `content`    TEXT            NOT NULL,
  `edited_at`  TIMESTAMP       NULL DEFAULT NULL,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_comments_task` (`task_id`),
  CONSTRAINT `fk_comments_task`
    FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. HISTORIQUE DES ACTIONS SUR LES TÂCHES
-- ============================================================
CREATE TABLE `task_history` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id`    BIGINT UNSIGNED NOT NULL,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `action`     ENUM(
    'CREATED','STATUS_CHANGED','PRIORITY_CHANGED',
    'ASSIGNED','UNASSIGNED','TITLE_CHANGED',
    'DESCRIPTION_CHANGED','COMMENT_ADDED'
  ) NOT NULL,
  `field`      VARCHAR(100) NULL DEFAULT NULL,
  `old_value`  TEXT         NULL DEFAULT NULL,
  `new_value`  TEXT         NULL DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_history_task` (`task_id`),
  CONSTRAINT `fk_history_task`
    FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_history_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================
CREATE TABLE `notifications` (
  `id`         CHAR(36)        NOT NULL,
  `type`       VARCHAR(255)    NOT NULL,
  `notifiable_type` VARCHAR(255) NOT NULL,
  `notifiable_id`   BIGINT UNSIGNED NOT NULL,
  `data`       TEXT            NOT NULL,
  `read_at`    TIMESTAMP       NULL DEFAULT NULL,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_notifications_notifiable` (`notifiable_type`, `notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNÉES DE DÉMO (optionnel)
-- ============================================================
INSERT INTO `users` (`nom`, `prenom`, `email`, `password`, `role`) VALUES
  ('Dupont',  'Jean',   'jean@ds.com',   '$2y$12$PLACEHOLDER_HASH', 'Chef de projet'),
  ('Martin',  'Sophie', 'sophie@ds.com', '$2y$12$PLACEHOLDER_HASH', 'Développeur'),
  ('Dubois',  'Lucas',  'lucas@ds.com',  '$2y$12$PLACEHOLDER_HASH', 'Designer'),
  ('Bernard', 'Emma',   'emma@ds.com',   '$2y$12$PLACEHOLDER_HASH', 'DevOps');

-- Note : remplacer PLACEHOLDER_HASH par Hash bcrypt généré via Laravel Tinker :
--   php artisan tinker → bcrypt('motdepasse')
