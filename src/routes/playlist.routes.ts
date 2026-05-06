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

playlistRoutes.get("/", requireAuth, getAllPlaylistDetails);

playlistRoutes.get("/:playlistId", requireAuth, getPlaylistDetails);

playlistRoutes.post("/create", requireAuth, createPlaylist);

playlistRoutes.post(
  "/:playlistId/add-problem",
  requireAuth,
  addProblemToPlaylist,
);

playlistRoutes.delete("/:playlistId", requireAuth, deletePlaylist);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  requireAuth,
  removeProblemFromPlaylist,
);

export default playlistRoutes;
