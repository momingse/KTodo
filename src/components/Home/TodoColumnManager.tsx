"use client";

import { TASK_STATE_OPTIONS } from "@/lib/const";
import { TodoEditRequest } from "@/lib/validators/todo";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useMutation } from "react-query";
import DndContextProvider, { OnDragEndEvent } from "../DnDContextProvider";
import { useToast } from "../ui/use-toast";
import { Todo } from "@prisma/client";

const TodoColumn = dynamic(() => import("./TodoColumn"), {
  ssr: false,
});

type TodoColumnManagerProp = {
  todos: Record<Todo["state"], Todo[]>;
};

const TodoColumnManager: FC<TodoColumnManagerProp> = ({ todos }) => {
  const router = useRouter();
  const { axiosToast } = useToast();

  const { mutate: handleUpdateState } = useMutation({
    mutationFn: async ({ id, state, order }: TodoEditRequest) => {
      const result = await axios.patch("/api/todo/edit", { id, state, order });
      return result;
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error: AxiosError) => {
      axiosToast(error);
    },
  });

  const handleDragEnd = (dragEndEvent: OnDragEndEvent) => {
    const { over, from, item, order } = dragEndEvent;
    if (!over || !from || !item) return;

    const payload = {
      state: over as Todo["state"],
      id: item as string,
      order,
    };

    handleUpdateState(payload);
  };

  return (
    <DndContextProvider onDragEnd={handleDragEnd}>
      <div className="h-[90%] flex gap-2 overflow-x-scroll">
        {TASK_STATE_OPTIONS.map(({ value, title }) => {
          return (
            <TodoColumn
              key={value}
              title={title}
              todos={todos[value] ?? []}
              state={value}
            />
          );
        })}
      </div>
    </DndContextProvider>
  );
};

export default TodoColumnManager;
