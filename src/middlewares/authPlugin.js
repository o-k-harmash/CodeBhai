import crypto from "node:crypto";
import axios from "axios";
// plugins/fastifyAuthMiddleware.js
import fp from "fastify-plugin";

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_PROFILE_URL = "https://api.github.com/user";

function authPlugin(fastify, opts, done) {
  const { client_id, redirect_uri, scope, client_secret } = opts;

  fastify.get("/auth/github", async (req, reply) => {
    const state = crypto.randomBytes(16).toString("hex");

    const query = new URLSearchParams({
      client_id,
      redirect_uri: `http://localhost:${fastify.port}/${redirect_uri}`,
      scope,
      state,
    });

    reply.setCookie("oauth_state", state, { path: "/", httpOnly: true });
    reply.redirect(`${GITHUB_AUTH_URL}?${query.toString()}`);
  });

  fastify.get("/auth/github/callback", async (req, reply) => {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;

    if (!code || !state || state !== savedState) {
      return reply.status(400).send({ error: "Invalid state or code" });
    }

    const tokenRes = await axios.post(
      GITHUB_TOKEN_URL,
      {
        client_id,
        client_secret,
        code,
        redirect_uri: `http://localhost:${fastify.port}/${redirect_uri}`,
      },
      {
        headers: { Accept: "application/json" },
      },
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken)
      return reply.status(401).send({ error: "Access token not received" });

    const userRes = await axios.get(GITHUB_PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, avatar_url } = userRes.data;
    reply
      .setCookie("user_id", String(id), { path: "/", httpOnly: true })
      .setCookie("avatar", avatar_url, { path: "/" })
      .redirect("/curriculums");
  });

  done();
}

export default fp(authPlugin);
