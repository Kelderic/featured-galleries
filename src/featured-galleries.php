<?php
/*
 * Plugin Name:       Featured Galleries
 * Plugin URI:        http://wordpress.org/plugins/featured-galleries/
 * Description:       WordPress ships with a Featured Image functionality. This adds a very similar functionality, but allows for full featured galleries with multiple images.
 * Version:           2.0.0
 * Author:            Andy Mercer
 * Author URI:        http://www.andymercer.net
 * Text Domain:       featured-galleries
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
*/


/***********************************************************************/
/*************************  DEFINE CONSTANTS  **************************/
/***********************************************************************/

define( 'FG_PLUGIN_VERSION', '2.0.0' );

define( 'FG_PLUGIN_FILE', __FILE__ );



/***********************************************************************/
/**********************  INCLUDE REQUIRED FILES  ***********************/
/***********************************************************************/

require_once( plugin_dir_path(FG_PLUGIN_FILE) . 'includes/controller.php' );

require_once( plugin_dir_path(FG_PLUGIN_FILE) . 'includes/public-functions.php' );



/***********************************************************************/
/*****************************  INITIATE  ******************************/
/***********************************************************************/

new FG_Controller();