import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import NotificationItem from '@/components/NotificationItem';


const Notifications: React.FC = () => {
  // Get notifications and setNotifications from the context
  const { notifications, setNotifications } = useContext(AuthContext);

  // Mark a notification as read
  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onMarkRead={handleMarkRead}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

export default Notifications;
