import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import api from '../utils/api';

type User = {
  _id: string;
  username: string;
  profile?: { avatar?: string };
};

type Props = {
  onNewConversation?: (conv: any) => void;
};

const MessageButton: React.FC<Props> = ({ onNewConversation }) => {
  const [userListVisible, setUserListVisible] = useState(false);
  const [messageDialogVisible, setMessageDialogVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (userListVisible && user) {
      api
        .get('/api/users')
        .then((res) => {
          const filtered = res.data.filter((u: User) => u._id !== user.id);
          setUsers(filtered);
        })
        .catch((err) => console.error('Error fetching users:', err));
    }
  }, [userListVisible, user]);

  const handleUserSelect = (u: User) => {
    setSelectedUser(u);
    setUserListVisible(false);
    setMessageDialogVisible(true);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    try {
      const convRes = await api.post('/api/messages/conversation', {
        recipientId: selectedUser._id,
      });
      const conv = convRes.data;

      await api.post('/api/messages/send', {
        conversationId: conv._id,
        content: message,
      });

      if (onNewConversation) onNewConversation(conv);
      setMessage('');
      setMessageDialogVisible(false);
      setSelectedUser(null);
      router.push(`/tabs/messages?conv=${conv._id}`);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  if (!user) return null;

  return (
    <View>
      <Pressable style={styles.fab} onPress={() => setUserListVisible(true)}>
        <Text style={styles.fabIcon}>✉️</Text>
      </Pressable>

      {/* User List Modal */}
      <Modal visible={userListVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a user to message</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                  <Image
                    source={
                      item.profile?.avatar
                        ? { uri: item.profile.avatar }
                        : require('../assets/default-avatar.png')
                    }
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{item.username}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setUserListVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Dialog Modal */}
      <Modal visible={messageDialogVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.modalTitle}>Send message to {selectedUser?.username}</Text>
            <TextInput
              placeholder="Enter your message..."
              placeholderTextColor="#ccc"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity onPress={() => setMessageDialogVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSend}>
                <Text style={styles.send}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageButton;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#1976d2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  dialogBox: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    fontWeight: '600',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    color: '#aaa',
    fontSize: 16,
  },
  send: {
    color: '#1e88e5',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
