export const apiResponse = (statusCode: number, body: any) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allowed-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
    body: JSON.stringify(body),
  };
};
