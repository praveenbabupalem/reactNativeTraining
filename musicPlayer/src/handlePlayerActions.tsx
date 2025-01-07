import TrackPlayer, { State } from "react-native-track-player";


export const  handlePlayPausePress = async () => {
    console.log('handlePlayPausePress');
    const state = await TrackPlayer.getState();

    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };