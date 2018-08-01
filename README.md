# Featured Galleries

Do you like giving posts a Featured Image? Try out a Featured Gallery. It's like a Featured Images ... except as many images as you want.

Contributors: kelderic, drivingralle
Donate link: http://www.andymercer.net
Tags: admin,backend,galleries,featured,images
Requires at least: 3.8.0
Tested up to: 4.9.7
Stable tag: 2.0.0
Requires PHP: 5.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description

### Hello Theme Developers!

Have you ever added a Featured Image to a post and thought to yourself, 'I wish I could add more than one image this way'? Well, now you can. "Featured Galleries" mirrors the Featured Images functionality of WordPress. The only difference is that posts get an entire gallery rather than just a single image. These galleries behave almost exactly like Featured Images, and make use of  WordPress's built in Media Manager. Users can select images, define the order, and save the gallery, all through a simple drag-n-drop interface.

**Note**: This is not a plugin which will add galleries to your website. This is for theme developers. It handles the backend interface for creating featured galleries, and storing them. You will still need to build a gallery on your page templates.

### Instructions to Integrate Into Themes

Just like with Featured Images themes will need to call a Featured Gallery in any template file where the Featured Gallery should appear. I've tried to make this as intuitive as possible.

Just like WordPress comes with `get_post_thumbnail_id()` built-in, you can use `get_post_gallery_ids()` to call the Featured Gallery. As long as it is used inside the loop, it doesn't need to be passed any parameters. In that case, by default, it will return a PHP array with the ID's of all images in the post's Featured Gallery. However, you can also customize the returned value to suit your needs, with up to three parameters.

    get_post_gallery_ids( $postID, $maxImages, $returnType );

**Parameters:**

* $postID:
 * Type: Integer
 * Description: The ID of the post/page that you are loading.
 * Default Value: null (which becomes the post ID of the current Post, if the function is called from inside the Loop)
 * Possible Values: Any valid post ID, or null.

* $maxImages:
 * Type: Integer
 * Description: The max number of images to return. If set to -1, all images will be returned.
 * Default Value: -1
 * Possible Values: Any integer from -1 up through infinity.

* $returnType:
 * Type: String
 * Description: The format of the returned image IDs.
 * Default Value: 'array'
 * Valid Values: 'array', 'string'
  * 'array' will cause the function to return the image IDs as a PHP array.
  * 'string' will cause the function to return the image IDs as a comma delimited string.


### Examples

**Example 1:** Set inside the Loop. This returns all images in the Featured Gallery, as an array, then loops through to display each using an HTML `<img>` tag.

    $galleryArray = get_post_gallery_ids();

    foreach ( $galleryArray as $id ) {

        echo '<img src="' . wp_get_attachment_url( $id ) .'">';

    }

**Example 2:** Set inside the Loop. This behaves exactly the same as Example 1, it just has all parameters specifically set to their defaults, to demonstrate what is happening.

    $galleryArray = get_post_gallery_ids( null, -1, 'array' );

    foreach ( $galleryArray as $id ) {

        echo '<img src="' . wp_get_attachment_url( $id ) .'">';

    }

**Example 3:** Set inside the Loop. This returns the first two images in the Featured Gallery, as an array, then loops through to display each using an HTML `<img>` tag.

    $galleryArray = get_post_gallery_ids( null, 2 );

    foreach ( $galleryArray as $id ) {

        echo '<img src="' . wp_get_attachment_url( $id ) .'">';

    }

**Example 4:** Set outside the Loop. This uses a specified post ID (431) and returns all images in that post's Featured Gallery, as an array, then loops through to display each using an HTML `<img>` tag.

    $galleryArray = get_post_gallery_ids( 431 );

    foreach ( $galleryArray as $id ) {

        echo '<img src="' . wp_get_attachment_url( $id ) .'">';

    }

**Example 5:** Set inside the Loop. This returns all images in the Featured Gallery, as an string, then echos that string to the page. I personally don't see how returning the IDs as a string is useful, but it was requested as a feature a long time ago.

    $galleryString = get_post_gallery_ids( null, -1, 'string' );

    echo $galleryString; // THIS WOULD ECHO SOMETHING LIKE: 34,6422,4364

### Adding Featured Galleries to a Custom Post Type

I've included a hook to allow you to easily integrate featured galleries into a custom post type. In your theme `functions.php` file, simply add something along these lines:
   
    function add_featured_galleries_to_ctp( $post_types ) {

        array_push($post_types, 'custom_post_type'); // ($post_types comes in as array('post','page'). If you don't want FGs on those, you can just return a custom array instead of adding to it. )

        return $post_types;

    }

    add_filter('fg_post_types', 'add_featured_galleries_to_ctp' );

That would add Featured Galleries to the custom post type with the slug of 'custom_post_type'. To add it to a custom post type with a slug of 'books', you'd do this:

    function add_featured_galleries_to_ctp( $post_types ) {
        array_push($post_types, 'books'); // ($post_types comes in as array('post','page'). If you don't want FGs on those, you can just return a custom array instead of adding to it. )
        return $post_types;
    }
    add_filter('fg_post_types', 'add_featured_galleries_to_ctp' );

### Show the Sidebar In Media Manager

By default, the sidebar is hidden in the media manager/uploader popup. However, if you'd like it to be shown, there is an easy filter that you can add to your functions.php file. Example:

    function show_fg_sidebar( $show_sidebar ) {
        return true; // ($show_sidebar comes in a false)
    } add_filter( 'fg_show_sidebar', 'show_fg_sidebar' );

### Want to Help?

I'd love some help with internationalization. It was working at one point, but drivingralle did that code because I don't really understand it, and I'm not sure it's still working.

## Installation

There are two ways to install this plugin.

Manual:

1. Upload the `featured-galleries` folder to the `/wp-content/plugins/` directory
2. Go to the 'Plugins' menu in WordPress, find 'Featured Galleries' in the list, and select 'Activate'.

Through the WP Repository:

1. Go to the 'Plugins' menu in WordPress, click on the 'Add New' button.
2. Search for 'Featured Galleries'. Click 'Install Now'.
3. Return to the 'Plugins' menu in WordPress, find 'Featured Galleries' in the list, and select 'Activate'.

## Frequently Asked Questions

### What is the point of this?

I was tasked to update a Featured Projects page for a client website. Projects were a custom post type, and the page displaying them used a special WP_Query. Each Project had a featured image. The client wanted each to have several images that could be clicked through with arrows. I couldn't find an easy way to accomplish this, so I built it from scratch. A friend suggested I abstract it into a plugin to share.

### Will it be improved?

Yes. The next step on my roadmap is to figure out how to do a one time re-keying of all data to start with an underscore, so that it's invisible.

### Can I add a featured gallery to my custom post type?

Why yes you can! You don't even have to edit the plugin to do so. There are details on how to do this in the Instructions.

## Screenshots

1. Initial metabox, no images in the gallery.
2. Metabox with images selected and added.

## Changelog

### 2.0.0

* Under the Hood: Complete rewrite top to bottom of all PHP and Javascript.
* Enhancement: Improved admin preview styles to show more thumbnails in less space.
* Enhancement: Added documentation for public API function into Readme.
* Enhancement: Improved Readme examples.
* Enhancement: Added No-JS fallback.
* Enhancement: Add compatibility with the picu plugin.
* Bugfix: Primary buttons in Media Manager now have proper labels again.
* Change: Bumped WordPress Version Requirement to 3.8.
* Change: Bumped PHP Version Requirement to 5.4.

### 1.7.1

* Added missing stylesheet to hide sidebar.

### 1.7.0

* Added filter to allow themes to show the sidebar in the media manager instance created by Featured Galleries (Sidebar is hidden by default).

### 1.6.0

* Improved CSS styling of the backend gallery inside the metabox. Metabox is now more responsive, per request.

### 1.5.0

* Accidentally put the version of 1.4.5 when I meant to use 1.4.4, but in change log used correct version. This bump to 1.5 restores consistency.

### 1.4.4

* Tested with WP 4.4 and bumped up compatibility.

### 1.4.3

* Bugfix: If `get_post_gallery_ids()` was called on post with empty Featured Gallery, using an array return (the default), an array containing one string (a comma) was returned instead of an empty array.

### 1.4.2

* Bugfix: Undefined variable `$oldfix` when running post-MP6 versions of WordPress (3.9 and over). Props Joshuadnelson.
* WordPress 4.2 compatibility bump.

### 1.4.1

* Updating readme to add example code for custom post types.

### 1.4.0

* WordPress 4.1 compatibility bump.
* Bugfix: Margin difference between buttons on left and right in media model.
* Bugfix: Button type and text change didn't fire when Media model defaults to upload instead of to media library.

### 1.3.1

* Fixed issue where the scripts required to open the Media Manager might notbe enqueued.

### 1.3.0

* Added internationalization and German translation. Props to Drivingralle.
* Formatting fixes to better match WordPress PHP best practices. Props Drivingralle.

### 1.2.4

* Fixes a typo in the readme.txt file.

### 1.2.3 =

* As reported in suppor thread, error messages were being thrown in WP DEBUG mode, when trying to save things unrelated to plugin. Fixes those errors.

### 1.2.2 =

* More bug fixes for 3.9 and 3.5 - 3.7, to bring everything into line visually in all versions that use the media manager.

### 1.2.1 =

* Bugfix, CSS background positioning missing on delete images icons in WP 3.5 - 3.7.

### 1.2.0

* Added compatibility for WordPress 3.9 (Had to rearrange the javascript slightly).
* Improved compatibility for WordPress 3.5 - 3.7 by using built in icon images instead of Dashicons in those versions.

### 1.1.6

* Fixed inconsistent Markup.

### 1.1.5

* Overhauled readme.txt to include implementation instructions and examples.

### 1.1.4

* Slight bug was introduced in 1.1.3, **get_post_gallery_ids()** won't work.

### 1.1.3

* Added a new argument to **get_post_gallery_ids()**, allowing it to return only the first image in the gallery.

### 1.1.2

* Minor bug fix update. If used opened, closed, and then reopened the gallery selector, the back button would appear incorrectly. Skipping 1.1.1 because that is a silly version number.

### 1.1.0

* Completely screwed up commits for 1.0.0 and 1.0.1, and copied the entire folder instead of trunk. Fixed now.

### 1.0.1

* Minor update, fixed a CSS bug where buttons were incorrectly small on mobile (< 783px) screens.

### 1.0.0
* First public version. Added support for WP's Preview Changes functionality. Accomplished this be using two pieces of metadata.

### 0.9.0
* Initial test version sent to WP for submission.