import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as _ from 'lodash';
export const hashPassword = (password: string): Promise<string> => {
  return hash(password, 10);
};

export const comparePassword = (
  password: string,
  hashedPwd: string,
): Promise<string> => {
  return compare(password, hashedPwd);
};


export const generateTokenAdmin = (payload): string => {
  return sign(
    {
      _id: (payload as any)._id,
      email: payload.email,
    },
    process.env.TOKEN_SECRET,
  );
};

export const generateTokenUser = (
  payload,
): string => {
  return sign(
    {
      _id: (payload as any)._id,
      phoneNumber: payload.phoneNumber,
      countryCode: payload.countryCode,
      userId: `${payload.countryCode}${payload.phoneNumber}`,
    },
    process.env.TOKEN_SECRET_USER,
  );
};

export const objectIsEmpty = (payload: any): boolean => {
  console.log(_.isEmpty(payload));
  return _.isEmpty(payload);
};

export let nameToSlug = (name) => {
  // Convert to lowercase and replace spaces with hyphens
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  // Remove special characters and symbols
  const cleanedSlug = slug.replace(/[^\w-]+/g, '');

  // Trim leading and trailing hyphens (in case of multiple spaces)
  return cleanedSlug.replace(/^-+|-+$/g, '');
};

