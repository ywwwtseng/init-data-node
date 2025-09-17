import * as InitDataNode from '@tma.js/init-data-node';
import { AppError, ErrorCodes, parseJSON } from '@ywwwtseng/ywjs';

export type User<T = string> = {
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  first_name: string;
  id: T;
  is_bot?: boolean;
  is_premium?: boolean;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
  username?: string;
} & {
  [key: string]: unknown;
};

export const validate = ({
  headers,
  botToken,
  skip,
}: {
  headers: Headers;
  botToken: string;
  skip?: boolean;
}): {
  user: User<string>;
  hash: string;
  signature: string;
  start_param: string | null;
} => {
  if (!botToken) {
    throw new AppError(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      'botToken is not configured'
    );
  }

  const authorization = headers.get('Authorization');

  if (!authorization?.includes('tma')) {
    throw new AppError(
      ErrorCodes.INVALID_SIGNATURE,
      'Authorization header is missing or invalid'
    );
  }

  const initData = new URLSearchParams(authorization.replace('tma ', ''));
  const rawTgWebAppData = initData.get('tgWebAppData');

  if (!rawTgWebAppData) {
    throw new AppError(
      ErrorCodes.INVALID_SIGNATURE,
      'Authorization header is missing or invalid'
    );
  }

  try {
    if (skip !== true) {
      InitDataNode.validate(rawTgWebAppData, botToken);
    }

    const tgWebAppData = new URLSearchParams(rawTgWebAppData);

    const user = parseJSON(tgWebAppData.get('user')) as User<number | string>;
    user.id = String(user.id);

    if (!user) {
      throw new AppError(
        ErrorCodes.INVALID_SIGNATURE,
        'Authorization header is missing or invalid'
      );
    }

    return {
      user: user as User,
      hash: tgWebAppData.get('hash'),
      signature: tgWebAppData.get('signature'),
      start_param: initData.get('tgWebAppStartParam'),
    };
  } catch (error) {
    if (error !== null && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    throw new AppError(ErrorCodes.INVALID_SIGNATURE, JSON.stringify(error));
  }
};
