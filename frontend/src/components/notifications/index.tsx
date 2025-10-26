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
  const { notifications } = useMessaging()

  console.log("Notifications: ", notifications)
  if (!notifications) return <h1>No notifications</h1>

  return (
    <Sheet>
      
      <SheetTrigger className="relative">
        <div>
          <Badge className="absolute top-0 right-0 -translate-y-2/3 translate-x-2/3 text-jb-bg h-5 min-w-5 rounded-full p-1 flex items-center justify-center">
            {notifications.length}
          </Badge>
          <Bell className="h-5 w-5 z-10" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl">Notifications</SheetTitle>
          <h3 className="text-muted-foreground">You have {notifications.length} unread notifications</h3>
          <SheetDescription className="flex flex-col gap-2 text-foreground">
            { notifications.length > 0 && notifications.map((noti: Notification, index: number) => (
              <NotiItem key={noti.id} noti={noti} isLast={index === (notifications.length - 1)} />
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default NotificationsList;
