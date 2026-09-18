'use client';

import { useState, useRef, useEffect } from 'react';

interface MemoryRoom {
  id: string;
  title: string;
  moment: string;
  emotion: string;
  timestamp: number;
  x: number;
  y: number;
}

export default function MemoryPalace() {
  const [rooms, setRooms] = useState<MemoryRoom[]>([]);
  const [title, setTitle] = useState('');
  const [moment, setMoment] = useState('');
  const [emotion, setEmotion] = useState('joy');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const emotions = {
    joy: { color: '#FFD700', symbol: '✨', label: 'Joy' },
    sorrow: { color: '#4B0082', symbol: '🖤', label: 'Sorrow' },
    wonder: { color: '#00CED1', symbol: '🌀', label: 'Wonder' },
    peace: { color: '#90EE90', symbol: '☮', label: 'Peace' },
    love: { color: '#FF69B4', symbol: '💗', label: 'Love' },
    mystery: { color: '#8B008B', symbol: '🔮', label: 'Mystery' },
    nostalgia: { color: '#DEB887', symbol: '🍂', label: 'Nostalgia' },
    courage: { color: '#FF4500', symbol: '⚡', label: 'Courage' },
  };

  const addRoom = () => {
    if (!title.trim() || !moment.trim()) return;

    const newRoom: MemoryRoom = {
      id: Date.now().toString(),
      title,
      moment,
      emotion,
      timestamp: Date.now(),
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
    };

    setRooms([...rooms, newRoom]);
    setTitle('');
    setMoment('');
    setEmotion('joy');
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    setSelectedRoom(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addRoom();
  };

  const emotionData = emotions[emotion as keyof typeof emotions];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">The Memory Palace</h1>
        <p className="text-slate-400">
          Build your own mental palace. Each room holds a moment. Each moment, a piece of you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Add a Memory</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 block mb-1">Memory Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="The day we..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">What happened?</label>
                <textarea
                  value={moment}
                  onChange={(e) => setMoment(e.target.value)}
                  placeholder="Describe the moment..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-400 h-24 resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-2">Emotion</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(emotions).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setEmotion(key)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        emotion === key
                          ? `bg-slate-100 text-slate-900`
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      title={data.label}
                    >
                      {data.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addRoom}
                disabled={!title.trim() || !moment.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded px-4 py-2 font-medium transition-colors"
              >
                Add to Palace
              </button>

              <div className="text-xs text-slate-400 pt-4 border-t border-slate-700">
                Memories: {rooms.length}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-6">
            {/* Palace Canvas */}
            <div
              ref={containerRef}
              className="w-full bg-gradient-radial from-slate-700 to-slate-900 rounded-lg overflow-hidden relative"
              style={{ height: '500px' }}
            >
              {rooms.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏛️</div>
                    <p>Build your palace by adding memories</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Grid lines (optional palace backdrop) */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
                    viewBox="0 0 400 400"
                  >
                    <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="1" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="1" />
                    <circle cx="200" cy="200" r="50" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="1" />
                  </svg>

                  {/* Memory rooms */}
                  {rooms.map((room) => {
                    const emotionInfo = emotions[room.emotion as keyof typeof emotions];
                    const isSelected = selectedRoom === room.id;

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(isSelected ? null : room.id)}
                        className="absolute cursor-pointer transition-all duration-200 group"
                        style={{
                          left: `${50 + (room.x / 300) * 40}%`,
                          top: `${50 + (room.y / 300) * 40}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div
                          className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl transition-all duration-200 ${
                            isSelected
                              ? 'scale-125 shadow-2xl'
                              : 'hover:scale-110 shadow-lg'
                          }`}
                          style={{
                            backgroundColor: emotionInfo.color + '20',
                            borderColor: emotionInfo.color,
                            boxShadow: isSelected
                              ? `0 0 30px ${emotionInfo.color}`
                              : `0 0 10px ${emotionInfo.color}`,
                          }}
                        >
                          {emotionInfo.symbol}
                        </div>
                        <div
                          className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs bg-slate-900 px-2 py-1 rounded border border-slate-700`}
                        >
                          {room.title}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Zoom controls */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.2))}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-sm"
              >
                Zoom Out
              </button>
              <span className="px-3 py-1 text-sm text-slate-400">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(Math.min(2, scale + 0.2))}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-sm"
              >
                Zoom In
              </button>
            </div>
          </div>

          {/* Selected Room Details */}
          {selectedRoom && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              {rooms.find((r) => r.id === selectedRoom) && (
                (() => {
                  const room = rooms.find((r) => r.id === selectedRoom)!;
                  const emotionInfo = emotions[room.emotion as keyof typeof emotions];

                  return (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{emotionInfo.symbol}</span>
                            <span className="text-sm text-slate-400">{emotionInfo.label}</span>
                          </div>
                          <h3 className="text-2xl font-bold">{room.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(room.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed whitespace-pre-wrap">
                        {room.moment}
                      </p>
                      <div className="text-xs text-slate-500">
                        WIZ whispers: This room holds {room.moment.split(' ').length} words of your
                        memory.
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 text-center text-slate-500 text-sm">
        <p>
          Ancient civilizations built palaces to remember. You just built one in your browser. The
          irony: we call it progress.
        </p>
      </div>
    </div>
  );
}
