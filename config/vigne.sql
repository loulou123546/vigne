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
  `area` int(11) NOT NULL,
  `density` decimal(10, 2) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `date_planting` datetime,
  `city` varchar(100),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farm_id`)
    REFERENCES vigne.farm(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


CREATE TABLE vigne.`estimation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parcel_id` int(11) NOT NULL,
  `date` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`parcel_id`)
    REFERENCES vigne.parcel(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB  DEFAULT CHARSET=utf8;


INSERT INTO vigne.farm (`id`, `name`) VALUES
(1, 'La Ferme des Pins');

INSERT INTO vigne.user (`id`, `farm_id`, `mail`, `password`, `first_name`, `last_name`) VALUES
(1, 1, 'durand@pins.fr', 'test', 'Bernard', 'Durand'),
(2, 1, 'martin@pins.fr', 'test', 'François', 'Martin');

/*
INSERT INTO vigne.parcel (`id`, `farm_id`, `name`, `area`, `type`, `date_planting`, `city`) VALUES
(1, 1, 'parcelle 1', 500, 1, '2014-05-28 00:00:00', 'Chalons');

INSERT INTO vigne.estimation (`id`, `parcel_id`, `date`) VALUES
(1, 1, '2018-05-28 00:00:00');*/