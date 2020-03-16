const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const meController = require('../controllers/meController');

// const authController = require('../controllers/authController');
const followController = require('../controllers/followController');
const libraryController = require('../controllers/libraryController');

const router = express.Router();

router.get(
  '/player/tracks/:artist_id/:track_id',
  authController.protect,
  meController.playTrack
);

// thsi just for testing the player
router.get('/gamed', function(req, res) {
  res.sendFile(path.join(`${__dirname}/../views/index.html`));
});

// section: follow routes
// Description: check if the current user follows a another user(partist or normal user)
router.get('/following/contains', followController.checkIfUserFollower);

// Description: follow an artist or user
router.put('/following', followController.FollowUser);

// Description: get a user's followed artists
router.get('/following', followController.getUserFollowedArtists);

//Description: unfollow artist or users
router.delete('/following', followController.unfollowUser);

//section: library routes

// Description: Check if one or more albums is already saved in the current Spotify user’s ‘Your Music’ library.
router.get('/albums/contains', libraryController.checkUserSavedAlbums);

//Description: Check if one or more tracks is already saved in the current Spotify user’s ‘Your Music’ library.
router.get('/tracks/contains', libraryController.checkUserSavedTracks);

//Description: Get a list of the albums saved in the current Spotify user’s ‘Your Music’ library.
router.get('/albums', libraryController.getCurrentUserSavedAlbums);

//Description: Get a list of the songs saved in the current Spotify user’s ‘Your Music’ library.
router.get('/tracks', libraryController.getCurrentUserSavedTracks);

//Description:Remove one or more albums from the current user’s ‘Your Music’ library.
router.delete('/albums', libraryController.getCurrentUserSavedTracks);

//Description:Remove one or more tracks from the current user’s ‘Your Music’ library.
router.delete('/tracks', libraryController.removeCurrentUserSavedTracks);

//Description: Save one or more albums to the current user’s ‘Your Music’ library.
router.put('/albums', libraryController.saveCurrentUserAlbums);
//Description:Save one or more tracks to the current user’s ‘Your Music’ library.
router.put('/tracks', libraryController.saveCurrentUserTracks);

module.exports = router;