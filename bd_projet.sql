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

INSERT INTO `t_etudiant` (`id_etudiant`, `matricule`, `nom`, `prenom`) VALUES
(1, '100', 'Boundi', 'Hassan'),
(2, '101', 'Daouda', 'Diallo'),
(3, '102', 'TEST', 'TEST'),
(4, 'vgdfghdf', 'dfdfdgh', 'hdhdfh'),
(5, '103', 'TEST', 'TET');

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

INSERT INTO `t_service` (`id_matire`, `libelle`, `coefficient`) VALUES
(1, 'Anglais', 2),
(2, 'Espagnol', 2),
(7, 'Droit', 3),
(8, 'Test', 1),
(9, 'Allemand', 2),
(10, 'test', 1);

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

INSERT INTO `t_mission` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

INSERT INTO `t_missionCollab` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `t_conge`
--

CREATE TABLE `t_conge` (
  `id_collab` int(11) NOT NULL,
  `nb_restant` int(11) NOT NULL,
  `nb_pris` int(11) NOT NULL,
  `rtt_restant` int(11) NOT NULL,
  `css_restant` int(11) NOT NULL,
  `cp_restant` int(11) NOT NULL
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

INSERT INTO `t_conge` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `t_demande_de_conge`
--

CREATE TABLE `t_demande_conge` (
  `id_demande_conge` int(11) NOT NULL AUTO_INCREMENT,
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
-- Index pour la table `t_demande_conge`
--
ALTER TABLE `t_demande_conge`
  ADD PRIMARY KEY (`id_demande_conge`);
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- TODO
-- Déchargement des données de la table `t_demande_conge`
--

INSERT INTO `t_demande_conge` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

-- TODO
-- Déchargement des données de la table `t_demande_conge`
--

INSERT INTO `t_demande_conge` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

INSERT INTO `t_note_de_frais` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `t_ligne_de_frais`
--

CREATE TABLE `t_ligne_de_frais` (
  `id_ldf` int(11) NOT NULL AUTO_INCREMENT,
  `id_ndf` int(11) NOT NULL,
  `id_mission` int(11) NOT NULL,
  `montant_ligne` float(11) NOT NULL,
  `date_ldf` DATE NOT NULL,
  `status_ligne` enum('notSent', 'attCds', 'attF', 'noCds', 'noF', 'validee')  NOT NULL,
  `commentaire_ligne` varchar(128) NOT NULL,
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

INSERT INTO `t_ligne_de_frais` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

-- TODO
-- Déchargement des données de la table `t_avance`
--

INSERT INTO `t_avance` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

-- TODO
-- Déchargement des données de la table `t_admin`
--

INSERT INTO `t_admin` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);

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

-- TODO
-- Déchargement des données de la table `t_logs`
--

INSERT INTO `t_log` (`id_note`, `valeur`, `date_creation`, `id_matiere`, `id_etudiant`) VALUES
(1, 14, '2017-08-10 12:38:27', 1, 1),
(2, 15, '2017-08-10 12:39:42', 1, 2);


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;