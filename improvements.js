function sanitizeUrl(url) {
	try {
		let parsedUrl = new URL(url);
		let sanitizedUrl = parsedUrl.protocol + '//' + parsedUrl.hostname;
		if (parsedUrl.port) {
			sanitizedUrl += ':' + parsedUrl.port;
		}
		sanitizedUrl += parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
		return sanitizedUrl;
	} catch (e) {
		console.error('Invalid URL: ', e);
		return '';
	}
}

// ... [rest of your existing code] ...

// Example of using sanitizeUrl in your existing functions
MP.init = function () {
	// ... [existing code] ...
	MP.SrcUrl = encodeURI(sanitizeUrl(window.top.document.location.href));
	// ... [rest of the function] ...
};

MP.switchLanguage = function (url, pref, sync) {
	// ... [existing code] ...
	url = sanitizeUrl(url); // Sanitize the URL
	// ... [rest of the function] ...
	script.src = protocol + url + '/' + MP.SrcLang + lang + '/?1023749632;' + encodeURIComponent(sanitizeUrl(MP.SrcUrl));
	// ... [rest of the function] ...
};

// ... [any other place where URLs are being used] ...

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
			MP.SrcUrl = encodeURI(sanitizeUrl(window.top.document.location.href));
			MP.oSite = MP.tSite = window.top.document.location.host;
			MP.UrlLang = MP.SrcLang;
		}
	},
	switchLanguage: function (url, pref, sync) {
		if (!isValidLanguagePref(pref)) {
			console.error('Invalid language preference: ', pref);
			return false;
		}

		var sync = sync;
		var oSite = sanitizeUrl(MP.oSite);
		var tSite = sanitizeUrl(MP.tSite);
		MP.SrcUrl = sanitizeUrl(MP.SrcUrl);
		url = sanitizeUrl(url);

		// ... rest of the existing switchLanguage function ...
	},
	switchToLang: function (url) {
		// Ensure URL is sanitized before use
		url = sanitizeUrl(url);
		if (window.top.location.href === url) {
			if (typeof MpStorage !== 'undefined' && typeof MpStorage.updatePref !== 'undefined') {
				MpStorage.updatePref(MP.oSite, MP.SrcLang);
			}
		} else {
			window.top.location.href = url;
		}
	},
};

function isValidLanguagePref(pref) {
	const allowedPrefs = ['en', 'fr', 'de', 'es']; // Extend this list as needed
	return allowedPrefs.includes(pref);
}

function sanitizeUrlComponent(component, type) {
	switch (type) {
		case 'path':
			return component.replace(/[^a-zA-Z0-9-._~\/]/g, '');
		case 'query':
			return component.replace(/[^a-zA-Z0-9-._~=&]/g, '');
		default:
			return component;
	}
}

function sanitizeUrl(url) {
	try {
		let parsedUrl = new URL(url);
		let sanitizedUrl = parsedUrl.protocol + '//' + parsedUrl.hostname;
		if (parsedUrl.port) {
			sanitizedUrl += ':' + parsedUrl.port;
		}
		sanitizedUrl +=
			sanitizeUrlComponent(parsedUrl.pathname, 'path') +
			sanitizeUrlComponent(parsedUrl.search, 'query') +
			parsedUrl.hash; // Assuming hash does not require sanitization
		return sanitizedUrl;
	} catch (e) {
		console.error('Invalid URL: ', e);
		return '';
	}
}

function validateUrl(url) {
	try {
		let parsedUrl = new URL(url);

		// Check for safe protocols
		const safeProtocols = ['http:', 'https:'];
		if (!safeProtocols.includes(parsedUrl.protocol)) {
			console.error('Invalid URL detected');
			return '';
		}

		// Check for potentially harmful content in various parts of the URL
		const potentiallyHarmfulPatterns = /<script>|javascript:|data:|vbscript:|livescript:|mhtml:|xss:|about:/gi;
		if (
			potentiallyHarmfulPatterns.test(parsedUrl.href) ||
			potentiallyHarmfulPatterns.test(parsedUrl.pathname) ||
			potentiallyHarmfulPatterns.test(parsedUrl.search) ||
			potentiallyHarmfulPatterns.test(parsedUrl.hash)
		) {
			console.error('Invalid URL detected');
			return '';
		}

		return true;
	} catch (e) {
		console.error(e);
		return '';
	}
}
