import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import api from '@/utils/api';

type PostFormProps = {
  onPostCreated: (newPost: any) => void;
};

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('literal');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'audio/*'],
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);

    if (file) {
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? 'application/octet-stream',
      } as any);
    }

    try {
      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setCategory('literal');
      setFile(null);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
      />

      <Text style={styles.label}>Category</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        <Picker.Item label="Literal Art" value="literal" />
        <Picker.Item label="Visual Art" value="visual" />
        <Picker.Item label="Vocal Art" value="vocal" />
      </Picker>

      <Button title="Pick a file" onPress={handleFilePick} />
      {file && <Text style={styles.fileName}>Selected: {file.name}</Text>}

      <View style={styles.submitButton}>
        <Button title="Create Post" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 4, color: '#fff' },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  fileName: { marginTop: 8, color: '#ccc' },
  submitButton: { marginTop: 16 },
});

export default PostForm;
