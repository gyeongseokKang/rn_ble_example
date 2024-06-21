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

import { Buffer } from "buffer";
import { BleManager, Device } from "react-native-ble-plx";

export const manager = new BleManager();

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [characteristics, setCharacteristics] = useState<any>([]);

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
      const aaaa =
        await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDevice);

      const services = await device.services();
      const characteristicsList = [];

      for (const service of services) {
        const characteristics = await device.characteristicsForService(
          service.uuid
        );
        for (const characteristic of characteristics) {
          characteristicsList.push({
            serviceUUID: service.uuid,
            characteristicUUID: characteristic.uuid,
          });
        }
      }
      setCharacteristics(characteristicsList);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribeToCharacteristic = async (
    device: Device,
    characteristicUUID: string
  ) => {
    if (device) {
      const response = await device.monitorCharacteristicForService(
        "30300001-5365-6964-6461-63676E697773",
        characteristicUUID,
        (error: any, characteristic: any) => {
          if (error) {
            console.error("Error monitoring characteristic:", error.message);
            return;
          }

          if (characteristic && characteristic.value) {
            // Raw base64 data
            const base64Data = characteristic.value;
            console.log(`Base64 data: ${base64Data}`);

            // Attempt to decode as base64
            const buffer = Buffer.from(base64Data, "base64");

            // Log the raw buffer data
            console.log(`Raw buffer data: ${buffer}`);

            // Convert to ASCII or other encoding if appropriate
            const data = buffer.toString("ascii");
            console.log(`Received data (ASCII): ${data}`);

            // Try interpreting as other encodings if needed
            // const dataUtf8 = buffer.toString("utf8");
            // console.log(`Received data (UTF8): ${dataUtf8}`);
          } else {
            console.log("No characteristic value received.");
          }
        }
      );
      console.log("Response from monitorCharacteristicForService:", response);
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
        renderItem={({ item }: { item: any }) => {
          if (!item.name) {
            return null;
          }
          return (
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
                <Button
                  title="연결하기"
                  onPress={() => connectToDevice(item)}
                />
              ) : (
                <Button title="연결불가" disabled />
              )}
            </View>
          );
        }}
      />
      <FlatList
        data={characteristics}
        keyExtractor={(item) => item.characteristicUUID}
        renderItem={({ item }: { item: any }) => {
          return (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text>{item.characteristicUUID}</Text>
              <Button
                title="연결하기"
                onPress={() =>
                  subscribeToCharacteristic(
                    connectedDevice,
                    item.characteristicUUID
                  )
                }
              />
            </View>
          );
        }}
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
