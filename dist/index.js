// src/index.ts
import * as InitDataNode from "@tma.js/init-data-node";
import { AppError, ErrorCodes, parseJSON } from "@ywwwtseng/ywjs";
var validate2 = ({
  headers,
  botToken,
  skip
}) => {
  if (!botToken) {
    throw new AppError(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      "botToken is not configured"
    );
  }
  const authorization = headers.get("Authorization");
  if (!authorization?.includes("tma")) {
    throw new AppError(
      ErrorCodes.INVALID_SIGNATURE,
      "Authorization header is missing or invalid"
    );
  }
  const initData = new URLSearchParams(authorization.replace("tma ", ""));
  const rawTgWebAppData = initData.get("tgWebAppData");
  if (!rawTgWebAppData) {
    throw new AppError(
      ErrorCodes.INVALID_SIGNATURE,
      "Authorization header is missing or invalid"
    );
  }
  try {
    if (skip !== true) {
      InitDataNode.validate(rawTgWebAppData, botToken);
    }
    const tgWebAppData = new URLSearchParams(rawTgWebAppData);
    const user = parseJSON(tgWebAppData.get("user"));
    user.id = String(user.id);
    if (!user) {
      throw new AppError(
        ErrorCodes.INVALID_SIGNATURE,
        "Authorization header is missing or invalid"
      );
    }
    return {
      user,
      hash: tgWebAppData.get("hash"),
      signature: tgWebAppData.get("signature"),
      start_param: initData.get("tgWebAppStartParam")
    };
  } catch (error) {
    if (error !== null && typeof error === "object" && "status" in error) {
      throw error;
    }
    throw new AppError(ErrorCodes.INVALID_SIGNATURE, JSON.stringify(error));
  }
};
export {
  validate2 as validate
};
