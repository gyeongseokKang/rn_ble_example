import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BleManager } from "react-native-ble-plx";

export const manager = new BleManager();

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [connectedDevices, setConnectedDevices] = useState<any>([]);

  useEffect(() => {
    requestLocationPermission();

    manager.onStateChange((state) => {
      console.log("state", state);
    });

    manager.connectToDevice;

    return () => {
      manager.destroy();
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }
      if (device) {
        setDevices((prevDevices: any) => {
          if (prevDevices.find((d: any) => d.id === device.id)) {
            return prevDevices;
          }
          return [...prevDevices, device];
        });
      }
    });
  };

  const stopScan = () => {
    setIsScanning(false);
    setDevices([]);
    manager.stopDeviceScan();
  };

  const connectToDevice = async (device: any) => {
    try {
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDevice);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on app!</Text>
      {isScanning ? (
        <Button title="Stop Scanning" onPress={stopScan} />
      ) : (
        <Button title="Scan Bluetooth Devices" onPress={startScan} />
      )}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: any }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text>
              {item.name || "이름없음"} | {item.id}
            </Text>
            {item.isConnectable ? (
              <Button title="연결하기" onPress={() => connectToDevice(item)} />
            ) : (
              <Button title="연결불가" disabled />
            )}
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Location permission for bluetooth scanning",
        message: "wahtever",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    const granted2 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location permission for bluetooth scanning",
        message: "wahtever",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    const granted3 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location permission for bluetooth scanning",
        message: "wahtever",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission for bluetooth scanning granted");
      return true;
    } else {
      console.log("Location permission for bluetooth scanning revoked");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
