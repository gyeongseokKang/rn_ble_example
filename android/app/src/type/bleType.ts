export interface DeviceConnectInfo {
  _manager: Manager;
  id: string;
  isConnectable: boolean;
  localName: any;
  manufacturerData: string;
  mtu: number;
  name: string;
  overflowServiceUUIDs: any;
  rawScanRecord: string;
  rssi: number;
  serviceData: any;
  serviceUUIDs: any;
  solicitedServiceUUIDs: any;
  txPowerLevel: any;
}

export interface Manager {
  _activePromises: ActivePromises;
  _activeSubscriptions: ActiveSubscriptions;
  _errorCodesToMessagesMapping: ErrorCodesToMessagesMapping;
  _eventEmitter: EventEmitter;
  _scanEventSubscription: ScanEventSubscription;
  _uniqueId: number;
  destroy: string[];
  onStateChange: string[];
  state: string[];
  stopDeviceScan: string[];
}

export interface ActivePromises {}

export interface ActiveSubscriptions {}

export interface ErrorCodesToMessagesMapping {
  "0": string;
  "1": string;
  "100": string;
  "101": string;
  "102": string;
  "103": string;
  "104": string;
  "105": string;
  "2": string;
  "200": string;
  "201": string;
  "202": string;
  "203": string;
  "204": string;
  "205": string;
  "206": string;
  "3": string;
  "300": string;
  "301": string;
  "302": string;
  "303": string;
  "4": string;
  "400": string;
  "401": string;
  "402": string;
  "403": string;
  "404": string;
  "405": string;
  "406": string;
  "5": string;
  "500": string;
  "501": string;
  "502": string;
  "503": string;
  "504": string;
  "505": string;
  "506": string;
  "600": string;
  "601": string;
}

export interface EventEmitter {
  _nativeModule: string[];
}

export interface ScanEventSubscription {
  remove: string[];
}
