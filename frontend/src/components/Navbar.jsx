import React, { useState } from 'react';
import { Search, MessageCircle, Heart, Settings, User, Plus, LogOut, MoreVertical } from 'lucide-react';

const Navbar = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      message: 'Hey, how are you doing?',
      time: '2m',
      initials: 'JD',
      bgColor: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      message: 'Thanks for your help!',
      time: '5m',
      initials: 'SM',
      bgColor: 'bg-purple-500'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      message: 'See you tomorrow',
      time: '1h',
      initials: 'MJ',
      bgColor: 'bg-green-500'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                <LogOut size={18} />
              </button>
            </div>
          </div>
          
          {/* New Chat Button */}
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Search Box */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                selectedChat?.id === conv.id 
                  ? 'bg-emerald-50 border-emerald-500' 
                  : 'border-transparent'
              }`}
            >
              <div className={`w-12 h-12 ${conv.bgColor} rounded-full flex items-center justify-center text-white font-medium mr-3`}>
                {conv.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-around">
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group">
              <MessageCircle size={20} className="text-gray-600 group-hover:text-emerald-600" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group">
              <Heart size={20} className="text-gray-600 group-hover:text-red-500" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group">
              <User size={20} className="text-gray-600 group-hover:text-blue-500" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group">
              <Settings size={20} className="text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          // Chat Interface
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${selectedChat.bgColor} rounded-full flex items-center justify-center text-white font-medium mr-3`}>
                  {selectedChat.initials}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Start your conversation with {selectedChat.name}</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Welcome Screen
          <div 
            className="flex-1 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(34, 197, 94, 0.1) 100%)',
            }}
          >
            <div className="text-center">
              <div className="mb-8">
                <div 
                  className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.3), rgba(139, 92, 246, 0.3), rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3))',
                  }}
                >
                  <MessageCircle size={48} className="text-emerald-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to TalkSphere</h1>
              <p className="text-lg text-gray-600 mb-8">Select a conversation to start messaging</p>
              
              <div className="flex justify-center gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Start New Chat
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;