# Featured Galleries

![Banner](https://ps.w.org/featured-galleries/assets/banner-1544x500.png)

**Hello Theme Developers!**

Have you ever added a Featured Image to a post and thought to yourself, 'I wish I could add more than one image this way'? Well, now you can. "Featured Galleries" mirrors the Featured Images functionality of WordPress. The only difference is that posts get an entire gallery rather than just a single image. These galleries behave almost exactly like Featured Images, and make use of  WordPress's built in Media Manager. Users can select images, define the order, and save the gallery, all through a simple drag-n-drop interface.

**Note**: This is not a plugin which will add galleries to your website. This is for theme developers. It handles the backend interface for creating featured galleries, and storing them. You will still need to build a gallery on your page templates.

### Documentation

Please see the [Wiki](https://github.com/Kelderic/featured-galleries/wiki) for documentation, instructions, and examples.

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
