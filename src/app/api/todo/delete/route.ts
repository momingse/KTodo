import { getAuthSession } from "@/lib/nextAuthOptions";
import { TodoDeleteValidator } from "@/lib/validators/todo";
import prisma from "@/lib/prismadb";
import { getLogger } from "@/logger";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const logger = getLogger("info");
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { id } = TodoDeleteValidator.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const [record] = await tx.todo.findMany({
        where: {
          id,
          ownerId: session.user?.id,
          isDeleted: false,
        },
      });
      if (!record) throw new Error("Record Not Found");

      await tx.todo.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });

      await tx.todo.updateMany({
        where: {
          ownerId: session.user?.id,
          state: record.state,
          order: { gt: record.order },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      const finalResult = await tx.todo.findMany({
        where: {
          ownerId: session.user?.id,
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
