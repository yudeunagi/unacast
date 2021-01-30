interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface MessageText {
  text: string;
  navigationEndpoint?: {
    clickTrackingParams: string;
    commandMetadata: {
      webCommandMetadata: {
        url: string;
        rootVe: number;
      };
    };
    urlEndpoint: {
      url: string;
      target: string;
      nofollow: boolean;
    };
  };
}

interface MessageEmoji {
  emoji: {
    emojiId: string;
    shortcuts: string[];
    searchTerms: string[];
    image: {
      thumbnails: Thumbnail[];
      accessibility: {
        accessibilityData: {
          label: string;
        };
      };
    };
    isCustomEmoji: true;
  };
}

type MessageRun = MessageText | MessageEmoji;

interface AuthorBadge {
  liveChatAuthorBadgeRenderer: {
    customThumbnail?: {
      thumbnails: Thumbnail[];
    };
    icon?: {
      iconType: string;
    };
    tooltip: string;
    accessibility: {
      accessibilityData: {
        label: string;
      };
    };
  };
}

interface MessageRendererBase {
  authorName: {
    simpleText: string;
  };
  authorPhoto: {
    thumbnails: Thumbnail[];
  };
  authorBadges?: AuthorBadge[];
  contextMenuEndpoint: {
    clickTrackingParams: string;
    commandMetadata: {
      webCommandMetadata: {
        ignoreNavigation: true;
      };
    };
    liveChatItemContextMenuEndpoint: {
      params: string;
    };
  };
  id: string;
  timestampUsec: string;
  authorExternalChannelId: string;
  contextMenuAccessibility: {
    accessibilityData: {
      label: string;
    };
  };
}

interface LiveChatTextMessageRenderer extends MessageRendererBase {
  message: {
    runs: MessageRun[];
  };
}

interface LiveChatPaidMessageRenderer extends LiveChatTextMessageRenderer {
  purchaseAmountText: {
    simpleText: string;
  };
  headerBackgroundColor: number;
  headerTextColor: number;
  bodyBackgroundColor: number;
  bodyTextColor: number;
  authorNameTextColor: number;
}

interface LiveChatPaidStickerRenderer extends MessageRendererBase {
  purchaseAmountText: {
    simpleText: string;
  };
  sticker: {
    thumbnails: Thumbnail[];
    accessibility: {
      accessibilityData: {
        label: string;
      };
    };
  };
  moneyChipBackgroundColor: number;
  moneyChipTextColor: number;
  stickerDisplayWidth: number;
  stickerDisplayHeight: number;
  backgroundColor: number;
  authorNameTextColor: number;
}

interface LiveChatMembershipItemRenderer extends MessageRendererBase {
  headerSubtext: {
    runs: MessageRun[];
  };
  authorBadges: AuthorBadge[];
}

interface ActionItem {
  item: {
    liveChatTextMessageRenderer?: LiveChatTextMessageRenderer;
    liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer;
    liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer;
    liveChatPaidStickerRenderer?: LiveChatPaidStickerRenderer;
  };
  clientId: string;
}

interface Action {
  addChatItemAction?: ActionItem;
  addLiveChatTickerItemAction?: any;
}

interface GetLiveChatResponse {
  responseContext: {
    serviceTrackingParams: {
      service: string;
      params: {
        key: string;
        value: string;
      }[];
    }[];
    mainAppWebResponseContext: {
      loggedOut: boolean;
    };
    webResponseContextExtensionData: {
      hasDecorated: boolean;
    };
  };
  continuationContents: {
    liveChatContinuation: {
      continuations: [
        {
          invalidationContinuationData?: {
            invalidationId: {
              objectSource: number;
              objectId: string;
              topic: string;
              subscribeToGcmTopics: boolean;
              protoCreationTimestampMs: string;
            };
            timeoutMs: number;
            /** 次のコメント取得リクエストの時に含めるID */
            continuation: string;
          };
          timedContinuationData?: {
            timeoutMs: number;
            continuation: string;
          };
        },
      ];
      actions?: Action[];
    };
  };
}

interface GetLiveChageRequestBody {
  context: {
    client: {
      clientName: string;
      clientVersion: string;
      timeZone: 'Asia/Tokyo';
      utcOffsetMinutes: 540;
      mainAppWebInfo: {
        /** @example 'https://www.youtube.com/live_chat?continuation=${continuation}' */
        graftUrl: string;
      };
    };
    request: {
      useSsl: true;
    };
  };
  continuation: string;
}
