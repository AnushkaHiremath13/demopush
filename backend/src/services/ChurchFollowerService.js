// src/services/ChurchFollowerService.js

const prisma = require("../config/prisma");

/* ============================================================
   CHECK AUTHORIZED HANDLER
   (platform-created, approved church authority)
============================================================ */

async function isAuthorizedHandler({ handlerUid, cid }) {
  const record = await prisma.tblchurch_user.findFirst({
    where: {
      uid: handlerUid,
      cid,
      approvalstatus: "APPROVED",
      createdby: {
        in: (
          await prisma.tbluser1.findMany({
            where: { uisplatform: true },
            select: { uid: true },
          })
        ).map((u) => u.uid),
      },
    },
    select: { uid: true },
  });

  return !!record;
}

/* ============================================================
   GET PENDING FOLLOWERS
============================================================ */

async function getPendingFollowers({ handlerUid }) {
  /* 1️⃣ Find church of handler */
  const handlerChurch = await prisma.tblchurch_user.findFirst({
    where: {
      uid: handlerUid,
      approvalstatus: "APPROVED",
    },
    select: {
      cid: true,
    },
  });

  if (!handlerChurch) {
    throw new Error("User is not linked to any church");
  }

  const { cid } = handlerChurch;

  /* 2️⃣ Verify authority */
  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to approve followers");
  }

  /* 3️⃣ Fetch pending followers */
  const followers = await prisma.tblchurch_user.findMany({
    where: {
      cid,
      approvalstatus: "PENDING",
    },
    include: {
      tbluser1: {
        select: {
          uid: true,
          uname: true,
          uemail: true,
        },
      },
    },
    orderBy: {
      createdat: "asc",
    },
  });

  /* 4️⃣ Shape response like original SQL */
  return followers.map((f) => ({
    uid: f.tbluser1.uid,
    uname: f.tbluser1.uname,
    uemail: f.tbluser1.uemail,
    createdat: f.createdat,
  }));
}

/* ============================================================
   APPROVE FOLLOWER
============================================================ */

async function approveFollower({ handlerUid, followerUid }) {
  /* 1️⃣ Find handler church */
  const handlerChurch = await prisma.tblchurch_user.findFirst({
    where: {
      uid: handlerUid,
      approvalstatus: "APPROVED",
    },
    select: {
      cid: true,
    },
  });

  if (!handlerChurch) {
    throw new Error("User is not linked to any church");
  }

  const { cid } = handlerChurch;

  /* 2️⃣ Verify authority */
  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to approve followers");
  }

  /* 3️⃣ Approve follower */
  const result = await prisma.tblchurch_user.updateMany({
    where: {
      uid: followerUid,
      cid,
      approvalstatus: "PENDING",
    },
    data: {
      approvalstatus: "APPROVED",
      createdby: handlerUid,
    },
  });

  if (result.count === 0) {
    throw new Error("Follower not found or already processed");
  }

  return { uid: followerUid };
}

/* ============================================================
   REJECT FOLLOWER
============================================================ */

async function rejectFollower({ handlerUid, followerUid }) {
  /* 1️⃣ Find handler church */
  const handlerChurch = await prisma.tblchurch_user.findFirst({
    where: {
      uid: handlerUid,
      approvalstatus: "APPROVED",
    },
    select: {
      cid: true,
    },
  });

  if (!handlerChurch) {
    throw new Error("User is not linked to any church");
  }

  const { cid } = handlerChurch;

  /* 2️⃣ Verify authority */
  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to reject followers");
  }

  /* 3️⃣ Reject follower */
  const result = await prisma.tblchurch_user.updateMany({
    where: {
      uid: followerUid,
      cid,
      approvalstatus: "PENDING",
    },
    data: {
      approvalstatus: "REJECTED",
      createdby: handlerUid,
    },
  });

  if (result.count === 0) {
    throw new Error("Follower not found or already processed");
  }

  return { uid: followerUid };
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
};
