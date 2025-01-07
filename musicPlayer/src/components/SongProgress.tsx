import Slider from '@react-native-community/slider';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';

export default function SongProgress({showTimer}: {showTimer: boolean}) {
  const {position, duration} = useProgress();

  const format = (seconds: number) => {
    const min = parseInt((seconds / 60).toString())
      .toString()
      .padStart(1, '0');
    const sec = Math.trunc(seconds % 60)
      .toString()
      .padStart(2, '0');

    return min + ':' + sec;
  };

  return (
    <View style={{width: '100%'}}>
      <Slider
        //style={{transform: [{scaleY: 0.5}]}}
        style={{width: '104%', marginHorizontal: -10}}
        minimumValue={0}
        maximumValue={duration}
        minimumTrackTintColor="#CDE7BE"
        tapToSeek
        maximumTrackTintColor="grey"
        thumbTintColor="transparent"
        value={position}
        onValueChange={async value => {
          await TrackPlayer.seekTo(value);
        }}
      />
      {showTimer && (
        <View style={styles.timerContainer}>
          <Text style={styles.time}>{format(position)}</Text>
          <Text style={styles.time}>-{format(duration - position)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  time: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
