import { getAuthSession } from "@/lib/nextAuthOptions";
import { LogIn, Menu, Search, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import UserAccountNav from "./UserAccountNav";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const AppHeader = async () => {
  const session = await getAuthSession();

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-3 px-4 flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-10 h-10 flex items-center justify-center mr-2 md:hidden invisible z-0"
        disabled={true}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <ThemeSwitcher />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link className={buttonVariants()} href={"/login"}>
            <span className="md:inline-block hidden">Sign In</span>
            <span className="md:hidden block"><LogIn /></span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
