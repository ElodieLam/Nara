SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


-- Base de données :  `nara_database`

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
(6, 3, 'Travis', 'Scott', SHA2('password', 256)),
(7, 3, 'Ef', 'Camille', SHA2('password', 256));


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

-- table de jointure mission-collaborateur

CREATE TABLE `t_missionCollab` (
  `id_mission` int(11) NOT NULL,
  `id_collab` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_missionCollab`
  ADD FOREIGN KEY (`id_mission`) REFERENCES t_mission(`id_mission`);
ALTER TABLE `t_missionCollab`  
  ADD FOREIGN KEY (`id_collab`) REFERENCES t_collaborateur(`id_collab`);

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
(1, 10, 10, 10, 10, 10),
(2, 10, 10, 10, 10, 10),
(3, 10, 10, 10, 10, 10),
(4, 10, 10, 10, 10, 10),
(5, 10, 10, 10, 10, 10),
(6, 10, 10, 10, 10, 10),
(7, 10, 10, 10, 10, 10);

-- table t_demande_conge

CREATE TABLE `t_demande_conge` (
  `id_demande_conge` int(11) NOT NULL AUTO_INCREMENT,
  `id_collab` int(11) NOT NULL,
  `date_demande` DATE NOT NULL,
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

-- table t_notif_ndf_to_compta

CREATE TABLE `t_notif_ndf_to_compta` (
  `id_ndf` int(11) NOT NULL,
  `date` DATE NOT NULL,
  `avance` boolean NOT NULL,
  `nb_lignes` int(5) NOT NULL,
  PRIMARY KEY (`id_ndf`, `avance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `t_notif_ndf_to_compta`
  ADD FOREIGN KEY (`id_ndf`) REFERENCES t_note_de_frais(`id_ndf`);

-- table t_notif_ndf_from_compta

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