import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required to create a playlist");
  }

  const existingPlaylist = await prisma.playlist.findFirst({
    where: {
      userId,
      title,
    },
  });

  if (existingPlaylist) {
    throw new ApiError(
      400,
      "A playlist with the same title already exists for the user",
    );
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
    .json(new ApiResponse(201, { playlist }, "Playlist created successfully"));
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
        new ApiResponse(200, { playlists }, "Playlists fetched successfully"),
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
    throw new ApiError(404, "Playlist not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        "Playlist details fetched successfully",
      ),
    );
});

const addProblemToPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const playlistId = req.params.playlistId as string;
    const { problemIds } = req.body;

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "problemIds must be a non-empty array");
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
          "Problems added to playlist successfully",
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
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const removeProblemFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const playlistId = req.params.playlistId as string;
    const { problemIds } = req.body;

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "problemIds must be a non-empty array");
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
          "Problems removed from playlist successfully",
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
