import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Job {
  id: string;
  title: string;
  primary_details?: {
    Place?: string;
    Salary?: string;
  };
  custom_link?: string;
}

const JobListScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isFetching = useRef(false);
  const router = useRouter();
  const fetchedJobIds = useRef<Set<string>>(new Set());

  const fetchJobs = async (pageNumber: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${pageNumber}`);
      const data = await response.json();
      if (data.results) {
        const newJobs = data.results.filter((job: Job) => !fetchedJobIds.current.has(job.id));
        if (newJobs.length === 0) {
          setIsFetchingMore(false);
          return;
        }
        setJobs((prevJobs) => [...prevJobs, ...newJobs]);
        newJobs.forEach((job: Job) => fetchedJobIds.current.add(job.id));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const loadMoreJobs = () => {
    if (!isFetchingMore && jobs.length < 10) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Job }) => {
    if (!item.id) return null;
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPress={() => router.push(`/job/${item.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "#007bff30" }}
      >
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>  
          <Text style={styles.title}>{item.title || "No Title Available"}</Text>
          <Text style={styles.detail}>📍 {item.primary_details?.Place || "Location not provided"}</Text>
          <Text style={styles.salary}>💰 {item.primary_details?.Salary || "Salary not specified"}</Text>
          <Text style={styles.contact}>📞 {item.custom_link || "No contact available"}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreJobs}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#007bff" /> : null}
          />
        )}
      </View>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef2f3",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#007bff",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0056b3",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  detail: {
    fontSize: 16,
    color: "#555",
    marginTop: 6,
  },
  salary: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginTop: 8,
  },
  contact: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default JobListScreen;
