import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { useWindowDimensions } from 'react-native';
import ConversationList from '@/components/ConversationList';
import MessageButton from '@/components/MessageButton';
import MessageItem from '@/components/MessageItem';

const MessengesScreen = () => {
  const { user, socket } = useContext(AuthContext);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const isMobile = useWindowDimensions().width < 768;

  useEffect(() => {
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
  }, []);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.row}>
        {/* Sidebar */}
        {!isMobile && (
          <View style={styles.sidebar}>
            <ConversationList conversations={conversations} onSelect={setSelectedConv} />
            <MessageButton
              onNewConversation={(conv) => {
                setSelectedConv(conv._id);
                setMessages(conv.messages || []);
                setConversations((prev) => [conv, ...prev.filter((c) => c._id !== conv._id)]);
              }}
            />
          </View>
        )}

        {/* Main Messaging View */}
        <View style={[styles.chatArea, isMobile && { width: '100%' }]}>
          <Text style={styles.title}>Messages</Text>

          {selectedConv ? (
            <>
              <FlatList
                data={messages}
                keyExtractor={(_, idx) => idx.toString()}
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
                  <Text style={styles.sendText}>Send</Text>
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

export default MessengesScreen;

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
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 16,
    marginTop: 16,
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
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 32,
  },
});
