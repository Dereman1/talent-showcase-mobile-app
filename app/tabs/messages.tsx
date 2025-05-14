import MessageItem from '@/components/MessageItem';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Appbar, Drawer, List } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

const MessagesScreen = () => {
  const { user, socket } = useContext(AuthContext);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // To store all users

  const isMobile = useWindowDimensions().width < 768;

  useEffect(() => {
    // Fetch all conversations
    const fetchConversations = async () => {
      try {
        const res = await api.get('/api/messages/conversations');
        setConversations(res.data);
        if (!selectedConv && res.data.length > 0) {
          setSelectedConv(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
    fetchConversations();

    // Fetch all users (excluding the current logged-in user)
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users'); // Endpoint to get all users
        setUsers(res.data.filter((u: any) => u._id !== user?.id)); // Exclude current user
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [selectedConv, user]);

  useEffect(() => {
    if (selectedConv) {
      const conv = conversations.find((c) => c._id === selectedConv);
      if (conv) setMessages(conv.messages || []);
    }
  }, [selectedConv, conversations]);

  useEffect(() => {
    if (socket && selectedConv) {
      socket.emit('joinConversation', selectedConv);
      socket.on('message', (message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => {
        socket.off('message');
      };
    }
    return undefined;
  }, [socket, selectedConv]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const res = await api.post('/api/messages/send', {
        conversationId: selectedConv,
        content,
      });
      setMessages((prev) => [...prev, res.data]);
      setContent('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleStartConversation = async (recipientId: string) => {
    try {
      const res = await api.post('/api/messages/conversation', { recipientId });
      setSelectedConv(res.data._id);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const renderDrawer = () => (
    <Drawer.Section style={styles.drawer}>
      <FlatList
        data={users} // Display all registered users excluding the current user
        keyExtractor={(item) => item._id} // Ensuring unique keys
        renderItem={({ item }) => {
          // Find the latest message in the user's conversation
          const conversation = conversations.find(
            (conv) => conv.participants.some((p: any) => p._id === item._id)
          );
          const latestMessage =
            conversation && conversation.messages?.length > 0
              ? conversation.messages.slice(-1)[0].content
              : 'No messages yet';

          return (
            <List.Item
              title={item.username}
              description={latestMessage}
              onPress={() => {
                // Set selected conversation for the user
                if (!conversation) {
                  // No conversation exists, so start one
                  handleStartConversation(item._id);
                } else {
                  setSelectedConv(conversation._id);
                }
                setDrawerVisible(false);
              }}
              style={styles.drawerItem}
              titleStyle={{ color: '#fff' }}
              descriptionStyle={{ color: '#ccc' }}
            />
          );
        }}
      />
    </Drawer.Section>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {isMobile && (
        <Appbar.Header style={{ backgroundColor: '#1e1e1e' }}>
          <Appbar.Action icon="menu" onPress={() => setDrawerVisible(!drawerVisible)} />
          <Appbar.Content title="Messages" titleStyle={{ color: '#fff' }} />
        </Appbar.Header>
      )}

      <View style={styles.row}>
        {!isMobile && <View style={styles.sidebar}>{renderDrawer()}</View>}

        <View style={[styles.chatArea, isMobile && { width: '100%' }]}>
          {isMobile && drawerVisible && (
            <View style={styles.drawerOverlay}>
              <View style={styles.drawerPanel}>{renderDrawer()}</View>
              <TouchableOpacity
                style={styles.drawerBackdrop}
                onPress={() => setDrawerVisible(false)}
              />
            </View>
          )}

          {selectedConv ? (
            <>
              <FlatList
                data={messages}
                keyExtractor={(item) => item._id || item.timestamp} // Ensuring unique key
                renderItem={({ item }) => (
                  <MessageItem message={item} userId={user?.id || ''} />
                )}
                contentContainerStyle={styles.messageList}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor="#aaa"
                  value={content}
                  onChangeText={setContent}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.empty}>Select a conversation to start chatting.</Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  messageList: {
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
    marginTop: 8,
    width: '80%',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginRight: 8,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2979ff',
    borderRadius: 8,
  },
  empty: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 32,
  },
  drawer: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
  },
  drawerItem: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 10,
  },
  drawerPanel: {
    width: 260,
    backgroundColor: '#1e1e1e',
    borderRightColor: '#333',
    borderRightWidth: 1,
    zIndex: 11,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
