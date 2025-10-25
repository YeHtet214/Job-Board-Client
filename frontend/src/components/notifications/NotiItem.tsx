import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "../ui/item"

import { foramatAPIEnum } from "@/lib/formatters";
import { Notification } from "@/types/messaging";
import { Mail } from "lucide-react";

const NotiItem = ({ noti, isLast }: { noti: Notification, isLast: boolean }) => {

  return (
    <Item variant="outline" size="sm">
      <ItemMedia>
        <Mail size={20}/>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{foramatAPIEnum(noti.type)}</ItemTitle>
        <ItemDescription>{noti.payload.message}</ItemDescription>
      </ItemContent>
      <ItemActions />
    </Item>
  )
}

export default NotiItem;