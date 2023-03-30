import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View , Dimensions} from 'react-native';
import MapView from 'react-native-maps';

import { Marker } from 'react-native-maps';
import * as Location from 'expo-location'

import { addPlace } from '../reducers/user';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';




export default function MapScreen() {

  const [mylocation, setMyLocation] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState('');

  console.log(mylocation)

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const city = user.places
  console.log(city)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            console.log(location)
            setMyLocation(location.coords)

          });

      }
    })();
  }, []);

  const handleLongPress = (e) => {
    setTempCoordinates(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleNewPlace = () => {
    dispatch(addPlace({ name: newPlace, latitude: tempCoordinates.latitude, longitude: tempCoordinates.longitude }));
    setModalVisible(false);
    setNewPlace('');
  };

  const handleClose = () => {
    setModalVisible(false);
    setNewPlace('');
  };

  const markers = user.places.map((data, i) => {
    return <Marker
      key={i}
      coordinate={{
        latitude: data.latitude,
        longitude: data.longitude
      }}

      title={data.name} />;
  });


  const places = city.map((ville, i) => {
    return (

      <Marker
        key={i}
        coordinate=
        {{
          latitude: ville.latitude,
          longitude: ville.longitude,
        }}

        title={ville.name}
        pinColor="red"
      />
    )
  })

  return (

    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="New place" onChangeText={(value) => setNewPlace(value)} value={newPlace} style={styles.input} />

            <TouchableOpacity onPress={() => handleNewPlace()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>


      < MapView
        onLongPress={(e) => handleLongPress(e)}
        mapType="hybrid" style={styles.map}>
        {mylocation &&
          <Marker coordinate={mylocation}
            title="My position" pinColor="#fecb2d" />}
        {markers}
      </MapView>

    </View>



  );



}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: '#ec6e5b',
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
});

