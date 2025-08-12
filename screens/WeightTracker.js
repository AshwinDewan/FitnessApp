// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
// import { Calendar } from "react-native-calendars";
// import FirestoreService from "../services/firestoreService";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { app } from "../firebaseConfig";

// const firestore = getFirestore(app);
// const auth = getAuth(app);

// const WeightTracker = () => {
//   const user = auth.currentUser;
//   if (!user) return <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>User not logged in</Text>;

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [weight, setWeight] = useState("");
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [todaysWeight, setTodaysWeight] = useState(null);
//   const [weeklyAvgWeight, setWeeklyAvgWeight] = useState(null);
//   const [monthlyAvgWeight, setMonthlyAvgWeight] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const formattedDate = selectedDate.toISOString().split("T")[0];
//   const todayDate = new Date().toISOString().split("T")[0];

//   // useEffect(() => {
//   //   console.log(`📅 Selected Date Changed: ${formattedDate}`);
//   //   setWeight(""); // Reset first  
//   //   fetchExistingData(formattedDate);
//   // }, [selectedDate]);
//   useEffect(() => {
//     fetchTodaysWeight();
//     fetchAndCalculateAverages();
//   }, []);  // Runs once on mount instead of every weight change

//   useEffect(() => {
//     console.log(`📆 Date changed: ${formattedDate}`);
//     setEditing(false);
//     fetchExistingData(formattedDate);
//   }, [formattedDate]);  // Only fetch when the selected date changes

//   const fetchTodaysWeight = async () => {
//     const data = await FirestoreService.fetchData(`weightTracker/${user.uid}`, todayDate);
//     if (data) {
//       setTodaysWeight(data.weight);
//     }
//   };

//   async function fetchAndCalculateAverages() {
//     const weightData = await FirestoreService.fetchAllWeightData(user.uid);
//     const averages = FirestoreService.calculateAverages(weightData);

//     setWeeklyAvgWeight(averages.weeklyAvg);
//     setMonthlyAvgWeight(averages.monthlyAvg);
//     console.log(`✅ Weekly Avg: ${averages.weeklyAvg}, Monthly Avg: ${averages.monthlyAvg}`);
//     return averages;
//   }

//   const fetchExistingData = async (dateString) => {
//     if (!dateString || !user) {
//       console.log("⚠️ Missing date or user info.");
//       return;
//     }

//     console.log(`📅 Fetching data for: ${dateString}`);

//     // Reset UI state
//     setWeight(""); // UI will show loading state instead of old data
//     console.log("🔄 Reset weight state before fetching...");

//     try {
//       const data = await FirestoreService.fetchData(`weightTracker/${user.uid}`, dateString);

//       if (data) {
//         console.log(`✅ Data found for ${dateString}:`, JSON.stringify(data));
//         setWeight(data.weight.toString());
//       } else {
//         console.log(`❌ No data found for ${dateString}, setting weight to empty string`);
//         setWeight(""); // UI will show "No Entry"
//       }
//     } catch (error) {
//       console.error(`❌ Error fetching data for ${dateString}:`, error);
//       setWeight(""); // Ensure UI does not show stale data
//     }
//   };

//   const saveWeightEntry = async () => {
//     if (!weight) {
//       Alert.alert("Error", "Please enter your weight.");
//       return;
//     }

//     const newData = { weight: parseFloat(weight), date: formattedDate };
//     console.log(`💾 Saving weight: ${weight} kg for ${formattedDate}`);

//     await FirestoreService.uploadData(`weightTracker/${user.uid}`, formattedDate, newData);

//     console.log("🔄 Fetching updated data after saving...");

//     setTimeout(() => {
//       fetchExistingData(formattedDate);
//       setTodaysWeight(newData.weight);
//     }, 500); // Short delay for Firestore sync

//     setEditing(false);
//     setEditModalVisible(false);
//   };


//   return (
//     <View style={{ flex: 1, backgroundColor: "#000", padding: 10 }}>
//       <Text style={{ fontSize: 24, color: "#C1FF00", textAlign: "center", marginBottom: 10, marginTop: 20 }}>
//         Weight Tracker
//       </Text>
//       <Calendar
//         theme={{
//           calendarBackground: "#000",
//           textSectionTitleColor: "#C1FF00",
//           todayTextColor: "#C1FF00",
//           dayTextColor: "#FFF",
//           textDisabledColor: "#555",
//           selectedDayBackgroundColor: "#C1FF00",
//           selectedDayTextColor: "#000",
//         }}
//         markedDates={{
//           [formattedDate]: {
//             selected: true,
//             selectedColor: "#C1FF00",
//           },
//         }}
//         onDayPress={(day) => {
//           setSelectedDate(new Date(day.dateString));
//           fetchExistingData(day.dateString).then(() => {
//             weight ? setViewModalVisible(true) : setEditModalVisible(true);
//           });
//         }}
//         renderHeader={(date) => {
//           return <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{date.toString().split(" ")[1]} {date.toString().split(" ")[3]}</Text>;
//         }}
//       />
//       <View style={{ marginTop: 20 }}>
//         <View style={{ backgroundColor: "#222", padding: 15, borderRadius: 10, marginBottom: 10 }}>
//           <Text style={{ color: "#C1FF00", fontSize: 18 }}>Today's Weight</Text>
//           <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "bold" }}>{todaysWeight ? `${todaysWeight} kg` : "No data"}</Text>
//         </View>
//         <View style={{ backgroundColor: "#222", padding: 15, borderRadius: 10, marginBottom: 10 }}>
//           <Text style={{ color: "#C1FF00", fontSize: 18 }}>Last Week's Average Weight</Text>
//           <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "bold" }}>{weeklyAvgWeight} kg</Text>
//         </View>
//         <View style={{ backgroundColor: "#222", padding: 15, borderRadius: 10, marginBottom: 10 }}>
//           <Text style={{ color: "#C1FF00", fontSize: 18 }}>Monthly Average Weight</Text>
//           <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "bold" }}>{monthlyAvgWeight} kg</Text>
//         </View>
//       </View>
//       {/* <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
//           <View style={{ width: 300, padding: 20, backgroundColor: "#333", borderRadius: 10 }}>
//             <Text style={{ color: "#C1FF00", fontSize: 18, marginBottom: 10 }}>Enter Weight for {formattedDate}</Text>
//             <TextInput
//               style={{ borderBottomWidth: 1, borderBottomColor: "#C1FF00", color: "#FFF", fontSize: 16, marginBottom: 20 }}
//               keyboardType="numeric"
//               value={weight}
//               onChangeText={setWeight}
//               placeholder="Enter weight (kg)"
//               placeholderTextColor="#888"
//             />
//             <TouchableOpacity onPress={saveWeightEntry} style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}>
//               <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, alignItems: "center" }}>
//               <Text style={{ color: "#C1FF00" }}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal> */}
//       {/* <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
//           <View style={{ width: 300, padding: 20, backgroundColor: "#333", borderRadius: 10 }}>

//             {weight ? (
//               <>
//                 <Text style={{ color: "#C1FF00", fontSize: 18, marginBottom: 10 }}>
//                   Weight Entry for {formattedDate}
//                 </Text>
//                 <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
//                   {weight} kg
//                 </Text>

//                 <TouchableOpacity
//                   onPress={() => setEditing(true)}
//                   style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}
//                 >
//                   <Text style={{ color: "#000", fontWeight: "bold" }}>Edit</Text>
//                 </TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <Text style={{ color: "#C1FF00", fontSize: 18, marginBottom: 10 }}>Enter Weight for {formattedDate}</Text>
//                 <TextInput
//                   style={{ borderBottomWidth: 1, borderBottomColor: "#C1FF00", color: "#FFF", fontSize: 16, marginBottom: 20 }}
//                   keyboardType="numeric"
//                   value={weight}
//                   onChangeText={setWeight}
//                   placeholder="Enter weight (kg)"
//                   placeholderTextColor="#888"
//                 />
//                 <TouchableOpacity onPress={saveWeightEntry} style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}>
//                   <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {editing && (
//               <>
//                 <TextInput
//                   style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: "#C1FF00",
//                     color: "#FFF",
//                     fontSize: 16,
//                     marginBottom: 20,
//                   }}
//                   keyboardType="numeric"
//                   value={weight}
//                   onChangeText={setWeight}
//                   placeholder="Enter new weight"
//                   placeholderTextColor="#888"
//                 />

//                 <TouchableOpacity
//                   onPress={saveWeightEntry} // Updates Firestore entry
//                   style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}
//                 >
//                   <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, alignItems: "center" }}>
//               <Text style={{ color: "#C1FF00" }}>Close</Text>
//             </TouchableOpacity>

//           </View>
//         </View>
//       </Modal> */}

//             <Modal visible={viewModalVisible} animationType="slide" transparent={true}>
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
//           <View style={{ width: 300, padding: 20, backgroundColor: "#333", borderRadius: 10 }}>
//             <Text style={{ color: "#C1FF00", fontSize: 18, marginBottom: 10 }}>
//               Weight Entry for {formattedDate}
//             </Text>
//             <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{weight} kg</Text>
//             <TouchableOpacity onPress={() => { setEditing(true); setViewModalVisible(false); setEditModalVisible(true); }}
//               style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}>
//               <Text style={{ color: "#000", fontWeight: "bold" }}>Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ marginTop: 10, alignItems: "center" }}>
//               <Text style={{ color: "#C1FF00" }}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={editModalVisible} animationType="slide" transparent={true}>
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
//           <View style={{ width: 300, padding: 20, backgroundColor: "#333", borderRadius: 10 }}>
//             <Text style={{ color: "#C1FF00", fontSize: 18, marginBottom: 10 }}>Enter Weight for {formattedDate}</Text>
//             <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#C1FF00", color: "#FFF", fontSize: 16, marginBottom: 20 }}
//               keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="Enter weight (kg)" placeholderTextColor="#888" />
//             <TouchableOpacity onPress={saveWeightEntry} style={{ backgroundColor: "#C1FF00", padding: 10, borderRadius: 5, alignItems: "center" }}>
//               <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginTop: 10, alignItems: "center" }}>
//               <Text style={{ color: "#C1FF00" }}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default WeightTracker;

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import FirestoreService from "../services/firestoreService";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const firestore = getFirestore(app);
const auth = getAuth(app);
const { width, height } = Dimensions.get("window");

const WeightTracker = () => {
  const user = auth.currentUser;
  if (!user) return <Text style={{ color: "red", textAlign: "center", marginTop: height * 0.02 }}>User not logged in</Text>;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weight, setWeight] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [todaysWeight, setTodaysWeight] = useState(null);
  const [weeklyAvgWeight, setWeeklyAvgWeight] = useState(null);
  const [monthlyAvgWeight, setMonthlyAvgWeight] = useState(null);
  const [editing, setEditing] = useState(false);
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTodaysWeight();
    fetchAndCalculateAverages();
  }, []);

  useEffect(() => {
    setEditing(false);
    fetchExistingData(formattedDate);
  }, [formattedDate]);

  const fetchTodaysWeight = async () => {
    const data = await FirestoreService.fetchData(`weightTracker/${user.uid}`, todayDate);
    if (data) setTodaysWeight(data.weight);
  };

  async function fetchAndCalculateAverages() {
    const weightData = await FirestoreService.fetchAllWeightData(user.uid);
    const averages = FirestoreService.calculateAverages(weightData);
    setWeeklyAvgWeight(averages.weeklyAvg);
    setMonthlyAvgWeight(averages.monthlyAvg);
  }

  const fetchExistingData = async (dateString) => {
    if (!dateString || !user) return;
    setWeight("");
    try {
      const data = await FirestoreService.fetchData(`weightTracker/${user.uid}`, dateString);
      if (data) setWeight(data.weight.toString());
    } catch (error) {
      setWeight("");
    }
  };

  const saveWeightEntry = async () => {
    if (!weight) {
      Alert.alert("Error", "Please enter your weight.");
      return;
    }

    const newData = { weight: parseFloat(weight), date: formattedDate };
    await FirestoreService.uploadData(`weightTracker/${user.uid}`, formattedDate, newData);
    setTimeout(() => {
      fetchExistingData(formattedDate);
      setTodaysWeight(newData.weight);
    }, 500);

    setEditing(false);
    setEditModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: width * 0.05 }}>
      <Text style={{ fontSize: width * 0.06, color: "#C1FF00", textAlign: "center", marginBottom: height * 0.02 }}>
        Weight Tracker
      </Text>

      <Calendar
        theme={{
          calendarBackground: "#000",
          textSectionTitleColor: "#C1FF00",
          todayTextColor: "#C1FF00",
          dayTextColor: "#FFF",
          textDisabledColor: "#555",
          selectedDayBackgroundColor: "#C1FF00",
          selectedDayTextColor: "#000",
        }}
        markedDates={{
          [formattedDate]: { selected: true, selectedColor: "#C1FF00" },
        }}
        onDayPress={(day) => {
          setSelectedDate(new Date(day.dateString));
          fetchExistingData(day.dateString).then(() => {
            weight ? setViewModalVisible(true) : setEditModalVisible(true);
          });
        }}
        renderHeader={(date) => (
          <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>
            {date.toString().split(" ")[1]} {date.toString().split(" ")[3]}
          </Text>
        )}
      />

      <View style={{ marginTop: height * 0.03 }}>
        {[{ label: "Today's Weight", value: todaysWeight }, { label: "Last Week's Avg", value: weeklyAvgWeight }, { label: "Monthly Avg", value: monthlyAvgWeight }].map((item, index) => (
          <View key={index} style={{ backgroundColor: "#222", padding: height * 0.02, borderRadius: 10, marginBottom: height * 0.015 }}>
            <Text style={{ color: "#C1FF00", fontSize: width * 0.045 }}>{item.label}</Text>
            <Text style={{ color: "#FFF", fontSize: width * 0.05, fontWeight: "bold" }}>{item.value ? `${item.value} kg` : "No data"}</Text>
          </View>
        ))}
      </View>

      <Modal visible={viewModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
          <View style={{ width: width * 0.8, padding: height * 0.025, backgroundColor: "#333", borderRadius: 10 }}>
            <Text style={{ color: "#C1FF00", fontSize: width * 0.05, marginBottom: height * 0.015 }}>Weight Entry for {formattedDate}</Text>
            <Text style={{ color: "#FFF", fontSize: width * 0.06, fontWeight: "bold", marginBottom: height * 0.015 }}>{weight} kg</Text>
            <TouchableOpacity onPress={() => { setEditing(true); setViewModalVisible(false); setEditModalVisible(true); }} style={{ backgroundColor: "#C1FF00", padding: height * 0.015, borderRadius: 5, alignItems: "center" }}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewModalVisible(false)} style={{ marginTop: height * 0.015, alignItems: "center" }}>
              <Text style={{ color: "#C1FF00" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
          <View style={{ width: width * 0.8, padding: height * 0.025, backgroundColor: "#333", borderRadius: 10 }}>
            <Text style={{ color: "#C1FF00", fontSize: width * 0.05, marginBottom: height * 0.015 }}>Enter Weight for {formattedDate}</Text>
            <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#C1FF00", color: "#FFF", fontSize: width * 0.045, marginBottom: height * 0.02 }}
              keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="Enter weight (kg)" placeholderTextColor="#888" />
            <TouchableOpacity onPress={saveWeightEntry} style={{ backgroundColor: "#C1FF00", padding: height * 0.015, borderRadius: 5, alignItems: "center" }}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WeightTracker;
