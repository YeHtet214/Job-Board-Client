import { Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { useMessaging } from "@/contexts/MessagingContext";
import { Badge } from "../ui/badge";
import NotiItem from "./NotiItem";
import { Notification } from "@/types/messaging";

const NotificationsList = () => {
  const { notis } = useMessaging()

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <div>
          <Badge className="absolute top-0 right-0 -translate-y-2/3 translate-x-2/3 text-jb-bg h-5 min-w-5 rounded-full p-1 flex items-center justify-center">
            {notis.length}
          </Badge>
          <Bell className="h-5 w-5 z-10" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="flex flex-col gap-2">
            { notis.length > 0 && notis.map((noti: Notification, index: number) => (
              <NotiItem key={noti.id} noti={noti} isLast={index === (notis.length - 1)} />
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default NotificationsList;
