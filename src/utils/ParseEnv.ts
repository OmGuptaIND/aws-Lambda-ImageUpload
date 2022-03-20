import dotenv from 'dotenv';

export const parseEnv = async (): Promise<dotenv.DotenvParseOutput> => {
  // Load env vars into Serverless environment
  // You can do more complicated env var resolution with dotenv here
  const envVars = dotenv.config({ path: '.env' }).parsed;
  const envObj = Object.assign(
    {},
    envVars // `dotenv` environment variables
  );
  console.log(envObj);

  return envObj;
};
