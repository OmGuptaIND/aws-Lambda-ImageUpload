import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../utils/apiResponse';

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return apiResponse(200, {
      message: 'Welcome to the API',
    });
  } catch (err) {
    return apiResponse(500, 'Somrthing went wrong');
  }
};
