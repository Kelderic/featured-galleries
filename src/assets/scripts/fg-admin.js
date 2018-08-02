(function(window) {

	FeaturedGalleryManager = (function( params ) {

		// STORE ORIGINAL BUTTON VALUES

		var l10nOriginal = {};

		/***************************************/
		/************* INITIALIZE **************/
		/***************************************/

		var Class = function( params ) {

			// STORE this AS self, SO THAT IT IS ACCESSIBLE IN SUB-FUNCTIONS AND TIMEOUTS.

			var self = this;

			// SETUP VARIABLES FROM USER-DEFINED PARAMETERS

			self.frame = null;
			self.el = {
				buttonSelect: document.querySelector('#fg_select'),
				buttonRemove: document.querySelector('#fg_removeall'),
				modal: null,
				HTMLPreview: document.querySelector('#fg-post-gallery'),
				permMetadata: document.querySelector('#fg_perm_metadata'),
				permNoncedata: document.querySelector('#fg_perm_noncedata'),
				tempNoncedata: document.querySelector('#fg_temp_noncedata')
			};

			// STORE ORIGINAL BUTTON VALUES

			l10nOriginal = wp.media.view.l10n;

			// IF EITHER BUTTON DOESN'T EXIST, EXIT GRACEFULLY

			if ( ( self.el.buttonSelect == null ) || ( self.el.buttonRemove == null ) ) {
				return false;
			}

			// STORE THE POST ID FOR LATER

			self.postID = self.el.permMetadata.dataset.post_id;

			// CREATE THE MEDIA FRAME

			self.frame = wp.media.frames.fg_frame = wp.media({
				state: 'featured-gallery',
				frame: 'post',
				library : {
					type : 'image'
				}
			});

			// SPECIFY THE CUSTOM VIEW. THIS IN THEORY WOULD HAPPEN BEFORE
			// THE CREATING OF THE FRAME, BUT IT DOESN'T.

			self.frame.states.add([
				new wp.media.controller.Library({
					id:         'featured-gallery',
					title:      'Select Images for Gallery',
					priority:   20,
					toolbar:    'main-gallery',
					filterable: 'uploaded',
					library:    wp.media.query( self.frame.options.library ),
					multiple:   true,
					editable:   false,
					displaySettings: false,
					displayUserSettings: false
				}),
			]);

			// STORE A REFERENCE TO THE WRAPPING HTML ELEMENT

			self.el.modal = self.frame.el;

			// SPECIFY ACTION FOR THE 'ready' ACTION

			self.frame.on('ready', function() {

				self.el.modal.classList.add('fg-media-frame');

				if ( fgInfoFromPHP.showDetailSidebar !== '1' && fgInfoFromPHP.showDetailSidebar !== true ) {
					self.el.modal.classList.add('no-details-sidebar');
				}

				fix_back_button();

			});

			// SPECIFY ACTION FOR THE 'open' ACTION

			self.frame.on('open', function() {

				if ( self.el.permMetadata.value != '' ) {

					var selection = self.frame.state().get('selection');
					var imageIDs = self.el.permMetadata.value.split(',');
					var editState = self.frame.state('gallery-edit');
					var attachment;

					// UPDATE SELECTION

					imageIDs.forEach(function(imageID) {
						attachment = wp.media.attachment(imageID);
						attachment.fetch();
						selection.add( attachment );
					});

					self.frame.state('gallery-edit').set( 'library', selection );
					self.frame.setState('gallery-edit');

					self.frame.modal.focusManager.focus();

				}

			});

			// SPECIFY ACTION FOR THE 'close' ACTION

			self.frame.on('close', function() {

				// RESET THE MAIN BUTTON TEXT

				wp.media.view.l10n = l10nOriginal;

			});

			// SPECIFY ACTION FOR THE 'update' ACTION. THIS HAPPENS WHEN
			// AN IMAGE IS SELECTED

			self.frame.on('update', function() {

				var imageIDs = [];
				var imageHTML = '';
				var id, url;

				// LOOP THROUGH SELECTION

				self.frame.state().get('library').each(function(selectedImage) {

					// ADD IMAGE ID TO ARRAY

					imageIDs.push(selectedImage.attributes.id);

					// BUILD PREVIEW HTML AND ADD TO STRING

					url = 'thumbnail' in selectedImage.attributes.sizes ? selectedImage.attributes.sizes.thumbnail.url :  selectedImage.attributes.url;
					id = selectedImage.attributes.id;

					imageHTML += '<li><button type="button"></button><img id="' + id + '" src="' + url + '"></li>'
				});

				// IF WE HAVE ANY IMAGES, UPDATE THE METABOX AND TEMP METADATA

				if ( imageIDs.length ) {

					update_metabox({
						HTMLPreview: imageHTML,
						permMetadata: imageIDs.join(',')
					}, self.el);

					update_temp_metadata( self.el, self.postID );

				}

			});

			self.frame.on('content:render', function() {

				fix_back_button();

			});

			// ADD EVENT LISTENER TO TRIGGER MEDIA MODEL WHEN USER CLICKS THE SELECT BUTTON

			self.el.buttonSelect.addEventListener('click', function(event){

				// CUSTOMIZE THE MAIN BUTTON TEXT

				wp.media.view.l10n.createNewGallery = 'Arrange Images';
				wp.media.view.l10n.updateGallery = 'Set Featured Gallery';
				wp.media.view.l10n.insertGallery = 'Set Featured Gallery';

				// OPEN THE MODAL

				self.frame.open();

			});

			self.el.buttonRemove.addEventListener('click', function(event){

				update_metabox({
					HTMLPreview: '',
					permMetadata: ''
				}, self.el);

				update_temp_metadata( self.el, self.postID );

			});

			self.el.HTMLPreview.addEventListener('click', function(event){

				if ( event.target.tagName.toLowerCase() == 'button' ) {

					if (confirm('Are you sure you want to remove this image?')) {

						// GET THE ID OF THE IMAGE THE USER WISHES TO REMOVE FROM GALLERY

						var imageIDBeingRemoved = event.target.nextElementSibling.id;

						// GET THE COMMA DELIMITED LIST OF IMAGE IDS IN THE GALLERY, THEN
						// REMOVE THE SELECTED ID

						var imageIDs = self.el.permMetadata.value;
							imageIDs = imageIDs.replace( ',' + imageIDBeingRemoved, '' ).replace( imageIDBeingRemoved + ',', '' ).replace( imageIDBeingRemoved, '' );

						// UPDATE THE METADATA VALUE WITH THE NEW LIST OF IMAGE IDS

						self.el.permMetadata.value = imageIDs;

						// REMOVE THE HTML PREVIEW

						event.target.parentNode.parentNode.removeChild(event.target.parentNode);

						// UPDATE THE CONTROLS

						if ( self.el.permMetadata.value === '' ) {

							update_metabox({
								permMetadata: ''
							}, self.el);							

						}

						update_temp_metadata( self.el, self.postID );

					}

				}

			});

		}

		function update_metabox( args, els ) {

			var HTMLPreview = null, permMetadata = null;

			if ( 'HTMLPreview' in args ) {
				HTMLPreview = args.HTMLPreview;
				els.HTMLPreview.innerHTML = args.HTMLPreview;
			}

			if ( 'permMetadata' in args ) {
				permMetadata = args.permMetadata;
				els.permMetadata.value = args.permMetadata;
			}

			if ( ( args.HTMLPreview === '' ) || ( args.permMetadata === '' ) ) {
				els.buttonRemove.style.display = 'none';
				els.buttonSelect.textContent = 'Select Images';
			} else {
				els.buttonRemove.style.display = '';
				els.buttonSelect.textContent = 'Edit Selection';
			}

		}

		function update_temp_metadata( els, postID ) {

			setTimeout(function(){

				ajax({
					method: 'post',
					queryURL: fgInfoFromPHP.wpAdminAjaxURL,
					data: {
						action: 'fg_save_temp_metadata', 
						fg_post_id: postID, 
						fg_temp_noncedata: els.tempNoncedata.value,
						fg_temp_metadata: els.permMetadata.value
					},
					success: function(serverResponse){
						serverResponse = JSON.parse(serverResponse);
						if ( ! serverResponse.success ) {
							console.log(serverResponse.response);
							alert('There was an issue with updating the live preview. Make sure that you click Save to ensure your changes aren\'t lost.');
						}
					},
					error: function(data) {
						alert('There was an issue with updating the live preview. Make sure that you click Save to ensure your changes aren\'t lost.');
					}
				});

			}, 0 );

		}

		function fix_back_button() {

			var backButton = document.querySelector('.media-menu a:first-child');

			if ( backButton ) {

				backButton.textContent = '← Edit Selection';
				backButton.className = 'media-menu-item button button-large';

			}

		}

		function ajax( params ) {

			var method = 'method' in params ? params['method'] : 'get';
			var queryURL = 'queryURL' in params ? params['queryURL'] : '';
			var data = 'data' in params ? params['data'] : '';
			var datastring = '';
			var successCallback = 'success' in params ? params['success'] : function(params){console.log('Successfully completed AJAX request.')};
			var errorCallback = 'error' in params ? params['error'] : function(params){console.log('Error during AJAX request.');};
			var ajaxRequest = new XMLHttpRequest();

			switch ( typeof data ) {
				case 'string':
					datastring = data;
					break;
				case 'object':
					for ( key in data ) {
						datastring += key + '=' + data[key] + '&';
					}
					datastring = datastring.slice(0, -1);
					break;
			}

			ajaxRequest.onreadystatechange = function () {
				if ( ajaxRequest.readyState === 4 ) {
					if ( ajaxRequest.status === 200 ) {
						successCallback(ajaxRequest.responseText, ajaxRequest.status);
					} else {
						errorCallback(ajaxRequest.responseText, ajaxRequest.status);
					}
				}
			};

			if ( method.toLowerCase() == 'post' ) {

				ajaxRequest.open(method, queryURL, true);

				ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				ajaxRequest.send( datastring );

			} else {

				ajaxRequest.open(method, queryURL + ( datastring == '' ? '' : '?' + datastring ), true);

				ajaxRequest.send( null );

			}

		}

		return Class;

	}());

	document.addEventListener("DOMContentLoaded", function(event) {

		// INITIALIZE MANAGER WHEN DOM IS FULLY LOADED, AND ADD IT
		// TO WINDOW FOR DEBUGGING

		window.featuredGalleryManager = new FeaturedGalleryManager();

	});

}(window));