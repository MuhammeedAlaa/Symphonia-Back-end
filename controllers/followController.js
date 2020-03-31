catchAsync = require('../utils/catchAsync').threeArg;
const { User } = require('../models/userModel');
const Playlist = require('../models/playlistModel');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.FollowUser = catchAsync(async (req, res, next) => {
  if (!req.query.ids) {
    return next(new AppError('ids field is missing', 400)); // bad request
  }
  const ids = req.query.ids.split(',');

  let currUser = req.user;
  for (let index = 0; index < ids.length; index++) {
    const element = ids[index];
    await User.findByIdAndUpdate(currUser._id, {
      $push: {
        followdUsers: element
      }
    });
  }
  res.status(204).json();
});

exports.checkIfUserFollower = catchAsync(async (req, res, next) => {
  if (!req.query.ids) {
    return next(new AppError('ids field is missing', 400)); // bad request
  }
  let userIds = req.query.ids.split(',');
  // loop on all the the ids of the req.user
  // find if userIds includes one of them
  user = req.user;
  let isFollowingArr = [];
  console.log(user.followedUsers);
  userIds.map((value, index, arr) => {
    if (user.followedUsers.includes(value)) {
      isFollowingArr.push(true);
    } else {
      isFollowingArr.push(false);
    }
  });
  res.status(200).json(isFollowingArr);
});

exports.checkIfPlaylistFollower = catchAsync(async (req, res, next) => {
  if (!req.query.ids) {
    return next(new AppError('ids field is missing', 400)); // bad request
  }
  let userIds = req.query.ids.split(',');
  let playlistId = req.params.id;
  // we have to make
  let resArray = [];
  // get the playlist Object
  let playlist = await Playlist.findById(playlistId);

  for (let index = 0; index < userIds.length; index++) {
    const currUser = userIds[index];
    if (playlist.followers.includes(currUser)) {
      resArray.push(true);
    } else {
      resArray.push(false);
    }
  }

  res.status(200).send({
    resArray
  });
});

exports.followPlaylist = catchAsync(async (req, res, next) => {
  const playlistId = req.params.id;
  const userId = req.user._id;
  // now make the user follow the playlist and add the User to the followers of the playlist

  let oldPlaylist = await Playlist.findOne({ _id: playlistId });
  if (oldPlaylist.followers.includes(userId)) {
    return next(new AppError('already following the playlist'), 403);
  }
  newPlayist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        followers: userId
      }
    },
    { new: true }
  );
  res.status(200).json();
});

// TODO: handle the next href and the
// TODO: the query must have the type parameter specified and type = artist (i didn't include it)
exports.getUserFollowedArtists = catchAsync(async (req, res, next) => {
  // filteration stage
  let limit = 20;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  // TODO suppport pagination with limit
  /*
  let user = await User.findOne({ _id: req.user._id }).populate({
    path: 'followedUsers',
    match: { role: 'artist' },
    options: {
      limit: limit
    }
  });
*/
  let user = await User.findOne({ _id: req.user._id }).populate({
    path: 'followedUsers',
    match: { role: 'artist' }
  });

  let followedUsers = user.followedUsers;
  let afterIndex = 0;
  let originalTotal = user.followedUsers.length;

  /// do the after filterationfollowedUsers =
  if (req.query.after) {
    id_after = req.query.after;
    for (let index = 0; index < followedUsers.length; index++) {
      const element = followedUsers[index];
      console.log(element._id);
      if (element._id == id_after) {
        afterIndex = index;
        break;
      }
    }
  }

  console.log('____________element___________');
  console.log(typeof limit);
  // get the after after id
  let afterId = null;
  let myNext = null;
  let LOCAL_HOST = `${req.protocol}://${req.get('host')}/`;
  // let's do the limit filtering by slicing the array
  end = afterIndex + limit;
  if (end > originalTotal) {
    end = originalTotal;
  } else {
    if (followedUsers[end]) {
      afterId = followedUsers[end]._id;
      myNext = LOCAL_HOST + 'api/v1/me/following?limit=1&after=' + afterId;
    }
  }
  if (afterIndex == -1) afterIndex = 0;
  followedUsers = followedUsers.slice(afterIndex, end);
  res.status(200).json({
    artists: {
      items: followedUsers
    },
    limit,
    total: followedUsers.length,
    next: myNext,
    cursors: {
      after: afterId
    }
  });
});
// removes the users with ids from current user
exports.unfollowUser = catchAsync(async (req, res, next) => {
  if (!req.query.ids) {
    return next(new AppError('ids field is missing', 400)); // bad request
  }
  const ids = req.query.ids.split(',');
  let currUser = req.user;

  user = await User.findById(req.user._id);
  console.log(user);
  // for the current user delet all the followeUsers with ids = ids
  console.log(ids);
  user.followdUsers = user.followdUsers.filter((value, index, array) => {
    console.log(value + typeof value);
    return ids.includes(value); // those not in ids
  });

  await user.save({ validateBeforeSave: false }); // important to disavle validation before save
  res.status(204).json();
});

exports.unfollowPlaylist = catchAsync(async (req, res, next) => {
  let userId = req.user.id;
  let playlistId = req.params.id;
  // remove the user from the playlist
  let playlist = await Playlist.findById(playlistId);
  playlist.followers = playlist.followers.filter(function(value, index, arr) {
    return value != userId;
  });
  await playlist.save();
  res.status(200).json();
});