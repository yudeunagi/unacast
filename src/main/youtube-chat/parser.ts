export interface ImageItem {
  url: string;
  alt: string;
  width: number;
  height: number;
}

type MessageItem = { text: string } | ImageItem;

export interface CommentItem {
  id: string;
  author: {
    name: string;
    thumbnail?: ImageItem;
    channelId: string;
    badge?: {
      thumbnail: ImageItem;
      label: string;
    };
  };
  message: MessageItem[];
  superchat?: {
    amount: string;
    color: number;
    sticker?: ImageItem;
  };
  membership: boolean;
  isOwner: boolean;
  timestamp: number;
}

const parseThumbnailToImageItem = (data: Thumbnail[], alt: string): ImageItem | undefined => {
  const thumbnail = data.pop();
  if (thumbnail) {
    return {
      url: thumbnail.url,
      width: thumbnail.width!,
      height: thumbnail.height!,
      alt: alt,
    };
  }
  return;
};

const parseEmojiToImageItem = (data: MessageEmoji): ImageItem | undefined => {
  return parseThumbnailToImageItem(data.emoji.image.thumbnails, data.emoji.shortcuts.shift()!);
};

const parseMessages = (runs: MessageRun[]): MessageItem[] => {
  return runs.map((run: MessageRun) => {
    if ('text' in run) {
      if (run?.navigationEndpoint?.urlEndpoint.url) {
        const tubeUrl = run.navigationEndpoint.urlEndpoint.url.replace(/^\/redirect\?/, '');
        // console.log(tubeUrl);
        const parsed = tubeUrl.split('&').filter((str) => str.match(/^q=/));
        const orgUrl = decodeURIComponent(parsed[0].replace(/^q=/, ''));

        // console.log(orgUrl);
        return { text: orgUrl };
      } else {
        return run;
      }
    } else {
      // 絵文字を画像に置換
      return parseEmojiToImageItem(run)!;
    }
  });
};

export const actionToRenderer = (
  action: Action,
): LiveChatTextMessageRenderer | LiveChatPaidMessageRenderer | LiveChatPaidStickerRenderer | LiveChatMembershipItemRenderer | null => {
  if (!action.addChatItemAction) {
    return null;
  }
  const item = action.addChatItemAction.item;
  if (item.liveChatTextMessageRenderer) {
    return item.liveChatTextMessageRenderer;
  } else if (item.liveChatPaidMessageRenderer) {
    return item.liveChatPaidMessageRenderer;
  } else if (item.liveChatPaidStickerRenderer) {
    return item.liveChatPaidStickerRenderer;
  } else {
    return item.liveChatMembershipItemRenderer!;
  }
};

export const usecToTime = (usec: string): number => {
  return Math.floor(Number(usec) / 1000);
};

export const parseData = (data: Action): CommentItem | null => {
  const messageRenderer = actionToRenderer(data);
  if (messageRenderer === null) {
    return null;
  }
  let message: MessageRun[] = [];
  if ('message' in messageRenderer) {
    message = messageRenderer.message.runs;
  } else if ('headerSubtext' in messageRenderer) {
    message = messageRenderer.headerSubtext.runs;
  }

  const ret: CommentItem = {
    id: messageRenderer.id,
    author: {
      name: messageRenderer.authorName.simpleText,
      thumbnail: parseThumbnailToImageItem(messageRenderer.authorPhoto.thumbnails, messageRenderer.authorName.simpleText),
      channelId: messageRenderer.authorExternalChannelId,
    },
    message: parseMessages(message),
    membership: Boolean('headerSubtext' in messageRenderer),
    isOwner: false,
    timestamp: usecToTime(messageRenderer.timestampUsec),
  };

  if (messageRenderer.authorBadges) {
    const badge = messageRenderer.authorBadges[0].liveChatAuthorBadgeRenderer;
    if (badge.customThumbnail) {
      ret.author.badge = {
        thumbnail: parseThumbnailToImageItem(badge.customThumbnail.thumbnails, badge.tooltip)!,
        label: badge.tooltip,
      };
    } else {
      ret.isOwner = true;
    }
  }

  if ('sticker' in messageRenderer) {
    ret.superchat = {
      amount: messageRenderer.purchaseAmountText.simpleText,
      color: messageRenderer.backgroundColor,
      sticker: parseThumbnailToImageItem(messageRenderer.sticker.thumbnails, messageRenderer.sticker.accessibility.accessibilityData.label),
    };
  } else if ('purchaseAmountText' in messageRenderer) {
    ret.superchat = {
      amount: messageRenderer.purchaseAmountText.simpleText,
      color: messageRenderer.bodyBackgroundColor,
    };
  }

  return ret;
};
