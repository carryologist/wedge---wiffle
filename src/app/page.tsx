'use client';

import { useState } from 'react';

interface Player {
  id: string;
  name: string;
  color: string;
  scores: number[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('rules');
  const [players, setPlayers] = useState<Player[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState('#10b981');
  const [currentHole, setCurrentHole] = useState(1);
  const [waterfallActive, setWaterfallActive] = useState(false);
  const [waterfallStartTime, setWaterfallStartTime] = useState<number | null>(null);
  const [waterfallTime, setWaterfallTime] = useState('00:00');

  // Add player function
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      color: newPlayerColor,
      scores: new Array(9).fill(0)
    };
    
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setNewPlayerColor('#10b981');
    setShowAddPlayerModal(false);
  };

  // Remove player function
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  // Update score function
  const updateScore = (playerId: string, hole: number, score: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newScores = [...player.scores];
        newScores[hole - 1] = score;
        return { ...player, scores: newScores };
      }
      return player;
    }));
  };

  // Get player total
  const getPlayerTotal = (player: Player): number => {
    return player.scores.reduce((sum, score) => sum + score, 0);
  };

  // Clear all scores
  const clearScores = () => {
    if (confirm('Clear all scores?')) {
      setPlayers(players.map(player => ({
        ...player,
        scores: new Array(9).fill(0)
      })));
    }
  };

  // Reset game
  const resetGame = () => {
    if (confirm('Reset entire game? This will remove all players and scores.')) {
      setPlayers([]);
      setCurrentHole(1);
      setWaterfallActive(false);
      setWaterfallStartTime(null);
    }
  };

  // Waterfall functions
  const startWaterfall = () => {
    setWaterfallActive(true);
    setWaterfallStartTime(Date.now());
    setActiveTab('waterfall');
  };

  const stopWaterfall = () => {
    setWaterfallActive(false);
    setWaterfallStartTime(null);
  };

  // Update waterfall timer
  useState(() => {
    if (waterfallActive && waterfallStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - waterfallStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setWaterfallTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  // Get waterfall order (sorted by current hole score)
  const getWaterfallOrder = () => {
    return [...players].sort((a, b) => {
      const scoreA = a.scores[currentHole - 1] || 0;
      const scoreB = b.scores[currentHole - 1] || 0;
      return scoreA - scoreB;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🏌️‍♂️ Wedge & Wiffle
          </h1>
          <p className="text-white/80 text-lg">Lawn Golf Drinking Game (21+)</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg flex flex-wrap">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-md transition-colors m-1 ${
                activeTab === 'rules'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Rules
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-4 py-2 rounded-md transition-colors m-1 ${
                activeTab === 'scorecard'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 Scorecard
            </button>
            <button
              onClick={() => setActiveTab('waterfall')}
              className={`px-4 py-2 rounded-md transition-colors m-1 ${
                activeTab === 'waterfall'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌊 Waterfall
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 text-center">🎯 Game Rules</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-3 text-green-800">🏌️ Setup</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>9 holes marked with flags, cones, or sticks</li>
                    <li>One wedge & unique-colored wiffle ball per player</li>
                    <li>Course = backyard, field, or lawn with obstacles</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-3 text-blue-800">🎮 How To Play</h3>
                  <ol className="list-decimal list-inside text-gray-700 space-y-2">
                    <li>Tee Off: Everyone shoots toward the target in turn</li>
                    <li>Scoring: Land within 1 stride (≈3 ft) of flag</li>
                    <li>Each stroke = 1 point. Lowest total wins</li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-3 text-purple-800">⚔️ Foiling</h3>
                  <p className="text-lg text-gray-700 mb-2">If your ball strikes another:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Send:</strong> Move opponent&apos;s ball 1 wedge-head away</li>
                    <li><strong>Burn:</strong> Reset opponent&apos;s ball to previous spot</li>
                    <li><strong>Choice:</strong> Accept or drink & ignore</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-3 text-red-800">🍻 Drinking Rules</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Reject foil → 1 sip</li>
                    <li>Overshoot 2+ strides → 1 sip</li>
                    <li>Out of bounds → 1 sip & reset</li>
                    <li>Triple Bogey → finish drink</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-xl mb-3 text-blue-800">🌊 Waterfall Ceremony (After Each Hole)</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Players line up in order of strokes (lowest first)</li>
                  <li>Lowest scorer begins drinking; no one else may stop until they do</li>
                  <li>Once they stop, next lowest may stop, and so on</li>
                  <li>Highest scorer(s) end up drinking longest!</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <h3 className="font-bold text-xl mb-3 text-yellow-800">🏆 Victory</h3>
                <p className="text-gray-700">Lowest total strokes after 9 holes wins!</p>
                <p className="text-gray-700">Loser(s) buy/mix a communal drink or do a camp dare.</p>
              </div>
            </div>
          )}

          {/* Scorecard Tab */}
          {activeTab === 'scorecard' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-center">🏆 Scorecard</h2>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button 
                  onClick={() => setShowAddPlayerModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  + Add Player
                </button>
                <button 
                  onClick={() => alert('Par editing feature - coming soon!')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  ⚙️ Edit Par
                </button>
                <button 
                  onClick={clearScores}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  🔄 Clear Scores
                </button>
                <button 
                  onClick={resetGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  🗑️ Reset Game
                </button>
              </div>

              {/* Players List */}
              {players.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Players ({players.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {players.map(player => (
                      <div key={player.id} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: player.color }}
                        ></div>
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm text-gray-600">({getPlayerTotal(player)})</span>
                        <button 
                          onClick={() => removePlayer(player.id)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scorecard Table */}
              <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
                {players.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No players added yet!</p>
                    <button 
                      onClick={() => setShowAddPlayerModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      + Add Your First Player
                    </button>
                  </div>
                ) : (
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-3 font-bold">Hole</th>
                        <th className="border p-3 font-bold">Par</th>
                        {players.map(player => (
                          <th key={player.id} className="border p-3 font-bold" style={{ color: player.color }}>
                            {player.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3,4,5,6,7,8,9].map(hole => (
                        <tr key={hole} className={hole === currentHole ? 'bg-blue-50' : ''}>
                          <td className="border p-3 text-center font-bold">{hole}</td>
                          <td className="border p-3 text-center">4</td>
                          {players.map(player => (
                            <td key={player.id} className="border p-2">
                              <input 
                                type="number" 
                                className="w-full text-center border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1" 
                                max="15"
                                value={player.scores[hole - 1] || ''}
                                onChange={(e) => updateScore(player.id, hole, parseInt(e.target.value) || 0)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-green-100 font-bold">
                        <td className="border p-3 text-center">TOTAL</td>
                        <td className="border p-3 text-center">36</td>
                        {players.map(player => (
                          <td key={player.id} className="border p-3 text-center">
                            {getPlayerTotal(player)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {/* Current Hole & Waterfall */}
              {players.length > 0 && (
                <div className="mt-6 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg inline-block">
                    <h3 className="font-bold text-lg mb-2">Current Hole: {currentHole}</h3>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={startWaterfall}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        🌊 Start Waterfall
                      </button>
                      <button 
                        onClick={() => setCurrentHole(Math.min(9, currentHole + 1))}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Next Hole →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Waterfall Tab */}
          {activeTab === 'waterfall' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-center">🌊 Waterfall Ceremony</h2>
              
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  After each hole, players drink in order from lowest to highest score!
                </p>
                
                {waterfallActive && (
                  <div className="bg-blue-100 p-6 rounded-lg mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Waterfall in Progress...</h3>
                    <div className="text-4xl font-mono font-bold text-blue-600">{waterfallTime}</div>
                  </div>
                )}
                
                <div className="flex gap-4 justify-center mb-6">
                  {!waterfallActive ? (
                    <button 
                      onClick={startWaterfall}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      🌊 Start Waterfall Ceremony
                    </button>
                  ) : (
                    <button 
                      onClick={stopWaterfall}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      ⏹️ Stop Waterfall
                    </button>
                  )}
                </div>
              </div>

              {/* Waterfall Order */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4 text-center">Drinking Order (Hole {currentHole})</h3>
                {players.length === 0 ? (
                  <p className="text-center text-gray-500">Add players in the Scorecard tab to see waterfall order</p>
                ) : (
                  <div className="space-y-3">
                    {getWaterfallOrder().map((player, index) => (
                      <div key={player.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: player.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="font-bold">{player.name}</div>
                          <div className="text-sm text-gray-600">
                            Hole {currentHole}: {player.scores[currentHole - 1] || 0} strokes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p className="text-lg">🐸 Presented by Toad Hollow 🐸</p>
          <p className="text-sm">Drink responsibly and have fun! 🍻🏌️‍♂️</p>
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">Add New Player</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter player name"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player Color</label>
                <input
                  type="color"
                  value={newPlayerColor}
                  onChange={(e) => setNewPlayerColor(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addPlayer}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Add Player
              </button>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}