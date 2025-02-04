# DOD-TODO application

This To do application is a dynamic task management tool built with Next.js, React and Prisma. It allows users to visualize and manage their workflow efficiently through a drag-and-drop interface.he application allows users to create, organize, and track tasks across different stages of completion, enhancing productivity and team collaboration.

## Key Features

- Dynamic Columns: Customizable columns representing different stages of work (e.g., To Do, In Progress, Done).
- Drag-and-Drop Interface: Intuitive task movement between columns using React Beautiful DnD.
- Task Management:
- Create new tasks with titles, descriptions, priorities, and due dates.
- Edit existing tasks to update their details.
- Delete tasks when they're no longer needed.
- Priority Levels: Assign Low, Medium, or High priority to tasks for better organization.
- Due Dates: Set and track due dates for tasks to manage deadlines effectively.
- Responsive Design: Fully responsive layout that works seamlessly on desktop and mobile devices.
- Real-time Updates: Instant synchronization of changes across all connected clients.
- Server-Side Rendering: Utilizes Next.js for improved performance and SEO.

## Technical Stack

Frontend: React, Next.js
Backend: Next.js API routes
Database: PostgreSQL
ORM: Prisma
State Management: React Hooks
Styling: Tailwind CSS
Drag and Drop: @hello-pangea/dnd (fork of @react-beautiful-dnd)

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/kanban-board.git
```

Navigate to the project directory:

```bash
cd kanban-board
```

Install dependencies:

```bash
npm install
```

Set up environment variables:
Create a .env.local file in the root directory and add the following variables:

```bash
DATABASE_URL="your_database_connection_string"
```

Set up the database:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Usage

To add a new task, click the "Add Task" button in the desired column.
Drag and drop tasks between columns to update their status.
Click on a task to view details or edit its information.

## Contributing

We welcome contributions to improve the Kanban board application. Please follow these steps:
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

## Acknowledgments

Next.js for the React framework
React Beautiful DnD for drag-and-drop functionality

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
