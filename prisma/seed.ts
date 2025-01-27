import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const column1 = await prisma.column.create({
    data: {
      title: "To Do",
      order: 1,
      tasks: {
        create: [
          {
            title: "Task 1",
            description: "This is task 1",
            priority: "MEDIUM",
            dueDate: null,
          },
          {
            title: "Task 2",
            description: "This is task 2",
            priority: "HIGH",
            dueDate: null,
          },
        ],
      },
    },
  });

  const column2 = await prisma.column.create({
    data: {
      title: "In Progress",
      order: 2,
      tasks: {
        create: [
          {
            title: "Task 3",
            description: "This is task 3",
            priority: "LOW",
            dueDate: null,
          },
        ],
      },
    },
  });

  const column3 = await prisma.column.create({
    data: {
      title: "Done",
      order: 3,
      tasks: {
        create: [],
      },
    },
  });

  console.log({ column1, column2, column3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
