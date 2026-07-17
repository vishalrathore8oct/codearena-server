import type { CookieOptions } from "express";

const appName = "CodeArena";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const MESSAGES = {
  // Auth
  USER_ALREADY_EXISTS: "User already exists with this email",
  USER_REGISTERED_SUCCESSFULLY:
    "Users registered successfully and verification email has been sent on your email. Please verify your email to activate your account.",
  VERIFICATION_TOKEN_MISSING: "Verification token is missing",
  INVALID_OR_EXPIRED_VERIFICATION_TOKEN:
    "Invalid or expired verification token",
  EMAIL_VERIFIED_SUCCESSFULLY:
    "Email verified successfully. You can now log in to your account.",
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  PLEASE_VERIFY_EMAIL_TO_LOGIN:
    "Please verify your email to activate your account before logging in",
  USER_LOGGED_IN_SUCCESSFULLY: "User logged in successfully",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_OR_EXPIRED_REFRESH_TOKEN: "Invalid or expired refresh token",
  USER_NOT_FOUND_OR_NO_REFRESH_TOKEN:
    "User not found or no refresh token stored",
  REFRESH_TOKEN_MISMATCH: "Refresh token mismatch or reused token detected",
  ACCESS_TOKEN_REFRESHED_SUCCESSFULLY:
    "Access token refreshed or rotated successfully",
  USER_LOGGED_OUT_SUCCESSFULLY: "User logged out successfully",
  UNAUTHORIZED: "Unauthorized",
  USER_NOT_FOUND: "User not found",
  CURRENT_USER_PROFILE_FETCHED_SUCCESSFULLY:
    "Current user profile fetched successfully",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_ALREADY_VERIFIED: "Email is already verified",
  VERIFICATION_EMAIL_RESENT_SUCCESSFULLY:
    "Verification email Resent on your email successfully. Please verify your email to activate your account.",
  PASSWORD_RESET_LINK_SENT_IF_EXISTS:
    "If an account exists, a password reset link has been sent",
  PASSWORD_RESET_LINK_SENT_SUCCESSFULLY:
    "Password reset link has been sent to your email successfully. Please check your email to reset your password.",
  RESET_TOKEN_REQUIRED: "Reset token is required",
  NEW_PASSWORD_REQUIRED: "New password is required",
  INVALID_OR_EXPIRED_RESET_TOKEN: "Invalid or expired reset token",
  PASSWORD_RESET_SUCCESSFULLY:
    "Password reset successfully. Please log in with your new password.",
  UNAUTHORIZED_USER: "Unauthorized User",
  USERNAME_ALREADY_TAKEN: "Username already taken, please try with another one",
  USER_PROFILE_UPDATED_SUCCESSFULLY: "User profile updated successfully",
  CURRENT_AND_NEW_PASSWORD_REQUIRED: "Current and new password are required",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  NEW_PASSWORD_MUST_BE_DIFFERENT:
    "New password must be different from current password",
  PASSWORD_CHANGED_SUCCESSFULLY:
    "Password changed successfully. Please login again.",
  USERS_FETCHED_SUCCESSFULLY: "Users fetched successfully",

  // Execution
  INVALID_OR_MISSING_TESTCASES:
    "Invalid or Missing testcases - 'stdin' and 'expectedOutput' must be non-empty arrays of the same length",
  CODE_RUN_SUCCESSFULLY: "Code run successfully",
  CODE_SUBMITTED_SUCCESSFULLY: "Code submitted successfully",

  // Playlist
  PLAYLIST_TITLE_REQUIRED: "Title is required to create a playlist",
  PLAYLIST_ALREADY_EXISTS:
    "A playlist with the same title already exists for the user",
  PLAYLIST_CREATED_SUCCESSFULLY: "Playlist created successfully",
  PLAYLISTS_FETCHED_SUCCESSFULLY: "Playlists fetched successfully",
  PLAYLIST_NOT_FOUND: "Playlist not found",
  PLAYLIST_DETAILS_FETCHED_SUCCESSFULLY:
    "Playlist details fetched successfully",
  PROBLEM_IDS_REQUIRED_ARRAY: "problemIds must be a non-empty array",
  PROBLEMS_ADDED_TO_PLAYLIST_SUCCESSFULLY:
    "Problems added to playlist successfully",
  PLAYLIST_DELETED_SUCCESSFULLY: "Playlist deleted successfully",
  PROBLEMS_REMOVED_FROM_PLAYLIST_SUCCESSFULLY:
    "Problems removed from playlist successfully",

  // Problem
  FORBIDDEN_CREATE_PROBLEM:
    "Forbidden - User does not have the required role to create a problem",
  TESTCASE_REQUIRED: "At least one testcase is required",
  PROBLEM_CREATED_SUCCESSFULLY: "Problem created successfully",
  NO_PROBLEMS_FOUND: "No problems found",
  PROBLEMS_RETRIEVED_SUCCESSFULLY: "Problems retrieved successfully",
  PROBLEM_NOT_FOUND: "Problem not found",
  PROBLEM_RETRIEVED_SUCCESSFULLY: "Problem retrieved successfully",
  FORBIDDEN_UPDATE_PROBLEM:
    "Forbidden - User does not have the required role to update a problem",
  PROBLEM_UPDATED_SUCCESSFULLY: "Problem updated successfully",
  FORBIDDEN_DELETE_PROBLEM:
    "Forbidden - User does not have the required role to delete a problem",
  PROBLEM_DELETED_SUCCESSFULLY: "Problem deleted successfully",
  SOLVED_PROBLEMS_RETRIEVED_SUCCESSFULLY:
    "Solved problems retrieved successfully",
  REFERENCE_SOLUTION_REQUIRED: (language: string) =>
    `Reference solution for ${language} is required`,
  UNSUPPORTED_LANGUAGE: (language: string) =>
    `Unsupported language: ${language}`,
  TESTCASE_FAILED: (index: number, language: string) =>
    `testcase ${index} failed for Language ${language}.`,

  // Submission
  SUBMISSIONS_RETRIEVED_SUCCESSFULLY: "Submissions retrieved successfully",
  PROBLEM_SUBMISSIONS_RETRIEVED_SUCCESSFULLY:
    "Submissions for the problem retrieved successfully",
  SUBMISSION_COUNT_RETRIEVED_SUCCESSFULLY:
    "Count of submissions for the problem retrieved successfully",
};

export { appName, cookieOptions, MESSAGES, USER_ROLES };
export type { UserRole };
