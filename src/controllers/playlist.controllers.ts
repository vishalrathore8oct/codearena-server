import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const getAllPlaylistDetails = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const getPlaylistDetails = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const createPlaylist = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const addProblemToPlaylist = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const deletePlaylist = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const removeProblemFromPlaylist = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

export {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
};
