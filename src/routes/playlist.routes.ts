import { Router } from "express";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addProblemToPlaylistSchema,
  createPlaylistSchema,
  deletePlaylistSchema,
  getPlaylistDetailsSchema,
  removeProblemFromPlaylistSchema,
} from "../validations/playlist.validation.js";

const playlistRoutes = Router();

playlistRoutes.post(
  "/create-playlist",
  requireAuth,
  validate(createPlaylistSchema),
  createPlaylist,
);

playlistRoutes.get("/get-all-playlists", requireAuth, getAllPlaylistDetails);

playlistRoutes.get(
  "/get-playlist/:playlistId",
  requireAuth,
  validate(getPlaylistDetailsSchema),
  getPlaylistDetails,
);

playlistRoutes.post(
  "/:playlistId/add-problem",
  requireAuth,
  validate(addProblemToPlaylistSchema),
  addProblemToPlaylist,
);

playlistRoutes.delete(
  "/delete-playlist/:playlistId",
  requireAuth,
  validate(deletePlaylistSchema),
  deletePlaylist,
);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  requireAuth,
  validate(removeProblemFromPlaylistSchema),
  removeProblemFromPlaylist,
);

export default playlistRoutes;
