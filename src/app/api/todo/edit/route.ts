import { getAuthSession } from "@/lib/nextAuthOptions";
import { TodoEditValidator } from "@/lib/validators/todo";
import { getLogger } from "@/logger";
import prisma from "@/lib/prismadb";

export async function PATCH(req) {
  const logger = getLogger("info");
  try {
    const session = await getAuthSession();

    if (!session || !session?.user)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { id, title, description, deadline, label, order, state } =
      TodoEditValidator.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const [record] = await tx.todo.findMany({
        where: {
          id,
          ownerId: session!.user!.id,
          isDeleted: false,
        },
      });
      if (!record) throw new Error("Record Not Found");

      const isOrderModified =
        typeof order !== "undefined" &&
        (record.order !== order || record.state !== state);
      const changedState = record.state !== state;
      const isOrderIncreased = order && record.order < order;

      if (!isOrderModified) {
        await tx.todo.update({
          where: { id },
          data: {
            title,
            description,
            state,
            deadline,
            label,
          },
        });
      } else if (changedState) {
        await tx.todo.updateMany({
          where: {
            ownerId: session!.user!.id,
            state: record.state,
            order: { gt: record.order },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });

        await tx.todo.updateMany({
          where: {
            ownerId: session!.user!.id,
            state,
            order: { gte: order },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });

        await tx.todo.update({
          where: { id },
          data: {
            title,
            description,
            state,
            deadline,
            label,
            order,
          },
        });
      } else if (isOrderIncreased) {
        await tx.todo.updateMany({
          where: {
            ownerId: session!.user!.id,
            state,
            order: { gt: record.order, lte: order },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });

        await tx.todo.update({
          where: { id },
          data: {
            title,
            description,
            state,
            deadline,
            label,
            order,
          },
        });
      } else {
        await tx.todo.updateMany({
          where: {
            ownerId: session!.user!.id,
            state,
            order: { lt: record.order, gte: order },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });

        await tx.todo.update({
          where: { id },
          data: {
            title,
            description,
            state,
            deadline,
            label,
            order,
          },
        });
      }

      const finalResult = await tx.todo.findMany({
        where: {
          ownerId: session!.user!.id,
          isDeleted: false,
        },
        orderBy: {
          order: "asc",
        },
      });

      return finalResult;
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logger.error(error);
    if (error instanceof Error && error.message === "Record Not Found") {
      return new Response("Record Not Found", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
