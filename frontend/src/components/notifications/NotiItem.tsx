import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item"

import { Notification } from "@/types/messaging";

const NotiItem = ({ noti, isLast }: { noti: Notification, isLast?: boolean }) => {
  const getNotificationContent = () => {
    switch (noti.type) {
      case 'New_Message':
      case 'Realtime_Message':
        return {
          title: `${noti.payload.senderName} sent you a message`,
          description: noti.payload.snippet
        };
      case 'Job_Application':
      case 'Application_Status_Update':
        return {
          title: noti.payload.title || 'Application Update',
          description: noti.payload.message || noti.payload.snippet || 'Status updated'
        };
      default:
        return {
          title: 'New Notification',
          description: 'You have a new notification'
        };
    }
  };

  const content = getNotificationContent();

  return (
    <Item variant="muted" size="sm" className={`hover ${isLast && 'border-b-2'}`}>
      <ItemMedia className="h-2 w-2 rounded-full bg-jb-primary" />
      <ItemContent>
        <ItemTitle>{content.title}</ItemTitle>
        <ItemDescription>{content.description}</ItemDescription>
      </ItemContent>
      <ItemActions />
    </Item>
  )
}

export default NotiItem;