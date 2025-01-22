import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const prisma = new PrismaClient();

interface ExtendedSession extends Session {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...
  const session: ExtendedSession | null = await getSession({ req }) as unknown as ExtendedSession;
  if (session) {
    session.id = session.user?.id || '';
  }

  const userId = session?.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }
  switch (req.method) {
    case "GET":
      const tasks = await prisma.task.findMany({ where: { userId } });
      res.status(200).json({ tasks });
      break;
    case "POST":
      const { title } = req.body;
      const newTask = await prisma.task.create({
        data: { title, userId },
      });
      res.status(201).json({ task: newTask });
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}