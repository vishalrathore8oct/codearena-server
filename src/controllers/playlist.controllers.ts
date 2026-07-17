import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { MESSAGES } from "../constant.js";

const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, MESSAGES.PLAYLIST_TITLE_REQUIRED);
  }

  const existingPlaylist = await prisma.playlist.findFirst({
    where: {
      userId,
      title,
    },
  });

  if (existingPlaylist) {
    throw new ApiError(400, MESSAGES.PLAYLIST_ALREADY_EXISTS);
  }

  const playlist = await prisma.playlist.create({
    data: {
      title,
      description,
      userId,
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { playlist },
        MESSAGES.PLAYLIST_CREATED_SUCCESSFULLY,
      ),
    );
});

const getAllPlaylistDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { playlists },
          MESSAGES.PLAYLISTS_FETCHED_SUCCESSFULLY,
        ),
      );
  },
);

const getPlaylistDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const playlistId = req.params.playlistId as string;

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
      userId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, MESSAGES.PLAYLIST_NOT_FOUND);
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        MESSAGES.PLAYLIST_DETAILS_FETCHED_SUCCESSFULLY,
      ),
    );
});

const addProblemToPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const playlistId = req.params.playlistId as string;
    const { problemIds } = req.body;

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, MESSAGES.PROBLEM_IDS_REQUIRED_ARRAY);
    }

    const problemsInPlaylist = await prisma.problemInPlaylist.createMany({
      data: problemIds.map((problemId: string) => ({
        playlistId,
        problemId,
      })),
      skipDuplicates: true,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { problemsInPlaylist },
          MESSAGES.PROBLEMS_ADDED_TO_PLAYLIST_SUCCESSFULLY,
        ),
      );
  },
);

const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId as string;

  await prisma.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, MESSAGES.PLAYLIST_DELETED_SUCCESSFULLY));
});

const removeProblemFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const playlistId = req.params.playlistId as string;
    const { problemIds } = req.body;

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, MESSAGES.PROBLEM_IDS_REQUIRED_ARRAY);
    }

    const deletedProblemsInPlaylist = await prisma.problemInPlaylist.deleteMany(
      {
        where: {
          playlistId,
          problemId: {
            in: problemIds,
          },
        },
      },
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deletedProblemsInPlaylist },
          MESSAGES.PROBLEMS_REMOVED_FROM_PLAYLIST_SUCCESSFULLY,
        ),
      );
  },
);

export {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
};
