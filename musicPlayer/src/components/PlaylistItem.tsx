import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import TrackPlayer, {Event, Track} from 'react-native-track-player';

interface Props {
  item: Track;
  currentTrack: Track;
  playerStatus: string;
  setCurrentTrack: (item: Track) => void;
  setOpenTracker: () => void;
}

import {State} from 'react-native-track-player';

const sw = Dimensions.get('screen').width;

export default class PlaylistItem extends Component<Props> {
  handleItemPress = async () => {
    const state = await TrackPlayer.getState();
    const {item, currentTrack} = this.props;

    const queue = await TrackPlayer.getQueue();
    const inQueue = queue.some(eachTrack => eachTrack.id === item.id);

    const isPlaying = () => {
      return state === State.Playing;
    };

    const isCurrentTrack = () => {
      return item.id === currentTrack.id;
    };

    const getIndex = async () => {
      return (await TrackPlayer.getQueue()).findIndex(
        eachTrack => eachTrack.id === item.id,
      );
    };

    if (inQueue) {
      if (isPlaying()) {
        if (isCurrentTrack()) {
          await TrackPlayer.pause();
        } else {
          const index = await getIndex();
          index !== -1 && (await TrackPlayer.skip(index));
        }
      } else {
        if (isCurrentTrack()) {
          TrackPlayer.play();
        } else {
          const index = await getIndex();
          index !== -1 && (await TrackPlayer.skip(index));
          TrackPlayer.play();
        }
      }
    } else {
      await TrackPlayer.add(item);
      const index = await getIndex();
      if (isPlaying()) {
        await TrackPlayer.skip(index);
      } else {
        await TrackPlayer.skip(index);
        TrackPlayer.play();
      }
    }
  };
  componentDidMount(): void {
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, event => {
      event.track && this.props.setCurrentTrack(event.track);
    });
  }

  render() {
    const {item, playerStatus} = this.props;
    const isCurrent = this.props.currentTrack.id == this.props.item.id;

    return (
      <View style={styles.playerItemCont}>
        <View>
          <Image
            style={styles.image}
            source={{
              uri: `${item.artwork}`,
            }}
          />
          <TouchableOpacity
            style={{position: 'absolute', bottom: 5, right: 5}}
            onPress={this.handleItemPress}>
            <Image
              style={{height: 40, width: 40}}
              source={
                !isCurrent
                  ? require('../assets/paused.png')
                  : (() => {
                      switch (playerStatus) {
                        case 'playing':
                          return require('../assets/playing.png');
                        case 'buffering':
                          return require('../assets/Loading_2.gif');
                        default:
                          return require('../assets/paused.png');
                      }
                    })()
              }
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerItemCont: {
    width: sw / 2 - 60,
    marginRight: 15,
  },
  image: {
    height: 230,
    width: '100%',
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 10,
  },
  songArtist: {
    color: '#fff',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
