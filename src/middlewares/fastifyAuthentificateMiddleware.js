// middlewares/fastifyAuthentificateMiddleware.js
export default function fastifyAuthentificateMiddleware(req, reply, done) {
  const userId = req.cookies?.user_id;

  if (!userId) {
    reply.redirect("/auth/github");
    return;
  }

  req.user = { id: userId };
  done();
}
