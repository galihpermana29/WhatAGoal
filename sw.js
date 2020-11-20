importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
let staticCache = 'static-v5';
let dynamicCache = 'dynamic-v5';
let assets = [
	'/',
	'/index.html',
	'/pages/about.html',
	'/pages/fallback.html',
	'/pages/list.html',
	'/pages/pl.html',
	'/js/db.js',
	'/js/getdata.js',
	'/js/idb.js',
	'/js/materialize.min.js',
	'/js/registersw.js',
	'/js/setup.js',
	'/js/api.js',
	'/css/about.css',
	'/css/list.css',
	'/css/materialize.min.css',
	'/css/pl.css',
	'/css/ucl.css',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap',
];

self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(staticCache).then((cache) => {
			console.log('caching');
			return cache.addAll(assets);
		})
	);
	console.log('instalasi berhasil');
});

self.addEventListener('activate', (e) => {
	console.log('activate');
	clients.claim();
	e.waitUntil(
		caches.keys().then((key) => {
			key.filter(
				(key) => key !== staticCache && key !== dynamicCache
			).map((key) => caches.delete(key));
		})
	);
});

self.addEventListener('fetch', (e) => {
	console.log('fetching');
	let baseurl = 'https://api.football-data.org/v2/competitions/2021/standings';
	
	if(e.request.url.match(/^(http|https)/i)){
		e.respondWith(
			caches.match(e.request).then((cacheRes) => {
				return (
					cacheRes ||
					fetch(e.request).then((fetchRes) => {
						return caches.open(dynamicCache).then((cache) => {
							cache.put(e.request, fetchRes.clone());
							return fetchRes;
						});
					})
				);
			}).catch((err) => caches.match('/pages/fallback.html'))
		);
	}
});

self.addEventListener('push', function (event) {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	let options = {
		body: body,
		icon: '/img/72.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
});
