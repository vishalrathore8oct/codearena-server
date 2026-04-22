import crypto from "crypto";

const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  return {
    token,
    hashedToken,
    expiry: new Date(Date.now() + 15 * 60 * 1000), // 15 min
  };
};

export { generateEmailVerificationToken };
