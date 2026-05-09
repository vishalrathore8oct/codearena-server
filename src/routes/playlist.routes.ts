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

const playlistRoutes = Router();

playlistRoutes.post("/create-playlist", requireAuth, createPlaylist);

playlistRoutes.get("/get-all-playlists", requireAuth, getAllPlaylistDetails);

playlistRoutes.get(
  "/get-playlist/:playlistId",
  requireAuth,
  getPlaylistDetails,
);

playlistRoutes.post(
  "/:playlistId/add-problem",
  requireAuth,
  addProblemToPlaylist,
);

playlistRoutes.delete(
  "/delete-playlist/:playlistId",
  requireAuth,
  deletePlaylist,
);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  requireAuth,
  removeProblemFromPlaylist,
);

export default playlistRoutes;
