import firestoreService from "./firestoreService";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLLECTIONS = ["repLogger", "workoutPlanner", "dietTracker"];

// Function to sync local data to Firestore
const syncToFirestore = async () => {
  const isConnected = (await NetInfo.fetch()).isConnected;
  if (!isConnected) return;

  try {
    for (const collection of COLLECTIONS) {
      const localData = await AsyncStorage.getItem(collection);
      if (localData) {
        const parsedData = JSON.parse(localData);
        for (const item of parsedData) {
          await firestoreService.uploadData(collection, item.id, item);
        }
      }
    }
    console.log("Sync to Firestore complete");
  } catch (error) {
    console.error("Sync to Firestore failed:", error);
  }
};

// Function to sync Firestore data to local storage
const syncFromFirestore = async () => {
  // console.log("Syncing from Firestore..."); // Temporary log for verification
  const isConnected = (await NetInfo.fetch()).isConnected;
  if (!isConnected) return;

  try {
    for (const collection of COLLECTIONS) {
      const cloudData = await firestoreService.fetchAllData(collection);
      await AsyncStorage.setItem(collection, JSON.stringify(cloudData));
    }
    console.log("Sync from Firestore complete");
  } catch (error) {
    console.error("Sync from Firestore failed:", error);
  }
};

// Function to handle bidirectional sync (both ways)
const syncData = async () => {
  await syncFromFirestore();
  await syncToFirestore();
};

export default {
  syncData,
  syncToFirestore,
  syncFromFirestore,
};
