// app/components/Chatbot.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '@/utils/api';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/chatbot/chat', {
        message: input,
      });
      const botMessage: Message = { sender: 'bot', text: res.data.reply || 'No response.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error responding...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FAB
        icon="chat"
        style={styles.fab}
        onPress={() => setVisible(true)}
        color="#fff"
      />

      <Modal visible={visible} animationType="slide">
        <KeyboardAvoidingView
          style={styles.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Ask the Art Assistant</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.messageContainer}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={{
                    color: item.sender === 'user' ? '#fff' : '#000',
                  }}
                >
                  {item.text}
                </Text>
              </View>
            )}
          />

          {loading && <ActivityIndicator style={{ marginBottom: 10 }} color="#1976d2" />}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 64,
    backgroundColor: '#1976d2',
    zIndex: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#1976d2',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 20,
  },
});

export default Chatbot;
