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
import { Button } from "../ui/button";

const NotificationsList = () => {
  const { notifications, clearNotifications } = useMessaging()

  if (!notifications) return <h1>No notifications</h1>

  return (
    <div className="">
      <Sheet>
        <SheetTrigger className="relative">
          <div>
            <Badge className="absolute top-0 right-0 -translate-y-2/3 translate-x-2/3 text-jb-bg h-5 min-w-5 rounded-full p-1 flex items-center justify-center">
              {notifications.length}
            </Badge>
            <Bell className="h-5 w-5" />
          </div>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] bg-jb-bg">
          <SheetHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <SheetTitle className="text-2xl">Notifications</SheetTitle>
                <p className="text-muted-foreground text-xs text-nowrap">You have {notifications.length} unread notifications</p>
              </div>

            </div>

            <SheetDescription className="flex flex-col gap-2 text-foreground max-h-[80vh] overflow-y-scroll scrollbar-hidden">
              {notifications.length > 0 && notifications.map((noti: Notification, index: number) => (
                <NotiItem key={noti.id} noti={noti} isLast={index === (notifications.length - 1)} />
              ))}
            </SheetDescription>
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="ml-4" disabled={notifications.length === 0}>
              Mark all as read
            </Button>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default NotificationsList;
