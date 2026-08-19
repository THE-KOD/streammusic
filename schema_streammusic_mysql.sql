-- ============================================================
-- STREAMMUSIC — SCHEMA DE BASE DE DONNEES (MySQL 8.0+)
-- Version corrigée suite à l'audit écrans <-> schéma
-- Corrections apportées : OAuth, date_sortie/pochette sur titre,
-- album_favori, préférences, session, statut_compte
-- ============================================================

CREATE DATABASE IF NOT EXISTS streammusic
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE streammusic;

-- ============================================================
-- 1. UTILISATEUR (table racine) & SPECIALISATIONS
-- ============================================================

CREATE TABLE utilisateur (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pseudo              VARCHAR(50)  NOT NULL UNIQUE,
    email               VARCHAR(255) NOT NULL UNIQUE,
    -- GAP 1 : nullable pour permettre un compte créé uniquement via OAuth
    mot_de_passe_hash   VARCHAR(255) NULL,
    oauth_provider      VARCHAR(50)  NULL,
    oauth_id            VARCHAR(255) NULL,
    photo_profil_url    VARCHAR(500),
    -- GAP 6 : statut de compte pour permettre une suspension réversible
    statut_compte       ENUM('ACTIF','SUSPENDU') NOT NULL DEFAULT 'ACTIF',
    date_inscription    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_oauth (oauth_provider, oauth_id),
    CONSTRAINT chk_auth_method CHECK (
        mot_de_passe_hash IS NOT NULL OR oauth_id IS NOT NULL
    ),
    CONSTRAINT chk_oauth_pair CHECK (
        (oauth_provider IS NULL) = (oauth_id IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE artiste (
    id                  CHAR(36) PRIMARY KEY,
    biographie          TEXT,
    photo_artiste_url   VARCHAR(500),
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE administrateur (
    id                  CHAR(36) PRIMARY KEY,
    niveau_acces        VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    FOREIGN KEY (id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GAP 4 : préférences musicales (many-to-many, remplace un simple champ)
CREATE TABLE utilisateur_genre_prefere (
    utilisateur_id  CHAR(36) NOT NULL,
    genre_id        CHAR(36) NOT NULL,
    PRIMARY KEY (utilisateur_id, genre_id)
    -- FK ajoutées après la création de `genre` plus bas
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GAP 5 : sessions pour permettre la révocation réelle du refresh token
CREATE TABLE session (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id      CHAR(36) NOT NULL,
    refresh_token_hash  VARCHAR(255) NOT NULL,
    date_creation       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_expiration     DATETIME NOT NULL,
    revoque             BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. ABONNEMENT (1-1 stricte avec utilisateur)
-- ============================================================

CREATE TABLE abonnement (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id      CHAR(36) NOT NULL UNIQUE,
    type                ENUM('GRATUIT','PREMIUM') NOT NULL DEFAULT 'GRATUIT',
    date_debut          DATE NOT NULL DEFAULT (CURRENT_DATE),
    date_fin            DATE NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    CONSTRAINT chk_dates_abonnement CHECK (date_fin IS NULL OR date_fin >= date_debut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. CATALOGUE MUSICAL
-- ============================================================

CREATE TABLE genre (
    id      CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nom     VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ajout différé des FK de utilisateur_genre_prefere (dépendait de genre)
ALTER TABLE utilisateur_genre_prefere
    ADD FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    ADD FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE;

CREATE TABLE album (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    artiste_id      CHAR(36) NOT NULL,
    titre           VARCHAR(255) NOT NULL,
    pochette_url    VARCHAR(500),
    date_sortie     DATE NOT NULL,
    FOREIGN KEY (artiste_id) REFERENCES artiste(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE titre (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    album_id            CHAR(36) NULL,          -- nullable : single sans album
    artiste_id          CHAR(36) NOT NULL,
    genre_id            CHAR(36) NOT NULL,
    titre               VARCHAR(255) NOT NULL,
    duree               INT NOT NULL,
    fichier_audio_url   VARCHAR(500) NOT NULL,
    -- GAP 2 : champs propres au titre, indépendants de l'album
    pochette_url        VARCHAR(500) NULL,
    date_sortie         DATE NULL,
    nombre_ecoutes      INT NOT NULL DEFAULT 0,
    date_ajout          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut_moderation   ENUM('EN_ATTENTE','VALIDE','REJETE') NOT NULL DEFAULT 'EN_ATTENTE',
    moderateur_id       CHAR(36) NULL,
    date_moderation     DATETIME NULL,
    FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE SET NULL,
    FOREIGN KEY (artiste_id) REFERENCES artiste(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE RESTRICT,
    FOREIGN KEY (moderateur_id) REFERENCES administrateur(id) ON DELETE SET NULL,
    CONSTRAINT chk_duree CHECK (duree > 0),
    CONSTRAINT chk_ecoutes CHECK (nombre_ecoutes >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. PLAYLISTS
-- ============================================================

CREATE TABLE playlist (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proprietaire_id     CHAR(36) NOT NULL,
    nom                 VARCHAR(100) NOT NULL,
    visibilite          ENUM('PUBLIQUE','PRIVEE') NOT NULL DEFAULT 'PRIVEE',
    date_creation       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE playlist_titre (
    playlist_id     CHAR(36) NOT NULL,
    titre_id        CHAR(36) NOT NULL,
    ordre           INT NOT NULL,
    date_ajout      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, titre_id),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. FAVORIS, ALBUMS SAUVEGARDES & SUIVI
-- ============================================================

CREATE TABLE favori (
    utilisateur_id  CHAR(36) NOT NULL,
    titre_id        CHAR(36) NOT NULL,
    date_ajout      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilisateur_id, titre_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GAP 3 : albums sauvegardés (absent de l'ancien schéma)
CREATE TABLE album_favori (
    utilisateur_id  CHAR(36) NOT NULL,
    album_id        CHAR(36) NOT NULL,
    date_ajout      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilisateur_id, album_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE suivi (
    follower_id     CHAR(36) NOT NULL,
    artiste_id      CHAR(36) NOT NULL,
    date_suivi      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, artiste_id),
    FOREIGN KEY (follower_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (artiste_id) REFERENCES artiste(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. HISTORIQUE D'ECOUTE & FILE D'ATTENTE
-- ============================================================

CREATE TABLE historique_ecoute (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id  CHAR(36) NOT NULL,
    titre_id        CHAR(36) NOT NULL,
    date_ecoute     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duree_ecoutee   INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE CASCADE,
    CONSTRAINT chk_duree_ecoutee CHECK (duree_ecoutee >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE file_attente (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id  CHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE file_attente_titre (
    file_id     CHAR(36) NOT NULL,
    titre_id    CHAR(36) NOT NULL,
    ordre       INT NOT NULL,
    PRIMARY KEY (file_id, titre_id),
    FOREIGN KEY (file_id) REFERENCES file_attente(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. NOTIFICATIONS & SUGGESTIONS
-- ============================================================

CREATE TABLE notification (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id  CHAR(36) NOT NULL,
    titre_id        CHAR(36) NULL,
    type            ENUM('NOUVELLE_SORTIE','SYSTEME') NOT NULL,
    message         VARCHAR(500) NOT NULL,
    date_envoi      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lu              BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE suggestion (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    utilisateur_id      CHAR(36) NOT NULL,
    titre_id            CHAR(36) NOT NULL,
    score               DECIMAL(5,4) NOT NULL,
    date_generation     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (titre_id) REFERENCES titre(id) ON DELETE CASCADE,
    CONSTRAINT chk_score CHECK (score >= 0 AND score <= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. INDEX (recherche et FK fréquemment jointes)
-- ============================================================

ALTER TABLE titre       ADD FULLTEXT INDEX ftx_titre_titre (titre);
ALTER TABLE album       ADD FULLTEXT INDEX ftx_album_titre (titre);

CREATE INDEX idx_titre_artiste_id        ON titre (artiste_id);
CREATE INDEX idx_titre_album_id          ON titre (album_id);
CREATE INDEX idx_titre_genre_id          ON titre (genre_id);
CREATE INDEX idx_album_artiste_id        ON album (artiste_id);
CREATE INDEX idx_playlist_proprietaire   ON playlist (proprietaire_id);
CREATE INDEX idx_historique_utilisateur  ON historique_ecoute (utilisateur_id, date_ecoute);
CREATE INDEX idx_historique_titre        ON historique_ecoute (titre_id);
CREATE INDEX idx_suggestion_utilisateur  ON suggestion (utilisateur_id);
-- Index partiel non supporté en MySQL : composite classique à la place
CREATE INDEX idx_notification_lu         ON notification (utilisateur_id, lu);
CREATE INDEX idx_session_utilisateur     ON session (utilisateur_id, revoque);

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
