(function () {
	var MP = {
		Version: '3.2.2.0-SPA',
		SrcLang: 'en',
		Protocols: {
			'http:': 'http://',
			'https:': 'https://',
		},
		UrlLang: 'mp_js_current_lang',
		SrcUrl: decodeURIComponent('mp_js_orgin_url'),
		oSite: decodeURIComponent('mp_js_origin_baseUrl'),
		tSite: decodeURIComponent('mp_js_translated_baseUrl'),
		init: function () {
			if (MP.oSite.indexOf('p_js_') == 1) {
				MP.SrcUrl = encodeURI(validateUrl(window.top.document.location.href));
				MP.oSite = MP.tSite = window.top.document.location.host;
				MP.UrlLang = MP.SrcLang;
			}
		},
		switchLanguage: function (url, pref, sync) {
			var sync = sync;
			var oSite = MP.oSite.replace('http://', '').replace('https://', '').replace(/\/?$/, '');
			var tSite = MP.tSite.replace('http://', '').replace('https://', '').replace(/\/?$/, '');
			MP.SrcUrl =
				MP.SrcUrl.replace(/(https?:\/\/[^/]+)\/.*$/, '$1') +
				validateUrl(window.top.document.location.href).replace(window.top.document.location.origin, '');
			url = url.replace('http://', '').replace('https://', '').replace(/\/?$/, '');
			if (sync && typeof MpStorage !== 'undefined' && typeof MpStorage.updatePref !== 'undefined') {
				MpStorage.updatePref(url, pref);
			}
			lang = pref.substring(0, 2);
			setTimeout(function () {
				var script = document.createElement('SCRIPT');
				var protocol = MP.Protocols[location.protocol];
				if (url == oSite) {
					tSite = tSite.split(/[/?#]/)[0];
					var validatedHref = validateUrl(window.top.document.location.href);
					if (validatedHref.valid) {
						script.src =
							protocol +
							encodeURIComponent(tSite) +
							'/' +
							encodeURIComponent(MP.SrcLang) +
							encodeURIComponent(MP.UrlLang) +
							'/?1023749634;' +
							encodeURIComponent(validatedHref.sanitizedUrl);
					} else {
						console.error('Invalid href:', validatedHref.reason);
						// Handle the invalid href case appropriately
					}
				} else {
					if (MP.SrcLang == lang && tSite == oSite) {
						return false;
					}
					url = url.split(/[/?#]/)[0];
					script.src =
						protocol + url + '/' + MP.SrcLang + lang + '/?1023749632;' + encodeURIComponent(validateUrl(MP.SrcUrl));
				}
				var target = document.getElementsByTagName('script')[0];
				target.parentNode.insertBefore(script, target);
			}, 500);
			return false;
		},
		switchToLang: function (url) {
			if (window.top.location.href == url) {
				if (typeof MpStorage !== 'undefined' && typeof MpStorage.updatePref !== 'undefined') {
					MpStorage.updatePref(MP.oSite, MP.SrcLang);
				}
			} else {
				window.top.location.href = validateUrl(url);
			}
		},
	};

	function validateUrl(url) {
		try {
			let parsedUrl = new URL(url);

			// Check for safe protocols
			const safeProtocols = ['http:', 'https:'];
			if (!safeProtocols.includes(parsedUrl.protocol)) {
				return { valid: false, reason: 'Unsafe protocol' };
			}

			// Detailed pattern checks
			const potentiallyHarmfulPatterns = /<script>|javascript:|data:|vbscript:|livescript:|mhtml:|xss:|about:/gi;
			if (potentiallyHarmfulPatterns.test(parsedUrl.href)) {
				return { valid: false, reason: 'Potentially harmful patterns detected' };
			}

			// URL passes all checks
			return { valid: true, sanitizedUrl: parsedUrl.toString() };
		} catch (e) {
			return { valid: false, reason: 'Invalid URL format' };
		}
	}

	window.MP = MP;
})();
