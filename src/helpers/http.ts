const httpError = (status) => (message, err = undefined) => ({
  error: true,
  err,
  status,
  message
});

// const httpErrorExplained = (status) => {
//
//   const httpErrorFunction = (message) => {
//
//     return  {
//       error: true,
//       status,
//       message
//     };
//
//   };
//
//   return httpErrorFunction;
//
// };
export const httpError500 = httpError(500);

export const httpError400 = httpError(400);

export const httpError401 = httpError(401);

export const httpError403 = httpError(403);
