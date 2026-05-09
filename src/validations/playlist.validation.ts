import { z } from "zod";

const playlistIdParamSchema = z.object({
  playlistId: z.uuid("Invalid playlist ID format"),
});

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title must not exceed 100 characters");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must not exceed 500 characters")
  .optional();

const problemIdsSchema = z
  .array(z.uuid("Each problem ID must be a valid UUID"))
  .min(1, "problemIds must be a non-empty array")
  .max(100, "You can add or remove at most 100 problems at once");

const createPlaylistSchema = z.object({
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
  }),
});

const getPlaylistDetailsSchema = z.object({
  params: playlistIdParamSchema,
});

const addProblemToPlaylistSchema = z.object({
  params: playlistIdParamSchema,
  body: z.object({
    problemIds: problemIdsSchema,
  }),
});

const deletePlaylistSchema = z.object({
  params: playlistIdParamSchema,
});

const removeProblemFromPlaylistSchema = z.object({
  params: playlistIdParamSchema,
  body: z.object({
    problemIds: problemIdsSchema,
  }),
});

export {
  addProblemToPlaylistSchema,
  createPlaylistSchema,
  deletePlaylistSchema,
  getPlaylistDetailsSchema,
  removeProblemFromPlaylistSchema,
};
