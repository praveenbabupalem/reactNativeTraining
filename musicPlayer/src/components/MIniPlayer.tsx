import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import TrackPlayer, {Track} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import {handlePlayPausePress} from '../handlePlayerActions';
import SongProgress from './SongProgress';

interface Props {
  currentTrack: Track;
  setOpenTracker: () => void;
  openTracker: boolean;
  playerStatus: string;
  setPlayerRate: () => void;
  playerRate: number;
}

export default class MiniPlayer extends Component<Props> {
  render() {
    const {
      openTracker,
      currentTrack,
      setOpenTracker,
      playerStatus,
      playerRate,
      setPlayerRate,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openTracker}
        onRequestClose={() => {
          setOpenTracker();
        }}>
        <SafeAreaView style={styles.mainContainer}>
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={this.props.setOpenTracker}>
              <Image
                style={styles.icon}
                source={require('../assets/downArrow.png')}
              />
            </TouchableOpacity>
            <Image
              style={styles.icon2}
              source={require('../assets/Group.png')}
            />
          </View>

          <LinearGradient
            style={styles.imgContainer}
            colors={['#18191900', '#18191999', '#181919']}>
            <ImageBackground
              blurRadius={5}
              style={styles.imgBackground}
              source={{
                uri: `${currentTrack.artwork}`,
              }}>
              <Image
                style={styles.img}
                source={{
                  uri: `${currentTrack.artwork}`,
                }}
              />
            </ImageBackground>
          </LinearGradient>
          <View style={{margin: 20}}>
            <Text style={styles.songTitle}>{currentTrack.title}</Text>
            <Text style={styles.songArtist}>By {currentTrack.artist}</Text>
            <SongProgress showTimer={true} />

            <View style={styles.controlsCont}>
              <TouchableOpacity
                onPress={async () => await TrackPlayer.skipToPrevious()}>
                <Image
                  style={styles.controls}
                  source={require('../assets/skipBackward.png')}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 27,
                }}>
                <TouchableOpacity
                  onPress={async () => await TrackPlayer.seekBy(-10)}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../assets/back10.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePlayPausePress()}>
                  <Image
                    style={{height: 60, width: 60}}
                    source={(() => {
                      switch (playerStatus) {
                        case 'playing':
                          return require('../assets/playing.png');
                        case 'buffering':
                          return require('../assets/Loading_2.gif');
                        default:
                          return require('../assets/paused.png');
                      }
                    })()}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => await TrackPlayer.seekBy(10)}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../assets/forward10.png')}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={async () => await TrackPlayer.skipToNext()}>
                <Image
                  style={styles.controls}
                  source={require('../assets/skipForward.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Image
                style={styles.controls}
                source={require('../assets/moon.png')}
              />
              <TouchableOpacity
                onPress={async () => {
                  const rate = await TrackPlayer.getRate();
                  rate === 1
                    ? await TrackPlayer.setRate(2)
                    : await TrackPlayer.setRate(1);
                 
                  setPlayerRate();
                }}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  {playerRate.toFixed(1)}x
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#181A1A',
  },
  controlsCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  controls: {
    height: 28,
    width: 28,
  },
  playProgress: {
    height: 7,
    backgroundColor: '#CDE7BE',
    borderRadius: 15,
    marginTop: 20,
  },

  navContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 10,
  },
  icon: {
    height: 12,
    width: 20,
  },
  icon2: {
    resizeMode: 'contain',
    width: 5,
    height: 20,
  },
  imgContainer: {
    height: '50%',
    backgroundColor: '#fff',
    marginTop: 20,
  },
  imgBackground: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: '70%',
    width: '50%',
    resizeMode: 'stretch',
  },
  songTitle: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#fff',
    fontSize: 17,
  },
});
