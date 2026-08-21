// Jest setup — mock native modules so unit tests can import app modules that
// (transitively) pull in AsyncStorage without a running device.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
