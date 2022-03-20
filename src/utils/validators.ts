import { z } from 'zod';

export const imageUploadSchema = z.object({
  file: z.string({
    required_error: 'File is required',
  }),
  fileName: z.string({
    required_error: 'File name is required',
  }),
  type: z.enum(['profile', 'banner']),
  accessToken: z.string({
    required_error: 'accessToken is required',
  }),
});

export const imageMimeSchema = z.object({
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/jpg']),
});

export const accessTokenSchema = z.object({
  address: z.string({
    required_error: 'address is required',
  }),
  userId: z.string({
    required_error: 'userId is required',
  }),
  chain: z.string({
    required_error: 'chain is required',
  }),
  'https://hasura.io/jwt/claims': z.object({
    'x-hasura-allowed-roles': z.string({
      required_error: 'x-hasura-allowed-roles is required',
    }),
    'x-hasura-default-role': z.string({
      required_error: 'x-hasura-default-role is required',
    }),
    'x-hasura-user-id': z.string({
      required_error: 'x-hasura-user-id is required',
    }),
    'x-hasura-user-role': z.string({
      required_error: 'x-hasura-user-role is required',
    }),
  }),
  iat: z.number({
    required_error: 'iat is required',
  }),
  exp: z.number({
    required_error: 'exp is required',
  }),
});

export type imageMimeSchemaType = z.infer<typeof imageMimeSchema>;
export type accessTokenSchemaType = z.infer<typeof accessTokenSchema>;
export type imageUploadSchemaType = z.infer<typeof imageUploadSchema>;
