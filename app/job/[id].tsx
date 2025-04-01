import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocalSearchParams } from "expo-router";
import { Linking, View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams(); 
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://testapi.getlokalapp.com/common/jobs?page=1')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.results)) {
          const job = data.results.find(job => job.id == id);
          if (job) {
            setJobDetails(job);
          } else {
            setError("Job not found");
          }
        } else {
          setError("Invalid data structure");
        }
      })
      .catch(() => setError("Error fetching data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookmark = async () => {
    try {
      const existingBookmarks = await AsyncStorage.getItem('bookmarkedJobs');
      let bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];

      if (!bookmarks.some(job => job.id === jobDetails.id)) {
        bookmarks.push(jobDetails);
        await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
        Alert.alert("Success", "Job added to bookmarks!");
      } else {
        Alert.alert("Info", "Job already bookmarked.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not save the job.");
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#007bff" /></View>;
  if (error) return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollView style={styles.container}>
        {jobDetails && (
          <>
            <Text style={styles.title}>{jobDetails.title}</Text>
            <Text style={styles.company}>{jobDetails.company}</Text>
            <Text style={styles.text}>Job ID: {jobDetails.id}</Text>
            <Text style={styles.text}>Location: {jobDetails.primary_details.Place}</Text>
            <Text style={styles.text}>Salary: ₹{jobDetails.primary_details.Salary}</Text>
            <Text style={styles.text}>Job Type: {jobDetails.primary_details.Job_Type}</Text>
            <Text style={styles.text}>Experience: {jobDetails.primary_details.Experience}</Text>
            <Text style={styles.text}>Qualification: {jobDetails.primary_details.Qualification}</Text>

            <View style={styles.tagContainer}>
              {jobDetails.job_tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: tag.bg_color }]}>
                  <Text style={[styles.tagText, { color: tag.text_color }]}>{tag.value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.text}>Description:</Text>
            <Text style={styles.description}>
              {jobDetails.content ? JSON.parse(jobDetails.content).block1 : 'No description available'}
            </Text>
            <Text style={styles.description}>
              {jobDetails.content ? JSON.parse(jobDetails.content).block2 : 'No description available'}
            </Text>
            <Text style={styles.description}>
              {jobDetails.content ? JSON.parse(jobDetails.content).block3 : 'No description available'}
            </Text>

            <Text style={styles.text}>Job Type ID: {jobDetails.job_type}</Text>
            <Text style={styles.text}>Max Salary: ₹{jobDetails.salary_max}</Text>
            <Text style={styles.text}>Min Salary: ₹{jobDetails.salary_min}</Text>

            {jobDetails.contact_preference.preference === 1 && (
              <>
                <Text style={styles.title}>Contact Preference</Text>
                <Text style={styles.text}>
                  WhatsApp Link: 
                  <TouchableOpacity onPress={() => Linking.openURL(jobDetails.contact_preference.whatsapp_link)}>
                    <Text style={styles.link}>Click to chat</Text>
                  </TouchableOpacity>
                </Text>
                <Text style={styles.text}>
                  Preferred Call Time: {jobDetails.contact_preference.preferred_call_start_time} to {jobDetails.contact_preference.preferred_call_end_time}
                </Text>
              </>
            )}

            <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
              <Text style={styles.bookmarkButtonText}>Add to Bookmarks</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  company: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 18,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 30,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  bookmarkButton: {
    marginTop: 25,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  bookmarkButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
