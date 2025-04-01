import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookmarksScreen() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      if (storedJobs) {
        setBookmarkedJobs(JSON.parse(storedJobs));
      }
    } catch (error) {
      Alert.alert("Error", "Could not load bookmarks.");
    }
  };

  const removeBookmark = async (jobId) => {
    try {
      let updatedJobs = bookmarkedJobs.filter(job => job.id !== jobId);
      setBookmarkedJobs(updatedJobs);
      await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(updatedJobs));
      Alert.alert("Success", "Job removed from bookmarks!");
    } catch (error) {
      Alert.alert("Error", "Could not remove the job.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Jobs</Text>
      {bookmarkedJobs.length === 0 ? (
        <Text style={styles.text}>No bookmarked jobs.</Text>
      ) : (
        <FlatList
          data={bookmarkedJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobItem}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <TouchableOpacity onPress={() => removeBookmark(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  text: { fontSize: 18, textAlign: "center", marginTop: 20 },
  jobItem: { backgroundColor: "#f8f8f8", padding: 15, marginBottom: 10, borderRadius: 8 },
  jobTitle: { fontSize: 18, fontWeight: "bold" },
  company: { fontSize: 16, color: "#777", marginBottom: 6 },
  removeButton: { marginTop: 10, backgroundColor: "#d9534f", padding: 10, borderRadius: 5, alignItems: "center" },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
});
