import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from 'next';

// ...

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

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