-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  mar. 03 juil. 2018 à 11:50
-- Version du serveur :  5.7.19
-- Version de PHP :  7.2.0RC2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bd_projet`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_service`
--

CREATE TABLE `t_service` (
  `id_service` int(11) NOT NULL AUTO_INCREMENT,
  `nom_service` varchar(64) NOT NULL,
  `id_chef` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_service`
--
ALTER TABLE `t_service`
  ADD PRIMARY KEY (`id_service`);
  ADD FOREIGN KEY (`id_chef`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_service`
--

INSERT INTO `t_service` (`id_service`, `nom_service`, `id_chef`) VALUES
(1, 'Ressources humaines', 0),
(2, 'Comptabilite', 0),
(3, 'Logistique', 0);


-- --------------------------------------------------------

--
-- Structure de la table `t_collaborateur`
--

CREATE TABLE `t_collaborateur` (
  `id_collab` int(11) NOT NULL AUTO_INCREMENT,
  `id_service` int(11) NOT NULL,
  `nom_collab` varchar(64) NOT NULL,
  `prenom_collab` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL AS (SHA2(CONCAT(name, description),256) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_collaborateur`
--
ALTER TABLE `t_collaborateur`
  ADD PRIMARY KEY (`id_collab`);
  ADD FOREIGN KEY (`id_service`) REFERENCES t_service(`id_service`);

-- TODO
-- Déchargement des données de la table `t_collaborateur`
--

INSERT INTO `t_collaborateur` (`id_collab`, `id_service`, `nom_collab`, `prenom_collab`, `password`) VALUES
(1, 1, 'Michel', 'Tommy', 'password'),
(2, 1, 'Daouda', 'Diallo', 'password'),
(3, 2, 'Jean', 'Rene', 'password'),
(4, 2, 'Martin', 'Carole', 'password'),
(5, 3, 'Duflo', 'Gabriel', 'password'),
(6, 3, 'Travis', 'Scott', 'password');


-- Création du lien entre le service et les collaborateurs
-- Ressources humaines
UPDATE t_service
SET id_chef = 1
WHERE id_service = 1;
-- Comptabilité
UPDATE t_service
SET id_chef = 3
WHERE id_service = 2;
-- Logistique
UPDATE t_service
SET id_chef = 5
WHERE id_service = 3;


-- --------------------------------------------------------

--
-- Structure de la table `t_mission`
--

CREATE TABLE `t_mission` (
  `id_mission` int(11) NOT NULL AUTO_INCREMENT,
  `id_chef` int(11) NOT NULL,
  `nom_mission` varchar(128) NOT NULL,
  `date_mission` DATE NOT NULL,
  `ouverte` boolean NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_mission`
--
ALTER TABLE `t_mission`
  ADD PRIMARY KEY (`id_mission`);
  ADD FOREIGN KEY (`id_chef`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_mission`
--

INSERT INTO `t_mission` (`id_mission`, `id_chef`, `nom_mission`, `date_mission`, `ouverte`) VALUES
(1, 5, 'mission Thales', '2019-01-28', TRUE),
(2, 5, 'mission Amazon', '2019-01-28', TRUE);

-- --------------------------------------------------------

--
-- Structure de la table `t_missionCollab`
--

CREATE TABLE `t_missionCollab` (
  `id_mission` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_missionCollab`
--
ALTER TABLE `t_missionCollab`
  ADD PRIMARY KEY (`id_mission`);
  ADD PRIMARY KEY (`id_collab`);
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_missionCollab`
--

INSERT INTO `t_missionCollab` (`id_mission`, `id_collab`) VALUES
(1, 5),
(1, 6),
(2, 5),
(2, 6);

-- -------------------------------------------------------

--
-- Structure de la table `t_conge`
--

CREATE TABLE `t_conge` (
  `id_collab` int(11) NOT NULL,
  `rtt_restant` int(11) NOT NULL,
  `rtt_pris` int(11) NOT NULL,
  `cp_restant` int(11) NOT NULL,
  `cp_pris` int(11) NOT NULL,
  `css_pris` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_conge`
--
ALTER TABLE `t_conge`
  ADD PRIMARY KEY (`id_collab`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_conge`
--

INSERT INTO `t_conge` (`id_collab`, `rtt_restant`, `rtt_pris`, `cp_restant`, `cp_pris`, `css_pris`) VALUES
(6, 10, 10, 10, 10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `t_demande_de_conge`
--

CREATE TABLE `t_demande_conge` (
  `id_demande_conge` int(11) NOT NULL AUTO_INCREMENT,
  `id_collab` int(11) NOT NULL,
  `type_demande_conge` enum('rtt', 'css', 'cp') NOT NULL,
  `date_debut` DATE NOT NULL,
  `debut_matin` boolean NOT NULL,
  -- si TRUE : le congé commence le matin 
  `date_fin` DATE NOT NULL,
  `fin_aprem` boolean NOT NULL,
  -- si TRUE : le congé finit l'aprem
  `status_conge` enum('attCds', 'attRh', 'noCds', 'noRh', 'validee', 'refusee') NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `duree` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_demande_conge`
--
ALTER TABLE `t_demande_conge`
  ADD PRIMARY KEY (`id_demande_conge`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_demande_conge`
--

INSERT INTO `t_demande_conge` (`id_demande_conge`, `id_collab`, `type_demande_conge`, `date_debut`, `debut_matin`, `date_fin`, `fin_aprem`, `status_conge`, `motif_refus`, `duree`) VALUES
(1, 6, 'rtt', '2019-01-22', TRUE, '2019-01-23', TRUE, 'attCds', '', 4),
(1, 6, 'cp', '2019-01-20', FALSE, '2019-01-21', FALSE, 'attCds', '', 2);

-- --------------------------------------------------------

--
-- Structure de la table `t_modification_conge`
--

CREATE TABLE `t_modification_conge` (
  `id_modif_conge` int(11) NOT NULL AUTO_INCREMENT,
  `id_demande_conge` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL,
  `type_demande_conge` enum('rtt', 'css', 'cp') NOT NULL,
  `date_debut` DATE NOT NULL,
  `date_fin` DATE NOT NULL,
  `debut_matin` boolean NOT NULL,
  -- si TRUE : le congé commence le matin 
  `fin_aprem` boolean NOT NULL,
  -- si TRUE : le congé finit l'aprem
  `status_conge` enum('attCds', 'attRh', 'noCds', 'noRh', 'validee', 'refusee') NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `duree` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_modification_conge`
--
ALTER TABLE `t_modification_conge`
  ADD PRIMARY KEY (`id_modif_conge`);
  ADD FOREIGN KEY (`id_demande_conge`) REFERENCES t_demande_conge(`id_demande_conge`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- --------------------------------------------------------

--
-- Structure de la table `t_note_de_frais`
--

CREATE TABLE `t_note_de_frais` (
  `id_ndf` int(11) NOT NULL AUTO_INCREMENT,
  `id_collab` int(11) NOT NULL,
  `total` float(11) NOT NULL,
  `mois` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_note_de_frais`
--
ALTER TABLE `t_note_de_frais`
  ADD PRIMARY KEY (`id_ndf`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_note_de_frais`
--

INSERT INTO `t_note_de_frais` (`id_ndf`, `id_collab`, `total`, `mois`) VALUES
(1, 6, 500.56 , 'janvier');

-- --------------------------------------------------------

--
-- Structure de la table `t_ligne_de_frais`
--

CREATE TABLE `t_ligne_de_frais` (
  `id_ldf` int(11) NOT NULL AUTO_INCREMENT,
  `id_ndf` int(11) NOT NULL,
  `id_mission` int(11) NOT NULL,
  `libelle` varchar(64) NOT NULL,
  `montant_ligne` float(11) NOT NULL,
  `date_ldf` DATE NOT NULL,
  `status_ligne` enum('notSent', 'attCds', 'attF', 'noCds', 'noF', 'validee')  NOT NULL,
  `commentaire_ligne` varchar(255) NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `justif_ligne` BLOB
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_ligne_de_frais`
--
ALTER TABLE `t_ligne_de_frais`
  ADD PRIMARY KEY (`id_ldf`);
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);

-- TODO
-- Déchargement des données de la table `t_ligne_de_frais`
--

INSERT INTO `t_ligne_de_frais` (`id_ldf`, `id_ndf`, `id_mission`, `libelle`, `montant_ligne`, `date_ldf`,`status_ligne`, `commentaire_ligne`,`motif_refus`, `justif_ligne`) VALUES
(1, 1, 1, 14.55, 'taxi', '2019-01-15', 'notSent', '', '', NULL),
(2, 1, 1, 22.00, 'restaurant', '2019-01-15', 'notSent', 'midi', '', NULL),
(3, 1, 1, 35.99, 'restaurant', '2019-01-15', 'notSent', 'soir', '', NULL),
(4, 1, 2, 18.55, 'taxi', '2019-01-18', 'validee', '', '', NULL),
(5, 1, 2, 44.99, 'restaurant', '2019-01-15', 'noCds', '', 'pas de restaurant le soir', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `t_avance`
--

CREATE TABLE `t_avance` (
  `id_avance` int(11) NOT NULL,
  `id_ndf` int(11) NOT NULL,
  `id_mission` int(11) NOT NULL,
  `montant` float(11) NOT NULL,
  `date_avance` DATE NOT NULL,
  `status_avance` enum('notSent', 'attCds', 'attF', 'noCds', 'noF', 'validee')  NOT NULL,
  `mission_effectuee` boolean NOT NULL, 
  `commentaire_avance` varchar(128) NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `justif_avance` BLOB,
  `montant_estime` float(11) NOT NULL,
  `montant_avance` float(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_ligne_de_frais`
--
ALTER TABLE `t_avance`
  ADD PRIMARY KEY (`id_avance`);
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);

-- --------------------------------------------------------

--
-- Structure de la table `t_admin`
--

CREATE TABLE `t_admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nom_admin` int(11) NOT NULL,
  `password_admin` varchar(128) NOT NULL AS (SHA2(CONCAT(name, description),256) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_admin`
--
ALTER TABLE `t_admin`
  ADD PRIMARY KEY (`id_admin`);

-- --------------------------------------------------------

--
-- Structure de la table `t_log`
--

CREATE TABLE `t_log` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL,
  `date_log` DATE NOT NULL,
  `operation` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour la table `t_logs`
--
ALTER TABLE `t_log`
  ADD PRIMARY KEY (`id_log`);
  ADD FOREIGN KEY (`id_user`) REFERENCES t_collaborateur(`id_collab`);
  ADD FOREIGN KEY (`id_admin`) REFERENCES t_admin(`id_admin`);



COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
