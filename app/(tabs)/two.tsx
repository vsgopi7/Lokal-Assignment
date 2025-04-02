import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Animated } from 'react-native';
import { db } from "../../FirebaseConfig";
import { collection, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function BookmarksScreen() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const unsubscribe = onSnapshot(collection(db, "bookmarkedJobs"), (snapshot) => {
      const jobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookmarkedJobs(jobs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "bookmarkedJobs"));
      if (!querySnapshot.empty) {
        const jobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookmarkedJobs(jobs);
      } else {
        setBookmarkedJobs([]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (jobId) => {
    console.log("Attempting to delete job with ID:", jobId);
    try {
      await deleteDoc(doc(db, "bookmarkedJobs", jobId));
      setBookmarkedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      Alert.alert("Success", "Job removed from bookmarks!");
    } catch (error) {
      console.error("Error deleting document:", error);
      Alert.alert("Error", "Could not remove the job.");
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <Text style={styles.title}>Bookmarked Jobs</Text>
      <TouchableOpacity onPress={loadBookmarks} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {bookmarkedJobs.length === 0 ? (
        <Text style={styles.text}>No bookmarked jobs.</Text>
      ) : (
        <FlatList
          data={bookmarkedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.jobItem}>
              <Text style={styles.jobTitle}>{item.title || "Untitled Job"}</Text>
              <Text style={styles.company}>{item.company || "Unknown Company"}</Text>
              <TouchableOpacity onPress={() => removeBookmark(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  text: { fontSize: 18, textAlign: "center", marginTop: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#777" },
  jobItem: { backgroundColor: "#f8f8f8", padding: 15, marginBottom: 10, borderRadius: 8 },
  jobTitle: { fontSize: 18, fontWeight: "bold" },
  company: { fontSize: 16, color: "#777", marginBottom: 6 },
  removeButton: { marginTop: 10, backgroundColor: "#d9534f", padding: 10, borderRadius: 5, alignItems: "center" },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
  refreshButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  refreshButtonText: { color: "#fff", fontWeight: "bold" }
});