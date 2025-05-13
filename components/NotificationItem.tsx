import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

type NotificationItemNavigationProp = StackNavigationProp<RootStackParamList, 'Post'>;  // Define the type for navigation to Post screen

interface Notification {
  _id: string;
  message: string;
  [key: string]: any;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NotificationItemNavigationProp>();  // Use the typed navigation

  const handleMarkRead = async () => {
    try {
      if (user && user.token) {
        await fetch(`/api/notifications/${notification._id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
      } else {
        console.error("User is not authenticated.");
      }
      onMarkRead(notification._id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleViewPost = () => {
    navigation.navigate('Post', { postId: notification.relatedId });  // Now correctly typed
  };

  return (
    <View style={[styles.card, notification.read && styles.readCard]}>
      <Text style={[styles.message, notification.read && styles.readMessage]}>
        {notification.content}
      </Text>

      <TouchableOpacity onPress={handleViewPost} style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Post</Text>
      </TouchableOpacity>

      {!notification.read && (
        <TouchableOpacity onPress={handleMarkRead} style={styles.markReadButton}>
          <Text style={styles.markReadText}>✅</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  readCard: {
    backgroundColor: '#333',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
  readMessage: {
    color: '#bbb',
  },
  viewButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#00bcd4',
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  markReadButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  markReadText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default NotificationItem;
