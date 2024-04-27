import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '@themes/globalStyles';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '@redux/hooks';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@themes/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '@navigators/AppNavigator';
import {FlashList} from '@shopify/flash-list';
import {PlayButton} from '@components/atoms/PlayButton';
import {BackCircleButton} from '@components/atoms/BackCircleButton';
import {LoveCircleButton} from '@components/atoms/LoveCircleButton';

const {width, height} = Dimensions.get('screen');
const bannerHeight = height / 1.8;

export const AnimeDetailView = () => {
  const navigation = useNavigation<StackNavigation>();
  const data = useAppSelector(state => state.ViewDetail).data as AnimeData;

  let details: string[] = [];

  if (data.rating) details.push(data.rating);
  if (data.score) details.push(String(data.score));
  if (data.year) details.push(String(data.year));

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={globalStyles.containerBase}>
      <View style={styles.backgroundImg}>
        <FastImage
          style={styles.imgSize}
          source={{
            uri: data.images.jpg.image_url,
            priority: FastImage.priority.normal,
            cache: 'immutable',
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <LinearGradient
          colors={['rgba(252, 252, 252, 0)', colors.background]}
          style={styles.overlay}
        />
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.flex1}>
          <BackCircleButton onPress={() => navigation.navigate('Root')} />
        </View>
        <LoveCircleButton onPress={() => navigation.navigate('Root')} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: bannerHeight - 100}} />
        <View style={styles.contentWrapper}>
          <View style={styles.contentHeader}>
            <View style={styles.flex1}>
              <Text style={styles.title}>{data.title}</Text>
              {details.map(item => (
                <Text key={item} style={styles.detailText}>
                  {item}
                </Text>
              ))}
            </View>
            {data.url && <PlayButton onPress={() => openURL(data.url)} />}
          </View>
          <Text style={styles.synopisText}>{data.synopsis}</Text>
          {data.genres && (
            <View style={styles.genreContainer}>
              <FlashList
                data={data.genres}
                keyExtractor={item => item.mal_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: 10}} />
                )}
                renderItem={({item}) => (
                  <View style={styles.genreBox}>
                    <Text style={styles.genreText}>{item.name}</Text>
                  </View>
                )}
                estimatedItemSize={100}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  backgroundImg: {position: 'absolute', zIndex: 0},
  imgSize: {height: bannerHeight, width},
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: 32,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: bannerHeight / 6,
    bottom: 0,
  },
  contentWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 20,
  },
  contentHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.palette.neutral900,
    fontSize: 32,
    fontWeight: '900',
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  genreBox: {
    width: 100,
    padding: 5,
    paddingHorizontal: 5,
    backgroundColor: colors.palette.primary600,
    borderRadius: 5,
  },
  genreText: {textAlign: 'center', color: 'white'},
  synopisText: {color: colors.palette.neutral900, fontSize: 14},
  detailText: {
    color: colors.palette.neutral900,
    fontSize: 14,
  },
});