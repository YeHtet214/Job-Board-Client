import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item"

import { Notification } from "@/types/messaging";

const NotiItem = ({ noti, isLast }: { noti: Notification, isLast: boolean }) => {

  return (
    <Item variant="muted" size="sm" className="hover">
      <ItemMedia className="h-2 w-2 rounded-full bg-jb-primary" />
      <ItemContent>
        <ItemTitle>{`${noti.payload.senderName} sent you a message`}</ItemTitle>
        <ItemDescription>{noti.payload.snippet}</ItemDescription>
      </ItemContent>
      <ItemActions />
    </Item>
  )
}

export default NotiItem;