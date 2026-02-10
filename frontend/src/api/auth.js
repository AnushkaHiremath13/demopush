import { api } from "./api";

/**
 * LOGIN USER
 * Backend: POST /api/auth/login
 */
export async function loginUser({ uemail, upassword }) {
  return api("/auth/login", {
    method: "POST",
    body: {
      uemail,
      upassword,
    },
  });
}

/**
 * REGISTER USER
 * Backend: POST /api/auth/register
 */
export async function registerUser({
  uname,
  uemail,
  upassword,
  uconfirmpassword,
  uphone,
  ccode,
}) {
  return api("/auth/register", {
    method: "POST",
    body: {
      uname,
      uemail,
      upassword,
      uconfirmpassword,
      uphone,
      ccode,
    },
  });
}
