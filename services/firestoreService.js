import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const firestore = getFirestore(app);
const auth = getAuth(app);

const FirestoreService = {
  fetchAllData: async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  fetchData: async (collectionName, docId) => {
    try {
      if (!collectionName || !docId) {
        throw new Error("Collection name and document ID are required");
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(firestore, collectionName, user.uid, docId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn(`Document ${docId} not found in ${collectionName}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching document ${docId}:`, error);
      return null;
    }
  },

  uploadData: async (collectionName, docId, newData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(firestore, collectionName, user.uid, docId);
      await setDoc(userDocRef, newData, { merge: true });
      console.log(`Data uploaded to ${collectionName}/${user.uid}/${docId}`);
    } catch (error) {
      console.error(`Error uploading ${docId}:`, error);
    }
  },

  
   fetchAllWeightData: async (userId) => {
    console.log(`📡 Fetching weight data for the current month for user: ${userId}`);
  
      try {
        // Reference to user's weightTracker collection
        const weightCollectionRef = collection(firestore, "weightTracker", userId, userId);
    
        // Fetch all documents under weightTracker/{userId}
        const querySnapshot = await getDocs(weightCollectionRef);
    
        if (querySnapshot.empty) {
          console.warn(`⚠️ No weight data found for user: ${userId}`);
          return [];
        }
    
        // Get first and last date of the current month
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Convert to MM format
    
        // Filter documents for only the current month
        const weightData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id, // Document ID (Date)
            ...doc.data(), // { weight: 58 }
          }))
          .filter((entry) => entry.id.startsWith(`${year}-${month}`)); // Keep only current month
    
        console.log("✅ Fetched Weight Data:", weightData);
        return weightData;
      } catch (error) {
        console.error("❌ Error fetching weight data:", error);
        return [];
      }
  },
  
  calculateAverages: (weightData) => {
    if (weightData.length === 0) return { weeklyAvg: "N/A", monthlyAvg: "N/A" };
  
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
  
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
  
    let weeklyTotal = 0, weeklyCount = 0;
    let monthlyTotal = 0, monthlyCount = 0;
  
    weightData.forEach(({ weight, date }) => {
      const entryDate = new Date(date);  // Convert Firestore date string to Date object
  
      if (entryDate >= lastWeek) {
        weeklyTotal += weight;
        weeklyCount++;
      }
  
      if (entryDate >= lastMonth) {
        monthlyTotal += weight;
        monthlyCount++;
      }
    });
  
    return {
      weeklyAvg: weeklyCount > 0 ? (weeklyTotal / weeklyCount).toFixed(1) : "N/A",
      monthlyAvg: monthlyCount > 0 ? (monthlyTotal / monthlyCount).toFixed(1) : "N/A"
    };
  },

  deleteData: async (collectionName, docId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(firestore, collectionName, user.uid, docId);
      await deleteDoc(userDocRef);
      console.log(`Deleted ${collectionName}/${user.uid}/${docId}`);
    } catch (error) {
      console.error(`Error deleting ${docId}:`, error);
    }
  }
};


export default FirestoreService;
