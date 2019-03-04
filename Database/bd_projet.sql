SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


-- Base de données :  `bd_projet`

-- table t_service

CREATE TABLE `t_service` (
  `id_service` int(11) NOT NULL AUTO_INCREMENT,
  `nom_service` varchar(64) NOT NULL,
  `id_chefDeService` int(11),
  PRIMARY KEY (`id_service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- table t_collaborateur

CREATE TABLE `t_collaborateur` (
  `id_collab` int(11) NOT NULL AUTO_INCREMENT,
  `id_serviceCollab` int(11) NOT NULL,
  `nom_collab` varchar(64) NOT NULL,
  `prenom_collab` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL ,
  PRIMARY KEY (`id_collab`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ajout des cles etrangeres pour t_service et t_collaborateur

ALTER TABLE `t_service`
  ADD FOREIGN KEY (`id_chefDeService`) REFERENCES t_collaborateur(`id_collab`);

ALTER TABLE `t_collaborateur`
  ADD FOREIGN KEY (`id_serviceCollab`) REFERENCES t_service(`id_service`);
ALTER TABLE `t_collaborateur`
  ADD UNIQUE `col_unique`(`nom_collab`);

-- ajout des donnees pour les tests
INSERT INTO `t_service` (`id_service`, `nom_service`, `id_chefDeService`) VALUES
(1, 'Ressources humaines', NULL),
(2, 'Comptabilite', NULL),
(3, 'Logistique', NULL);

INSERT INTO `t_collaborateur` (`id_collab`, `id_serviceCollab`, `nom_collab`, `prenom_collab`, `password`) VALUES
(1, 1, 'Michel', 'Tommy', SHA2('password', 256)),
(2, 1, 'Daouda', 'Diallo', SHA2('password', 256)),
(3, 2, 'Jean', 'Rene', SHA2('password', 256)),
(4, 2, 'Martin', 'Carole', SHA2('password', 256)),
(5, 3, 'Duflo', 'Gabriel', SHA2('password', 256)),
(6, 3, 'Travis', 'Scott', SHA2('password', 256));


-- Création du lien entre le service et les collaborateurs
-- Ressources humaines
UPDATE t_service
SET id_chefDeService = 1
WHERE id_service = 1;
-- Comptabilité
UPDATE t_service
SET id_chefDeService = 3
WHERE id_service = 2;
-- Logistique
UPDATE t_service
SET id_chefDeService = 5
WHERE id_service = 3;


-- table t_mission

CREATE TABLE `t_mission` (
  `id_mission` int(11) NOT NULL AUTO_INCREMENT,
  `id_chef` int(11) NOT NULL,
  `nom_mission` varchar(128) NOT NULL,
  `date_mission` DATE NOT NULL,
  `ouverte` boolean NOT NULL,
  PRIMARY KEY (`id_mission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_mission`
  ADD FOREIGN KEY (`id_chef`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_mission` (`id_mission`, `id_chef`, `nom_mission`, `date_mission`, `ouverte`) VALUES
(1, 5, 'mission Thales', '2019-01-28', TRUE),
(2, 5, 'mission Amazon', '2019-01-28', TRUE);

-- table de jointure mission-collaborateur

CREATE TABLE `t_missionCollab` (
  `id_mission` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_missionCollab`
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);
ALTER TABLE `t_missionCollab`  
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_missionCollab` (`id_mission`, `id_collab`) VALUES
(1, 5),
(1, 6),
(2, 5),
(2, 6);

-- table t_conge

CREATE TABLE `t_conge` (
  `id_collab` int(11) NOT NULL,
  `rtt_restant` int(11) NOT NULL,
  `rtt_pris` int(11) NOT NULL,
  `cp_restant` int(11) NOT NULL,
  `cp_pris` int(11) NOT NULL,
  `css_pris` int(11) NOT NULL,
  PRIMARY KEY (`id_collab`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_conge`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_conge` (`id_collab`, `rtt_restant`, `rtt_pris`, `cp_restant`, `cp_pris`, `css_pris`) VALUES
(6, 10, 10, 10, 10, 10);

-- table t_demande_conge

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
  `duree` int(11) NOT NULL,
  PRIMARY KEY (`id_demande_conge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_demande_conge`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_demande_conge` (`id_demande_conge`, `id_collab`, `type_demande_conge`, `date_debut`, `debut_matin`, `date_fin`, `fin_aprem`, `status_conge`, `motif_refus`, `duree`) VALUES
(1, 6, 'rtt', '2019-01-22', TRUE, '2019-01-23', TRUE, 'attCds', '', 4),
(2, 6, 'cp', '2019-01-20', FALSE, '2019-01-21', FALSE, 'attRH', '', 2);

-- table t_modification_conge

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
  `duree` int(11) NOT NULL,
  PRIMARY KEY (`id_modif_conge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_modification_conge`
  ADD FOREIGN KEY (`id_demande_conge`) REFERENCES t_demande_conge(`id_demande_conge`);
ALTER TABLE `t_modification_conge`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- table t_statut

CREATE TABLE `t_statut` (
  `id_statut` int(2) NOT NULL,
  `libelle` varchar(10) NOT NULL,
  PRIMARY KEY (`id_statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `t_statut` (`id_statut`, `libelle`) VALUES
(1, 'avnoSent'),
(2, 'avattF'),
(3, 'avattCds'),
(4, 'avnoCds'),
(5, 'avnoF'),
(6, 'noSent'),
(7, 'attCds'),
(8, 'attF'),
(9, 'noCds'),
(10, 'noF'),
(11, 'val');

-- table t_note_de_frais

CREATE TABLE `t_note_de_frais` (
  `id_ndf` int(11) NOT NULL AUTO_INCREMENT,
  `id_collab` int(11) NOT NULL,
  `total` float(11) NOT NULL,
  `mois` int(2) NOT NULL,
  `annee` int(4) NOT NULL,
  PRIMARY KEY (`id_ndf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_note_de_frais`
  ADD UNIQUE `ndf_unique`(`id_collab`, `mois`, `annee`);
ALTER TABLE `t_note_de_frais`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_note_de_frais` (`id_ndf`, `id_collab`, `total`, `mois`, `annee`) VALUES
(1, 6, 145.67 , 11, 2018),
(2, 6, 589.43 , 12, 2018),
(3, 6, 500.56 , 01, 2019);

-- table t_ligne_de_frais

CREATE TABLE `t_ligne_de_frais` (
  `id_ldf` int(11) NOT NULL AUTO_INCREMENT,
  `id_ndf` int(11) NOT NULL,
  `id_mission` int(11) NOT NULL,
  `libelle_ldf` varchar(64) NOT NULL,
  `montant_ldf` float(11) NOT NULL,
  `date_ldf` DATE NOT NULL,
  `commentaire_ldf` varchar(255) NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `justif_ldf` BLOB,
  `id_statut` int(2) NOT NULL,
  PRIMARY KEY (`id_ldf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_ligne_de_frais`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);
ALTER TABLE `t_ligne_de_frais`
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);

ALTER TABLE `t_ligne_de_frais`
  ADD FOREIGN KEY (`id_statut`) REFERENCES t_statut(`id_statut`);


INSERT INTO `t_ligne_de_frais` (`id_ldf`, `id_ndf`, `id_mission`, `montant_ldf`, `libelle_ldf`, `date_ldf`,`id_statut`, `commentaire_ldf`,`motif_refus`, `justif_ldf`) VALUES
(1, 1, 1, 14.55, 'taxi', '2019-01-15', 6, '', '', NULL),
(2, 1, 1, 22.00, 'restaurant', '2019-01-15', 6, 'midi', '', NULL),
(3, 1, 1, 35.99, 'restaurant', '2019-01-15', 6, 'soir', '', NULL),
(4, 1, 2, 18.55, 'taxi', '2019-01-18', 11, '', '', NULL),
(5, 1, 2, 44.99, 'restaurant', '2019-01-15', 7, '', 'pas de restaurant le soir', NULL),
(16, 1, 2, 44.99, 'restaurant', '2019-01-15', 7, '', '', NULL),
(6, 2, 1, 14.55, 'taxi', '2019-01-15', 8, '', '', NULL),
(7, 2, 1, 22.00, 'restaurant', '2019-01-15', 7, 'midi', '', NULL),
(8, 2, 1, 35.99, 'restaurant', '2019-01-15', 6, 'soir', '', NULL),
(9, 2, 2, 18.55, 'taxi', '2019-01-18', 11, '', '', NULL),
(10, 2, 2, 44.99, 'restaurant', '2019-01-15', 10, '', 'pas de restaurant le soir', NULL),
(17, 2, 2, 44.99, 'restaurant', '2019-01-15', 9, '', '', NULL),
(11, 2, 1, 14.55, 'taxi', '2019-01-15', 9, '', '', NULL),
(12, 2, 1, 22.00, 'restaurant', '2019-01-15', 8, 'midi', '', NULL),
(13, 2, 1, 35.99, 'restaurant', '2019-01-15', 9, 'soir', '', NULL),
(14, 2, 2, 18.55, 'taxi', '2019-01-18', 11, '', '', NULL),
(15, 2, 2, 44.99, 'restaurant', '2019-01-15', 7, '', '', NULL),
(18, 2, 2, 44.99, 'restaurant', '2019-01-15', 6, '', 'pas de restaurant le soir', NULL);

-- table t_avance

CREATE TABLE `t_ligne_de_frais_avance` (
  `id_ldf` int(11) NOT NULL AUTO_INCREMENT,
  `id_ndf` int(11) NOT NULL,
  `id_ndf_ldf` int(11) NOT NULL,
  `id_mission` int(11) NOT NULL,
  `libelle_ldf` varchar(64) NOT NULL,
  `montant_ldf` float(11) NOT NULL,
  `date_ldf` DATE NOT NULL,
  `commentaire_ldf` varchar(255) NOT NULL,
  `motif_refus` varchar(128) NOT NULL,
  `justif_ldf` BLOB,
  `id_statut` int(2) NOT NULL, 
  `montant_estime` float(11) NOT NULL,
  `montant_avance` float(11) NOT NULL,
  PRIMARY KEY (`id_ldf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_ligne_de_frais_avance`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);
ALTER TABLE `t_ligne_de_frais_avance`

  ADD FOREIGN KEY (`id_ndf_ldf`) REFERENCES t_note_de_frais(`id_ndf`);
ALTER TABLE `t_ligne_de_frais_avance`

  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);
ALTER TABLE `t_ligne_de_frais_avance`
  ADD FOREIGN KEY (`id_statut`) REFERENCES t_statut(`id_statut`);



-- table t_admin

CREATE TABLE `t_admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nom_admin` int(11) NOT NULL,
  `password_admin` varchar(64) NOT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- table t_log

CREATE TABLE `t_log` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL,
  `date_log` DATE NOT NULL,
  `operation` varchar(128) NOT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_log`
  ADD FOREIGN KEY (`id_user`) REFERENCES t_collaborateur(`id_collab`);
ALTER TABLE `t_log`
  ADD FOREIGN KEY (`id_admin`) REFERENCES t_admin(`id_admin`);

-- table t_notif_dem_conge

CREATE TABLE `t_notif_dem_conge` (
  `id_demande_conge` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL,
  PRIMARY KEY (`id_demande_conge`, `id_collab`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_dem_conge`
  ADD FOREIGN KEY (`id_demande_conge`) REFERENCES t_demande_conge(`id_demande_conge`);
ALTER TABLE `t_notif_dem_conge`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

INSERT INTO `t_notif_dem_conge` (`id_demande_conge`, `id_collab`) VALUES
(1, 6),
(2, 6);

-- table t_notif_mod_conge

CREATE TABLE `t_notif_mod_conge` (
  `id_modif_conge` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL,
  PRIMARY KEY (`id_modif_conge`, `id_collab`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_mod_conge`
  ADD FOREIGN KEY (`id_modif_conge`) REFERENCES t_modification_conge(`id_modif_conge`);
ALTER TABLE `t_notif_mod_conge`
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

-- table t_notif_ndf

CREATE TABLE `t_notif_ndf` (
  `id_ndf` int(11) NOT NULL,
  `id_cds` int(11) NOT NULL,
  `date` DATE NOT NULL,
  `avance` boolean NOT NULL,
  `nb_lignes` int(5) NOT NULL,
  PRIMARY KEY (`id_ndf`, `id_cds`, `avance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_ndf`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);
ALTER TABLE `t_notif_ndf`

  ADD FOREIGN KEY (`id_cds`) REFERENCES t_collaborateur(`id_collab`);

CREATE TABLE `t_notif_ndf_to_compta` (
  `id_ndf` int(11) NOT NULL,
  `date` DATE NOT NULL,
  `avance` boolean NOT NULL,
  `nb_lignes` int(5) NOT NULL,
  PRIMARY KEY (`id_ndf`, `avance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_ndf_to_compta`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);

CREATE TABLE `t_notif_ndf_from_compta` (
  `id_ndf` int(11) NOT NULL,
  `date` DATE NOT NULL,
  `avance` boolean NOT NULL,
  `nb_lignes` int(5) NOT NULL,
  `acceptee` boolean NOT NULL,
  PRIMARY KEY (`id_ndf`, `avance`, `acceptee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_ndf_from_compta`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);



COMMIT;

