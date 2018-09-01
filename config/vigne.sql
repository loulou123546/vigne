SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `vigne`;

CREATE TABLE vigne.`farm` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


CREATE TABLE vigne.`user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farm_id` int(11) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farm_id`)
    REFERENCES vigne.farm(`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


CREATE TABLE vigne.`parcel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farm_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `area` float NOT NULL,
  `type` tinyint(4) NOT NULL,
  `date_planting` datetime,
  `row_distance` float NOT NULL,
  `plant_distance` float NOT NULL,
  `lng` float NOT NULL,
  `lat` float NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farm_id`)
    REFERENCES vigne.farm(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


CREATE TABLE vigne.`observation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parcel_id` int(11) NOT NULL,
  `user_id` int(11),
  `step_1_date` datetime,
  `bunch_number` smallint(6),
  `plant_number` smallint(6),
  `bunch_area` float,
  `step_2_date` datetime,
  `weight` float,
  `sugar_rate` float,
  `step_3_date` datetime,
  `weight_real` float,
  `sugar_rate_real` float,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`parcel_id`)
    REFERENCES vigne.parcel(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


CREATE TABLE vigne.`result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `observation_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `inf` float NOT NULL,
  `median` float NOT NULL,
  `sup` float NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`observation_id`)
    REFERENCES vigne.observation(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;


INSERT INTO vigne.farm (`id`, `name`) VALUES
(1, 'La Ferme des Pins');

INSERT INTO vigne.user (`id`, `farm_id`, `mail`, `password`, `first_name`, `last_name`) VALUES
(1, 1, 'durand@pins.fr', 'test', 'Bernard', 'Durand'),
(2, 1, 'martin@pins.fr', 'test', 'François', 'Martin');


INSERT INTO vigne.parcel (`id`, `farm_id`, `name`, `area`, `type`, `date_planting`, `row_distance`, `plant_distance`, `lng`, `lat`) VALUES
(1, 1, 'Parcelle 1', 500, 1, '2014-05-28 00:00:00', 1, 1.15, '49.567251', '3.557852'),
(2, 1, 'Parcelle 2', 500, 1, '2014-07-24 00:00:00', 1, 1.15, '49.578515', '3.694542'),
(3, 1, 'Parcelle 3', 500, 1, '2013-09-14 00:00:00', 1, 1.15, '49.236585', '3.526866');

/*
INSERT INTO vigne.estimation (`id`, `parcel_id`, `date`) VALUES
(1, 1, '2018-05-28 00:00:00');*/
