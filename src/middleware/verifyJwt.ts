import { NextFunction } from "express";
import jwt from "jsonwebtoken";
/*This middleware function can be used before accessing protected routes to confirm that
1) An auth-token is present on the request
2) The auth-token in the request is valid
If both conditions are met, then the next() function is called, allowing access to the protected route

Example of how to use verifyJWT:
router.post("/protected-route", verifyJWTFunction, protectedRouteFunction);
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyJWT = (req: any, res: any, next: NextFunction) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.send("Auth token not included in request");
    } else {
      const accessToken: string | undefined = process.env.access_token;
      if (!accessToken) return res.status(500).send("Access token not found");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jwt.verify(token, accessToken, (err: any, decoded: any) => {
        if (err) {
          console.log(err);
          res.status(401).json({
            auth: false,
            message: "Your auth token is invalid or expired",
            status: 401,
          });
        } else if (
          typeof decoded !== "undefined" &&
          // eslint-disable-next-line no-prototype-builtins
          decoded.hasOwnProperty("id")
        ) {
          const id: string = decoded.id;
          req.params.user_id = id;
          next();
        }
      });
    }
  } catch {
    return res.status(401).send("Your auth token has expired");
  }
};
