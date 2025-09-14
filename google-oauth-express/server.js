require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	})
);

// Passport configuration
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
			callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			// In a real app, you would look up or create the user in your database here.
			return done(null, { id: profile.id, displayName: profile.displayName, photos: profile.photos });
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Simple home page
app.get('/', (req, res) => {
	const isLoggedIn = Boolean(req.user);
	const userHtml = isLoggedIn
		? `<p>Signed in as <strong>${req.user.displayName}</strong></p><img alt="avatar" src="${req.user.photos?.[0]?.value || ''}" width="48" height="48"/><p><a href="/logout">Logout</a></p>`
		: '<a href="/auth/google">Sign in with Google</a>';
	res.send(`
		<html>
			<head><title>Google OAuth Demo</title></head>
			<body>
				<h1>Google Sign-In</h1>
				${userHtml}
			</body>
		</html>
	`);
});

// Auth routes
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		prompt: 'select_account',
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login-failed' }),
	(req, res) => {
		res.redirect('/');
	}
);

app.get('/login-failed', (req, res) => {
	res.status(401).send('Login failed. <a href="/">Try again</a>');
});

app.get('/logout', (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect('/');
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

