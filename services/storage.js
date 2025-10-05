import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hasSecureStore = !!(SecureStore && typeof SecureStore.getItemAsync === 'function' && typeof SecureStore.setItemAsync === 'function' && typeof SecureStore.deleteItemAsync === 'function');

export async function setItem(key, value) {
  try {
    if (hasSecureStore) {
      return await SecureStore.setItemAsync(key, value);
    }
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('storage.setItem failed, falling back to AsyncStorage:', e);
    try { return await AsyncStorage.setItem(key, value); } catch (err) { console.error('AsyncStorage.setItem also failed:', err); }
  }
}

export async function getItem(key) {
  try {
    if (hasSecureStore) {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn('storage.getItem failed, falling back to AsyncStorage:', e);
    try { return await AsyncStorage.getItem(key); } catch (err) { console.error('AsyncStorage.getItem also failed:', err); }
  }
  return null;
}

export async function deleteItem(key) {
  try {
    if (hasSecureStore) {
      return await SecureStore.deleteItemAsync(key);
    }
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('storage.deleteItem failed, falling back to AsyncStorage:', e);
    try { return await AsyncStorage.removeItem(key); } catch (err) { console.error('AsyncStorage.removeItem also failed:', err); }
  }
}

export default {
  setItem,
  getItem,
  deleteItem
};
