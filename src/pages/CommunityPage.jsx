import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, ThumbsUp, Clock, User, Tag, Search,
  Plus, X, Send, Filter, TrendingUp, Award, MapPin,
  ChevronRight, Eye, MessageSquare, Bookmark, Share2
} from 'lucide-react';

// Mock community posts
const mockPosts = [
  {
    id: '1',
    title: 'Tips for expediting passport renewal',
    content: 'I needed my passport renewed quickly and found that using a passport expediting service saved me weeks. Here are some tips...',
    author: 'TravelPro22',
    authorBadge: 'Contributor',
    category: 'documents',
    state: 'CA',
    upvotes: 47,
    replies: 12,
    views: 234,
    createdAt: '2024-02-13T10:30:00Z',
    tags: ['passport', 'expedited', 'tips'],
  },
  {
    id: '2',
    title: 'LLC formation in Texas - my experience',
    content: 'Just finished setting up my LLC in Texas. The process was surprisingly straightforward through the Secretary of State website...',
    author: 'TXBusinessOwner',
    authorBadge: 'Expert',
    category: 'business',
    state: 'TX',
    upvotes: 32,
    replies: 8,
    views: 156,
    createdAt: '2024-02-12T15:45:00Z',
    tags: ['LLC', 'texas', 'business'],
  },
  {
    id: '3',
    title: 'Name change after marriage - complete guide',
    content: 'After getting married, I had to change my name on everything. Here\'s the exact order I did it in to avoid issues...',
    author: 'NewlyWedNancy',
    authorBadge: null,
    category: 'life-events',
    state: 'FL',
    upvotes: 89,
    replies: 23,
    views: 512,
    createdAt: '2024-02-10T09:00:00Z',
    tags: ['name-change', 'marriage', 'guide'],
  },
  {
    id: '4',
    title: 'Property tax appeal success story',
    content: 'I successfully appealed my property tax assessment and saved $2,400/year. Here\'s exactly what I did...',
    author: 'HomeOwnerHelp',
    authorBadge: 'Contributor',
    category: 'property',
    state: 'IL',
    upvotes: 156,
    replies: 34,
    views: 892,
    createdAt: '2024-02-08T14:20:00Z',
    tags: ['property-tax', 'appeal', 'savings'],
  },
  {
    id: '5',
    title: 'SNAP benefits application timeline',
    content: 'Applied for SNAP benefits last month. Wanted to share the actual timeline vs what they told me to expect...',
    author: 'HelpingSingleMom',
    authorBadge: null,
    category: 'benefits',
    state: 'NY',
    upvotes: 28,
    replies: 15,
    views: 198,
    createdAt: '2024-02-05T11:15:00Z',
    tags: ['SNAP', 'benefits', 'timeline'],
  },
];

const categories = [
  { id: 'all', name: 'All Topics', icon: MessageCircle },
  { id: 'documents', name: 'Documents & IDs', icon: Tag },
  { id: 'business', name: 'Business', icon: Tag },
  { id: 'property', name: 'Property', icon: Tag },
  { id: 'benefits', name: 'Benefits', icon: Tag },
  { id: 'life-events', name: 'Life Events', icon: Tag },
  { id: 'vehicles', name: 'Vehicles', icon: Tag },
];

const STORAGE_KEY = 'clear-community-posts';

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, trending

  // New post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'documents',
    state: '',
    tags: '',
  });

  // Load posts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const customPosts = JSON.parse(stored);
        setPosts([...customPosts, ...mockPosts]);
      } catch (e) {
        console.error('Failed to load posts');
      }
    }
  }, []);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'trending') return b.views - a.views;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Submit new post
  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: `user-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      state: newPost.state || 'General',
      author: 'You',
      authorBadge: null,
      upvotes: 0,
      replies: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    
    // Save custom posts
    const customPosts = updatedPosts.filter(p => p.id.startsWith('user-'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPosts));

    setNewPost({ title: '', content: '', category: 'documents', state: '', tags: '' });
    setShowNewPost(false);
  };

  // Upvote post
  const handleUpvote = (postId) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
    ));
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Expert': return 'bg-purple-500/20 text-purple-400';
      case 'Contributor': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
              <p className="text-slate-400">Share experiences and help others navigate government processes</p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Upvoted</option>
              <option value="trending">Most Viewed</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No discussions found</h3>
              <p className="text-slate-400">Be the first to start a conversation!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex gap-4">
                  {/* Upvotes */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpvote(post.id); }}
                      className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5 text-slate-400 hover:text-purple-400" />
                    </button>
                    <span className="text-white font-semibold">{post.upvotes}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
                          {post.state}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                        {post.authorBadge && (
                          <span className={`px-2 py-0.5 rounded text-xs ${getBadgeColor(post.authorBadge)}`}>
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeAgo(post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Create Post</h2>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience, question, or tips..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">State</label>
                    <input
                      type="text"
                      value={newPost.state}
                      onChange={(e) => setNewPost(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g., CA, TX, or General"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., passport, expedited, tips"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Post to Community
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                      {categories.find(c => c.id === selectedPost.category)?.name}
                    </span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-400">
                      {selectedPost.state}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>

                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-white">{selectedPost.author}</span>
                    {selectedPost.authorBadge && (
                      <span className={`px-2 py-0.5 rounded text-xs ${getBadgeColor(selectedPost.authorBadge)}`}>
                        {selectedPost.authorBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500">{timeAgo(selectedPost.createdAt)}</span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedPost.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedPost.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900 rounded-full text-sm text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => handleUpvote(selectedPost.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{selectedPost.upvotes}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare className="w-5 h-5" />
                    <span>{selectedPost.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Eye className="w-5 h-5" />
                    <span>{selectedPost.views} views</span>
                  </div>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>

                {/* Reply Section */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Add a Reply</h3>
                  <textarea
                    placeholder="Share your thoughts or experience..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                  <button className="mt-3 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-xl transition-colors">
                    Post Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
