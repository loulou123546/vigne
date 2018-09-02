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


CREATE TABLE vigne.`alert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `type` tinyint(4) NOT NULL,
  `description` text,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`)
    REFERENCES vigne.user(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;
