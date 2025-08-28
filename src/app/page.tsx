'use client';

import { useState } from 'react';

interface Player {
  id: string;
  name: string;
  color: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('rules');
  const [players] = useState<Player[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏌️‍♂️ Wedge & Wiffle
          </h1>
          <p className="text-white/80">Lawn Golf Drinking Game (21+)</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'rules'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Rules
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'scorecard'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 Scorecard
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'rules' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">🎯 Game Rules</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Setup</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>9 holes marked with flags, cones, or sticks</li>
                    <li>One wedge & unique-colored wiffle ball per player</li>
                    <li>Course = backyard, field, or lawn with obstacles</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">How To Play</h3>
                  <ol className="list-decimal list-inside text-gray-700">
                    <li>Tee Off: Everyone shoots toward the target in turn</li>
                    <li>Scoring a Hole: Land within 1 stride (≈3 ft) of the flag</li>
                    <li>Taking Turns: Each stroke = 1 point. Lowest total wins</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">🍻 Drinking Rules</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Foiled: Take a sip if you reject a foil</li>
                    <li>Overshoot (2+ strides past target) → +1 sip</li>
                    <li>Out of bounds → +1 sip & reset</li>
                    <li>Triple Bogey → finish your drink before next hole</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">🌊 Waterfall Ceremony</h3>
                  <p className="text-blue-700">After each hole, players drink in order from lowest to highest score!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scorecard' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">🏆 Scorecard</h2>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  + Add Player
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  ⚙️ Edit Par
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  🔄 Clear Scores
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  🗑️ Reset Game
                </button>
              </div>

              {/* Scorecard Table */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Score Tracking</h3>
                {players.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Add players to start tracking scores!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Hole</th>
                          <th className="border p-2">Par</th>
                          {players.map((player, i) => (
                            <th key={i} className="border p-2">{player.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5,6,7,8,9].map(hole => (
                          <tr key={hole}>
                            <td className="border p-2 text-center font-bold">{hole}</td>
                            <td className="border p-2 text-center">4</td>
                            {players.map((player, i) => (
                              <td key={i} className="border p-2">
                                <input 
                                  type="number" 
                                  className="w-full text-center border rounded px-2 py-1"
                                  min="1" 
                                  max="15"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p>🐸 Presented by Toad Hollow 🐸</p>
          <p className="text-sm">Drink responsibly and have fun! 🍻🏌️‍♂️</p>
        </div>
      </div>
    </div>
  );
}