import React, {Component, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from 'react-native-modal';

import Permissions, {
  request,
  PERMISSIONS,
  RESULTS,
  check,
} from 'react-native-permissions';

import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import Video from 'react-native-video';

interface ImageNode {
  id: string;
  image: {
    uri: string;
  };
  type: 'image' | 'video';
}

interface ItemProps {
  item: PhotoIdentifier;
  selections: PhotoIdentifier[];
  onSelectImage: (selectedItem: PhotoIdentifier) => void;
}

interface UploadScreenState {
  modalVisible: boolean;
  media: PhotoIdentifier[];
  selectedItems: PhotoIdentifier[];
  visibleCarousel: boolean;
  index: number;
}

const Item: React.FC<ItemProps> = ({item, selections, onSelectImage}) => {
  const isSelected = selections.some(
    selectedItem => selectedItem.node.id === item.node.id,
  );

  return (
    <View>
      <TouchableOpacity onPress={() => onSelectImage(item)}>
        {isSelected && <Text style={styles.tickContainer}>✓</Text>}
        <Image
          style={styles.images}
          height={85}
          width={85}
          source={{
            uri: item?.node?.image?.uri,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const SLIDER_WIDTH = Dimensions.get('screen').width - 60;
const ITEM_WIDTH = SLIDER_WIDTH;

const CarouselCardItem: React.FC<{item: PhotoIdentifier; index: number}> = ({
  item,
  index,
}) => {
  return (
    <View key={index}>
      {item.node.type === 'image' ? (
        <Image source={{uri: item.node.image.uri}} style={styles.image} />
      ) : (
        <Video
          playInBackground={false}
          controls
          source={{uri: item.node.image.uri}}
          paused={false}
          style={styles.backgroundVideo}
          repeat={true}
        />
      )}
    </View>
  );
};

class UploadScreen extends Component<{}, UploadScreenState> {
  private isCarousel = React.createRef<Carousel<PhotoIdentifier>>();
  constructor(props: {}) {
    super(props);

    this.state = {
      modalVisible: false,
      media: [],
      selectedItems: [],
      visibleCarousel: false,
      index: 0,
    };
  }

  onSelectImage = (selectedItem: PhotoIdentifier) => {
    const {selectedItems} = this.state;
    const newId = selectedItem.node.id;

    const itemExists = selectedItems.some(item => item.node.id === newId);

    if (selectedItems.length === 5 && !itemExists) {
      Alert.alert('You can select max. 5');
    }

    if (!itemExists && selectedItems.length < 5) {
      this.setState(prevState => ({
        selectedItems: [...prevState.selectedItems, selectedItem],
      }));
    } else if (itemExists) {
      this.setState(prevState => ({
        selectedItems: prevState.selectedItems.filter(
          item => item.node.id !== newId,
        ),
      }));
    }
  };

  fetchPhotos = async () => {
    const res = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
    });

    this.setState({media: res.edges});
  };

  checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permission === RESULTS.GRANTED || permission === RESULTS.LIMITED) {
        await this.fetchPhotos();
        this.setState({modalVisible: true});
        return;
      }

      const res = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
        await this.fetchPhotos();
        this.setState({modalVisible: true});
      }
      if (res === RESULTS.BLOCKED) {
        Alert.alert('open Settings');
      }
    } else {
      if (parseInt(Platform.Version as string, 10) >= 33) {
        const permissions = await Permissions.checkMultiple([
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]);

        if (
          permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
            Permissions.RESULTS.GRANTED &&
          permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
            Permissions.RESULTS.GRANTED
        ) {
          this.fetchPhotos();
          this.setState({modalVisible: true});
          return;
        }
        const res = await Permissions.requestMultiple([
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]);
        if (
          res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
            Permissions.RESULTS.GRANTED &&
          res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
            Permissions.RESULTS.GRANTED
        ) {
          this.fetchPhotos();
          this.setState({modalVisible: true});
        }
        if (
          res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
            Permissions.RESULTS.DENIED ||
          res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
            Permissions.RESULTS.DENIED
        ) {
          this.fetchPhotos();
          this.setState({modalVisible: true});
        }
        if (
          res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
            Permissions.RESULTS.BLOCKED ||
          res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
            Permissions.RESULTS.BLOCKED
        ) {
          Alert.alert(
            'Please allow access to your photos and videos from settings',
          );
        }
      } else {
        const permission = await Permissions.check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (permission === Permissions.RESULTS.GRANTED) {
          this.fetchPhotos();
          return;
        }
        const res = await Permissions.request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (res === Permissions.RESULTS.GRANTED) {
          this.fetchPhotos();
        }
        if (res === Permissions.RESULTS.DENIED) {
          this.fetchPhotos();
        }
        if (res === Permissions.RESULTS.BLOCKED) {
          Alert.alert('Please allow access to the photo library from settings');
        }
      }
    }
  };

  render() {
    const {modalVisible, media, selectedItems, visibleCarousel} = this.state;
    return (
      <SafeAreaView>
        <View style={styles.mainConatiner}>
          <Text style={styles.header}>Upload Media</Text>
          <Text style={{marginTop: 10}}>
            You Can Upload Photos, Videos and Gifs, You can upload the files
            from your gallery
          </Text>
          {visibleCarousel ? (
            <View style={styles.container}>
              <Carousel
                vertical={false}
                layout="default"
                layoutCardOffset={9}
                ref={this.isCarousel}
                data={selectedItems}
                renderItem={CarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                inactiveSlideShift={0}
                useScrollView={true}
                onSnapToItem={index => this.setState({index: index})}
              />
              <Pagination
                dotsLength={selectedItems.length}
                activeDotIndex={this.state.index}
                carouselRef={this.isCarousel}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)',
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
              />
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() =>
                  this.setState({visibleCarousel: false, modalVisible: true})
                }>
                <Text style={styles.btnText}>Change Media</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => {
                  this.checkPermissions();
                }}>
                <Text style={styles.btnText}>Upload Media</Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal
            style={{margin: 0}}
            isVisible={modalVisible}
            onBackdropPress={() => this.setState({modalVisible: false})}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.header}>Upload from media</Text>
                <TouchableOpacity
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text style={styles.header}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.imgContainer}>
                {media && (
                  <FlatList
                    data={media}
                    numColumns={4}
                    renderItem={({item}) => (
                      <Item
                        item={item}
                        selections={selectedItems}
                        onSelectImage={this.onSelectImage}
                      />
                    )}
                    keyExtractor={item => item?.node?.image?.uri}
                  />
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                selectedItems.length > 0 &&
                this.setState({visibleCarousel: true, modalVisible: false})
              }
              style={
                selectedItems.length > 0
                  ? [styles.button, {backgroundColor: '#ff7800'}]
                  : styles.button
              }>
              <Text style={styles.btnText}>Upload</Text>
            </TouchableOpacity>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

export default UploadScreen;

const styles = StyleSheet.create({
  mainConatiner: {
    padding: 30,
    backgroundColor: 'whitesmoke',
    height: '100%',
  },
  uploadContainer: {
    backgroundColor: '#d3d3d5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: '20%',
    borderStyle: 'dashed',
    borderWidth: 0.6,
    borderColor: 'grey',
  },
  uploadBtn: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 11,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    height: '50%',
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    margin: 20,
  },

  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#cbd5e0',
    width: 300,
    padding: 15,
    borderRadius: 25,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  imgContainer: {
    paddingLeft: 20,
    height: '63%',
  },
  images: {
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tickContainer: {
    backgroundColor: '#ff7800',
    width: 20,
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1000,
  },

  container: {
    borderRadius: 8,
    width: ITEM_WIDTH,
    justifyContent: 'center',
    marginTop: 50,
  },
  image: {
    width: ITEM_WIDTH,
    height: 250,
    resizeMode: 'stretch',
    borderRadius: 20,
  },
  changeBtn: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 11,
    width: 140,
    alignSelf: 'center',
    marginTop: 30,
  },
  backgroundVideo: {
    width: ITEM_WIDTH,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 20,
  },
});
