import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TrackPlayer, {
  Track,
  State,
  isPlaying,
  Event,
} from 'react-native-track-player';

import {setupPlayer, addTracks} from '../trackPlayerServices';
import PlaylistItem from './components/PlaylistItem';

import MiniPlayer from './components/MIniPlayer';
import {songsData} from './SongsData';
import {handlePlayPausePress} from './handlePlayerActions';
import SongProgress from './components/SongProgress';

interface Props {}
interface StateI {
  isPlayerReady: boolean;
  openTracker: boolean;
  currentTrack: Track;
  playerStatus: string;
  playerRate: number;
}
export default class MusicHome extends Component<Props, StateI> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPlayerReady: false,
      openTracker: false,
      playerStatus: 'paused',
      playerRate: 1.0,
      currentTrack: {
        title: 'Death Bed',
        artist: 'Powfu',
        artwork: 'https://samplesongs.netlify.app/album-arts/death-bed.jpg',
        url: 'https://samplesongs.netlify.app/Death%20Bed.mp3',
        id: '1',
        duration: 10,
      },
    };
  }

  setCurrentTrack = (item: Track) => {
    this.setState({currentTrack: item});
  };
  setOpenTracker = () => {
    this.setState(prevState => ({openTracker: !prevState.openTracker}));
  };

  setPlayerStatus = (value: string) => {
    this.setState({playerStatus: value});
  };
  setPlayerRate = () => {
    const {playerRate} = this.state;
    this.setState({playerRate: playerRate === 1.0 ? 2.0 : 1.0});
  };

  componentDidMount(): void {
    TrackPlayer.addEventListener(Event.PlaybackState, event => {
      this.setPlayerStatus(event.state);
    });

    const setup = async () => {
      let isSetup = await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      this.setState({
        isPlayerReady: isSetup,
      });
    };

    setup();
  }
  render() {
    const {currentTrack, playerStatus, isPlayerReady, playerRate} = this.state;

    if (!isPlayerReady) {
      return (
        <SafeAreaView
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator size="large" color="red" />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#181A1A'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MiniPlayer
            currentTrack={currentTrack}
            setOpenTracker={this.setOpenTracker}
            openTracker={this.state.openTracker}
            playerStatus={this.state.playerStatus}
            playerRate={playerRate}
            setPlayerRate={this.setPlayerRate}
          />
          <View style={styles.container}>
            <View style={styles.greetingCont}>
              <Text style={styles.greeting}>Good Afternoon</Text>
              <Image
                style={styles.profileImg}
                source={require('./assets/profileImage.png')}
              />
              <Image
                style={[styles.profileImg, styles.vector]}
                source={require('./assets/Vector1.png')}
              />
            </View>
            <View style={styles.offerCont}>
              <Image
                source={require('./assets/offerImg.png')}
                style={{width: '100%'}}
              />
            </View>

            <View style={[styles.greetingCont, {marginBottom: 0}]}>
              <Text style={styles.greeting}>Trending</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={styles.showAll}>Show all</Text>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('./assets/forwardArrow.png')}
                />
              </View>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              indicatorStyle="white"
              contentContainerStyle={styles.flatList}
              data={songsData}
              renderItem={({item, index}) => (
                <PlaylistItem
                  item={item}
                  currentTrack={this.state.currentTrack}
                  setCurrentTrack={this.setCurrentTrack}
                  setOpenTracker={this.setOpenTracker}
                  playerStatus={this.state.playerStatus}
                />
              )}
              keyExtractor={item => item.id}
            />

            <>
              <SongProgress showTimer={false} />
              <TouchableOpacity
                onPress={this.setOpenTracker}
                style={styles.playerCont}>
                <Image
                  style={{height: 80, width: 60}}
                  source={{uri: `${currentTrack.artwork}`}}
                />
                <View style={{justifyContent: 'center', margin: 20}}>
                  <Text style={styles.title}>{currentTrack.title}</Text>
                  <Text style={styles.artist}>{currentTrack.artist}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'flex-end',
                    position: 'absolute',
                    right: 35,
                    gap: 10,
                  }}>
                  <TouchableOpacity onPress={() => handlePlayPausePress()}>
                    <Image
                      style={styles.playBtn}
                      source={(() => {
                        switch (playerStatus) {
                          case 'playing':
                            return require('./assets/playing.png');
                          case 'paused':
                          case 'ready':
                            return require('./assets/paused.png');
                          default:
                            return require('./assets/Loading_2.gif');
                        }
                      })()}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => await TrackPlayer.seekBy(10)}>
                    <Image
                      style={styles.playBtn}
                      source={require('./assets/forward.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A1A',
  },
  playBtn: {height: 45, width: 45},
  title: {color: '#CDE7BE', fontWeight: 'bold', fontSize: 20},
  artist: {color: '#fff', fontSize: 16},
  playProgress: {
    height: 2,
    backgroundColor: '#CDE7BE',
    marginTop: 20,
    width: '100%',
  },
  playerCont: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    alignItems: 'center',
    width: '100%',
  },
  greetingCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
  greeting: {color: '#fff', fontSize: 23, fontWeight: 'bold'},
  profileImg: {},
  vector: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    width: 50,
    resizeMode: 'stretch',
  },
  offerCont: {marginLeft: 20, marginRight: 20},
  showAll: {color: '#fff', fontSize: 17},
  flatList: {
    margin: 20,
    rowGap: 15,
    paddingRight: 30,
  },
});
