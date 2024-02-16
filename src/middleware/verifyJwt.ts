import { NextFunction, Request, Response } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
/*This middleware function can be used before accessing protected routes to confirm that
1) An auth-token is present on the request
2) The auth-token in the request is valid
If both conditions are met, then the next() function is called, allowing access to the protected route

Example of how to use verifyJWT:
router.post("/protected-route", verifyJWTFunction, protectedRouteFunction);
*/
export const SECRET_KEY: Secret = process.env.access_token!;

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  const refreshToken = req.cookies["x-refresh-token"];

  // console.log(token, refreshToken);
  console.log(typeof refreshToken);

  if (!token && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token as string, SECRET_KEY) as JwtPayload;
    console.log("line 25", decoded);
    req.params.user_id = decoded.id;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      // console.log("line 33", typeof refreshToken);
      const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;
      console.log("line 34", decoded);
      const token = jwt.sign({ id: decoded.id }, SECRET_KEY, {
        expiresIn: 1800,
      });
      console.log("line 33", token);
      // const NewRefreshToken = jwt.sign({ id: decoded.id }, SECRET_KEY, {
      //   expiresIn: "24h",
      // });
      res
        // .cookie("x-refresh-token", NewRefreshToken, {
        //   httpOnly: true,
        //   sameSite: "strict",
        // })
        .set("Access-Control-Expose-Headers", "x-access-token")
        .header("x-access-token", token)
        .send("Token Expired: New token returned in header");
    } catch (error) {
      console.log(error);
      return res.status(401).send("Invalid Token. Please Login.");
    }
  }
};
