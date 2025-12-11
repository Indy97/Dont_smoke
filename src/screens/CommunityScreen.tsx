import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { usePremium } from '../contexts/PremiumContext';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  author: string;
  avatar: string;
  daysSmokeFree: number;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
}

const samplePosts: Post[] = [
  {
    id: '1',
    author: 'Marek',
    avatar: 'M',
    daysSmokeFree: 180,
    content: 'Pół roku! Nie wierzę, że udało mi się dojść tak daleko. Dziękuję wszystkim za wsparcie! 💪',
    likes: 47,
    comments: 12,
    timeAgo: '2 godz. temu',
    isLiked: false,
  },
  {
    id: '2',
    author: 'Anna',
    avatar: 'A',
    daysSmokeFree: 30,
    content: 'Miesiąc za mną! Najtrudniejszy był pierwszy tydzień, ale teraz jest coraz łatwiej. Wierzcie w siebie!',
    likes: 32,
    comments: 8,
    timeAgo: '4 godz. temu',
    isLiked: true,
  },
  {
    id: '3',
    author: 'Tomek',
    avatar: 'T',
    daysSmokeFree: 7,
    content: 'Właśnie ukończyłem pierwszy tydzień. To było trudne, ale dałem radę. Kto jeszcze walczy?',
    likes: 28,
    comments: 15,
    timeAgo: '6 godz. temu',
    isLiked: false,
  },
  {
    id: '4',
    author: 'Kasia',
    avatar: 'K',
    daysSmokeFree: 365,
    content: 'ROK BEZ PAPIEROSA! 🎉 To był najlepszy rok mojego życia. Zdrowie, oszczędności i wolność. Każdy może to zrobić!',
    likes: 156,
    comments: 42,
    timeAgo: '1 dzień temu',
    isLiked: false,
  },
];

export default function CommunityScreen() {
  const navigation = useNavigation();
  const { isPremium, features } = usePremium();
  const { user } = useAuth();
  const [posts, setPosts] = useState(samplePosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const PostCard = ({ post }: { post: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.postHeaderContent}>
          <Text style={styles.authorName}>{post.author}</Text>
          <View style={styles.postMeta}>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={12} color="#e74c3c" />
              <Text style={styles.streakText}>{post.daysSmokeFree} dni</Text>
            </View>
            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.isLiked ? '#e74c3c' : '#888'}
          />
          <Text style={[styles.actionText, post.isLiked && styles.actionTextActive]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#888" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isPremium || !features.communityAccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Społeczność</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.lockedContainer}>
          <View style={styles.lockedIcon}>
            <Ionicons name="people" size={60} color="#ccc" />
          </View>
          <Text style={styles.lockedTitle}>Dołącz do społeczności</Text>
          <Text style={styles.lockedDescription}>
            Uzyskaj dostęp do społeczności osób rzucających palenie. Dzielcie się sukcesami, wspierajcie się nawzajem i razem osiągajcie cele!
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.benefitText}>Dziel się swoimi postępami</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.benefitText}>Otrzymuj wsparcie od innych</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.benefitText}>Motywuj się nawzajem</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.benefitText}>Świętuj sukcesy razem</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.unlockButton}
            onPress={() => navigation.navigate('Premium' as never)}
          >
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.unlockButtonText}>Odblokuj z Premium</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Społeczność</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* New Post */}
      <View style={styles.newPostContainer}>
        <View style={styles.newPostAvatar}>
          <Text style={styles.newPostAvatarText}>
            {user?.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
        <TextInput
          style={styles.newPostInput}
          placeholder="Podziel się swoim postępem..."
          placeholderTextColor="#888"
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity
          style={[styles.postButton, !newPost && styles.postButtonDisabled]}
          disabled={!newPost}
        >
          <Ionicons name="send" size={20} color={newPost ? '#1a5f2a' : '#ccc'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  lockedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  lockedDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a5f2a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  newPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  newPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a5f2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newPostAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newPostInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 80,
  },
  postButton: {
    padding: 10,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postsList: {
    padding: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a5f2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postHeaderContent: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  streakText: {
    fontSize: 11,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  actionText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 6,
  },
  actionTextActive: {
    color: '#e74c3c',
  },
});
