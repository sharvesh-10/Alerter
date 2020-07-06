import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  TextInput,
  Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitudes: 13.084678,
      longitudes: 80.182774,
      destlatitudes: 0.0,
      destlongitudes: 0.0,
      error: 'please allow location access',
      city: ' ',
      area: ' ',
      distance: 0,
    };
  }
  _getPreciseDistance = () => {
    var pdis = getPreciseDistance(
      { latitude: this.state.latitudes, longitude: this.state.longitudes },
      {
        latitude: this.state.destlatitudes,
        longitude: this.state.destlongitudes,
      },
    );
    alert(`Precise Distance\n${pdis} Meter\nor\n${pdis / 1000} KM`);
    this.setState({ distance: pdis / 1000 });
    setInterval(() => {
      this._getPreciseDistance();
    }, 60000);
    if (pdis < 1000) {
      Vibration.vibrate([600, 600, 600, 700], true);
    }
  };
  fetchdestination = () => {
    fetch(
      `https://us1.locationiq.com/v1/search.php?key=b1eae862a2ca65&q=${this.state.city}%20${this.state.area}&format=json`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          destlatitudes: responseJson[0].lat,
          destlongitudes: responseJson[0].lon,
        });
      })
      .catch((error) => console.log(error));
  };
  componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitudes: position.coords.latitude,
          longitudes: position.coords.longitude,
          error: '',
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: Infinity, maximumAge: Infinity },
    );
    Geolocation.watchPosition(
      (position) => {
        this.setState({
          latitudes: position.coords.latitude,
          longitudes: position.coords.longitude,
          error: '',
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true },
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={styles.textStyle}>
                Enter Your Destination Details
              </Text>
              <TextInput
                style={styles.textinput}
                placeholder="City"
                onChangeText={(text) => this.setState({ city: text })}
              />
              <Text />
              <TextInput
                style={styles.textinput}
                placeholder="Area"
                onChangeText={(text) => this.setState({ area: text })}
              />
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={() => {
                  this.fetchdestination();
                  alert('DESTINATION ADDED SUCCESS');
                }}>
                <Text>Add Destination</Text>
              </TouchableHighlight>
              <Text style={styles.textStyle}>
                Precise Distance between{'\n'}your location and Destination is
              </Text>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={() => {
                  this._getPreciseDistance();
                }}>
                <Text>Get Precise Distance</Text>
              </TouchableHighlight>
              <Text style={styles.textStyle}>
                Distance : {this.state.distance}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
  },
  textStyle: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    paddingVertical: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#dddddd',
    margin: 10,
  },
  textinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    paddingVertical: 10,
  },
});

export default App;

/* https://us1.locationiq.com/v1/reverse.php?key=YOUR_PRIVATE_TOKEN&lat=-37.870662&lon=144.9803321&format=json*/
/*https://maps.googleapis.com/maps/api/geocode/json?address=Chennai&key=AIzaSyCMc9EmaCIZsLX-MPUTyaoHMfBoP-EFg10*/
