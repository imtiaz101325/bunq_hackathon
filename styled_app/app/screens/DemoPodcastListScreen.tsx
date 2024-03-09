import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import {
  Button,
  ButtonAccessoryProps,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  Text,
  Toggle,
} from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
// import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
// import { openLinkInBrowser } from "../utils/openLinkInBrowser"

import subs from "./subs.json"

const ICON_SIZE = 14

const rnrImage1 = require("../../assets/images/demo/rnr-image-1.png")
const rnrImage2 = require("../../assets/images/demo/rnr-image-2.png")
const rnrImage3 = require("../../assets/images/demo/rnr-image-3.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

interface Recommendation {
  PENDING: number
  SKIPPED: number
  NOT_RECOMMENDED: number
  RECOMMENDED_UNCATEGORIZED: number
  RECOMMENDED_FOR_BUSINESS: number
  RECOMMENDED_FOR_FAMILY: number
  RECOMMENDED_FOR_DATE: number
  RECOMMENDED_FOR_MYSELF: number
  RECOMMENDED_FOR_FRIENDS: number
}

interface Friend {
  name: string
  type: string
  count: number
  id: string
}

interface CategoriesFriends {
  PENDING: any[]
  SKIPPED: any[]
  NOT_RECOMMENDED: any[]
  RECOMMENDED_UNCATEGORIZED: any[]
  RECOMMENDED_FOR_BUSINESS: any[]
  RECOMMENDED_FOR_FAMILY: Friend[]
  RECOMMENDED_FOR_DATE: Friend[]
  RECOMMENDED_FOR_MYSELF: Friend[]
  RECOMMENDED_FOR_FRIENDS: Friend[]
}

interface Subscriptions {
  event_id: string
  transaction_description: string
  transaction_type: string
  iban: string
  counterparty_name: string
  counterparty_iban: null | string
  amount: number
  currency: string
  transaction_subtype: string
  monetary_account_id: number
  updated_timestamp: string
  place_name: string
  place_address: string
  category: string
  geolocation_latitude: null | number
  geolocation_longitude: null | number
  geolocation_altitude: null | number
  geolocation_radius: null | number
  user_type: string
  merchant_category_code: string
  tags: string
  opening_periods: null
  number_of_recommendation_total: null | number
  recommendations_category: Recommendation
  categories_friends: CategoriesFriends
  url_google_maps: string
  city: string
  country: string
  event_type: string
  inner_id: string
  owner_user_id: number
  ".transaction_subtype": null | string
  transaction_subnetype: null | string
  counterparty_ibank: null | string
  eventType: null | string
  counterparty_ibn: null | string
}

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { episodeStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await episodeStore.fetchEpisodes()
        setIsLoading(false)
      })()
    }, [episodeStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([episodeStore.fetchEpisodes(), delay(750)])
      setRefreshing(false)
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ListView<Subscriptions>
          contentContainerStyle={$listContentContainer}
          data={subs}
          extraData={episodeStore.favorites.length + episodeStore.episodes.length}
          refreshing={refreshing}
          estimatedItemSize={177}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx={
                  episodeStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.heading"
                    : undefined
                }
                contentTx={
                  episodeStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.content"
                    : undefined
                }
                button={episodeStore.favoritesOnly ? "" : undefined}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoPodcastListScreen.title" />
            </View>
          }
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              // isFavorite={episodeStore.hasFavorite(item)}
              // onPressFavorite={() => episodeStore.toggleFavorite(item)}
            />
          )}
        />
      </Screen>
    )
  },
)

const EpisodeCard = observer(function EpisodeCard({
  episode,
}: // isFavoris
{
  episode: Subscriptions
  // onPressFavorite: () => void
  // isFavorite: boolean
}) {
  // const liked = useSharedValue(isFavorite ? 1 : 0)

  const imageUri = useMemo<ImageSourcePropType>(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)]
  }, [])

  // Grey heart
  // const animatedLikeButtonStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
  //       },
  //     ],
  //     opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
  //   }
  // })

  // Pink heart
  // const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: liked.value,
  //       },
  //     ],
  //     opacity: liked.value,
  //   }
  // })

  // /**
  //  * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
  //  * @see https://reactnative.dev/docs/accessibility#accessibilityactions
  //  */
  // const accessibilityHintProps = useMemo(
  //   () =>
  //     Platform.select<AccessibilityProps>({
  //       ios: {
  //         accessibilityLabel: episode.counterparty_name,
  //         accessibilityHint: translate("demoPodcastListScreen.accessibility.cardHint", {
  //           action: isFavorite ? "unfavorite" : "favorite",
  //         }),
  //       },
  //       android: {
  //         accessibilityLabel: episode.title,
  //         accessibilityActions: [
  //           {
  //             name: "longpress",
  //             label: translate("demoPodcastListScreen.accessibility.favoriteAction"),
  //           },
  //         ],
  //         onAccessibilityAction: ({ nativeEvent }) => {
  //           if (nativeEvent.actionName === "longpress") {
  //             handlePressFavorite()
  //           }
  //         },
  //       },
  //     }),
  //   [episode, isFavorite],
  // )

  // const handlePressFavorite = () => {
  //   onPressFavorite()
  //   liked.value = withSpring(liked.value ? 0 : 1)
  // }

  const handlePressCard = () => {
    // openLinkInBrowser(episode.enclosure.link)
  }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      // onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
            // accessibilityLabel={episode.datePublished.accessibilityLabel}
          >
            {episode.counterparty_name.length > 20
              ? episode.counterparty_name.slice(0, 20) + "..."
              : episode.counterparty_name}
          </Text>
          <Text
            style={$metadataText}
            size="xxs"
            // accessibilityLabel={episode.duration.accessibilityLabel}
          > 
            {new Date(episode.updated_timestamp).toLocaleDateString()}
          </Text>
        </View>
      }
      content={episode.transaction_description}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.sm,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
