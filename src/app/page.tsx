'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  color: string;
  hole1: number;
  hole2: number;
  hole3: number;
  hole4: number;
  hole5: number;
  hole6: number;
  hole7: number;
  hole8: number;
  hole9: number;
}

interface GameState {
  currentHole: number;
}

interface CourseSetup {
  par1: number;
  par2: number;
  par3: number;
  par4: number;
  par5: number;
  par6: number;
  par7: number;
  par8: number;
  par9: number;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({ currentHole: 1 });
  const [courseSetup, setCourseSetup] = useState<CourseSetup>({
    par1: 4, par2: 4, par3: 4, par4: 4, par5: 4,
    par6: 4, par7: 4, par8: 4, par9: 4
  });
  const [activeTab, setActiveTab] = useState('rules');
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showParEditModal, setShowParEditModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState('#10b981');
  const [waterfallActive, setWaterfallActive] = useState(false);
  const [waterfallStartTime, setWaterfallStartTime] = useState<number | null>(null);
  const [waterfallTime, setWaterfallTime] = useState('00:00');
  const [editingPars, setEditingPars] = useState<CourseSetup>({
    par1: 4, par2: 4, par3: 4, par4: 4, par5: 4,
    par6: 4, par7: 4, par8: 4, par9: 4
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('wedge-wiffle-players');
    const savedGameState = localStorage.getItem('wedge-wiffle-gamestate');
    const savedCourseSetup = localStorage.getItem('wedge-wiffle-coursesetup');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedGameState) setGameState(JSON.parse(savedGameState));
    if (savedCourseSetup) setCourseSetup(JSON.parse(savedCourseSetup));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('wedge-wiffle-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('wedge-wiffle-gamestate', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('wedge-wiffle-coursesetup', JSON.stringify(courseSetup));
  }, [courseSetup]);

  // Waterfall timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (waterfallActive && waterfallStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - waterfallStartTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setWaterfallTime(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [waterfallActive, waterfallStartTime]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      color: newPlayerColor,
      hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 0,
      hole6: 0, hole7: 0, hole8: 0, hole9: 0
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setShowAddPlayerModal(false);
    // Generate new random color for next player
    const colors = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    setNewPlayerColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const removePlayer = (playerId: string) => {
    if (!confirm('Are you sure you want to remove this player?')) return;

    setPlayers(players.filter(p => p.id !== playerId));
  };

  const updateScore = (playerId: string, hole: number, score: number) => {
    setPlayers(players.map(p => p.id === playerId 
      ? { ...p, [`hole${hole}`]: score } as Player 
      : p));
  };

  const nextHole = () => {
    if (gameState.currentHole < 9) {
      const newHole = gameState.currentHole + 1;
      setGameState({ currentHole: newHole });
    }
  };

  const clearScores = () => {
    if (!confirm('Are you sure you want to clear all scores? This will reset the game but keep all players.')) return;

    setPlayers(players.map(player => ({
      ...player,
      hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 0,
      hole6: 0, hole7: 0, hole8: 0, hole9: 0
    })));
    setGameState({ currentHole: 1 });
  };

  const resetGame = () => {
    if (!confirm('Are you sure you want to reset the entire game? This will remove all players and scores.')) return;

    setPlayers([]);
    setGameState({ currentHole: 1 });
    stopWaterfallCeremony();
  };

  const updateParValues = () => {
    setCourseSetup(editingPars);
    setShowParEditModal(false);
  };

  const resetParValues = () => {
    if (!confirm('Reset all par values to 4?')) return;

    setCourseSetup({
      par1: 4, par2: 4, par3: 4, par4: 4, par5: 4,
      par6: 4, par7: 4, par8: 4, par9: 4
    });
    setEditingPars({
      par1: 4, par2: 4, par3: 4, par4: 4, par5: 4,
      par6: 4, par7: 4, par8: 4, par9: 4
    });
  };

  const openParEditModal = () => {
    setEditingPars({ ...courseSetup });
    setShowParEditModal(true);
  };

  const getParForHole = (hole: number): number => {
    const parKey = `par${hole}` as keyof CourseSetup;
    return courseSetup[parKey] as number || 4;
  };

  const getTotalPar = (): number => {
    let total = 0;
    for (let i = 1; i <= 9; i++) {
      total += getParForHole(i);
    }
    return total;
  };

  const getPlayerScore = (player: Player, hole: number): number => {
    const holeKey = `hole${hole}` as keyof Player;
    return (player[holeKey] as number) || 0;
  };

  const getPlayerTotal = (player: Player): number => {
    let total = 0;
    for (let i = 1; i <= 9; i++) {
      total += getPlayerScore(player, i);
    }
    return total;
  };

  const getWaterfallOrder = () => {
    if (players.length === 0) return [];
    
    const playersWithScores = players.map(player => ({
      ...player,
      currentScore: getPlayerScore(player, gameState.currentHole)
    }));

    return playersWithScores.sort((a, b) => {
      if (a.currentScore === 0 && b.currentScore === 0) return 0;
      if (a.currentScore === 0) return 1;
      if (b.currentScore === 0) return -1;
      return a.currentScore - b.currentScore;
    });
  };

  const startWaterfallCeremony = () => {
    if (players.length === 0) {
      alert('Add players first!');
      return;
    }
    setWaterfallActive(true);
    setWaterfallStartTime(Date.now());
  };

  const stopWaterfallCeremony = () => {
    setWaterfallActive(false);
    setWaterfallStartTime(null);
    setWaterfallTime('00:00');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm min-h-screen shadow-2xl">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 text-center shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4 animate-bounce">
              🐸 🏌️‍♂️ 🐸
            </div>
            <h1 className="text-4xl font-bold mb-2 text-shadow">🏌️‍♂️ Wedge & Wiffle</h1>
            <p className="text-sm opacity-80 uppercase tracking-wider italic mb-1">presented by</p>
            <h2 className="text-2xl font-semibold text-yellow-200 mb-4 animate-pulse">🐸 Toad Hollow 🐸</h2>
            <p className="text-lg opacity-90">Lawn Golf Drinking Game (21+)</p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex border-b bg-white overflow-x-auto">
          {[
            { id: 'rules', label: '📋 Rules', emoji: '📋' },
            { id: 'scorecard', label: '🏆 Scorecard', emoji: '🏆' },
            { id: 'waterfall', label: '🌊 Waterfall', emoji: '🌊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-32 px-4 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-3 border-emerald-500 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="p-6">
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <RulesCard title="🎯 Setup" items={[
                '9 "holes" marked with flags, cones, or sticks',
                'One wedge & unique-colored wiffle ball per player',
                'Course = backyard, field, or lawn with obstacles'
              ]} />
              
              <RulesCard title="🏌️ How To Play" items={[
                '<strong>Tee Off:</strong> Everyone shoots toward the target in turn',
                '<strong>Scoring a Hole:</strong> Land within 1 stride (≈3 ft) of the flag, or hit the flagpole directly',
                '<strong>Taking Turns:</strong> Each stroke = 1 point. Lowest total after 9 holes wins'
              ]} ordered />
              
              <RulesCard title="⚔️ Foiling (Croquet-Style)" items={[
                'If your ball strikes another, you Foil:',
                '<strong>Send:</strong> Get a free swing to pitch the opponent\'s ball in any desired direction',
                '<strong>Burn:</strong> Return the opponent\'s ball to the tee for that hole',
                '<strong>Foiled Player Choice:</strong> Accept or take a 1-drink penalty (ball stays in original spot)'
              ]} />
              
              <RulesCard title="🍻 Drinking Rules" items={[
                '<strong>Foiled:</strong> Take a sip if you reject a foil',
                '<strong>Hazards:</strong>',
                '• Overshoot (2+ strides past target) → +1 sip',
                '• Out of bounds (driveway, roof, etc.) → +1 sip & reset',
                '• Triple Bogey (3+ over par) → finish your drink before next hole'
              ]} />
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">🌊 Waterfall Ceremony (After Each Hole)</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Players line up in order of strokes (lowest first)</li>
                  <li>The lowest scorer begins drinking; no one else may stop until they do</li>
                  <li>Once they stop, the next lowest may stop, and so on</li>
                  <li>Highest scorer(s) end up drinking longest!</li>
                </ol>
              </div>
              
              <RulesCard title="🏆 Victory" items={[
                '<strong>Stroke Play:</strong> Lowest total strokes after 9 holes wins',
                'Loser(s) buy/mix a communal drink or do a camp dare'
              ]} />
            </div>
          )}

          {/* Scorecard Tab */}
          {activeTab === 'scorecard' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  + Add Player
                </button>
                <button
                  onClick={openParEditModal}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  ⚙️ Edit Par
                </button>
                <button
                  onClick={clearScores}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  🔄 Clear Scores
                </button>
                <button
                  onClick={resetGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  🗑️ Reset Game
                </button>
              </div>

              {/* Players */}
              {players.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {players.map(player => (
                    <div
                      key={player.id}
                      className="flex items-center gap-2 bg-white border-2 rounded-full px-4 py-2 shadow-sm"
                      style={{ borderColor: player.color }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-medium">{player.name}</span>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Scorecard Table */}
              {players.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Hole</th>
                        <th className="px-4 py-3 text-center font-semibold">Par</th>
                        {players.map(player => (
                          <th key={player.id} className="px-4 py-3 text-center font-semibold">
                            <div style={{ color: player.color }}>{player.name}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                        <tr key={hole} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">{hole}</td>
                          <td className="px-4 py-3 text-center font-semibold">{getParForHole(hole)}</td>
                          {players.map(player => (
                            <td key={player.id} className="px-4 py-3 text-center">
                              <input
                                type="number"
                                min="1"
                                max="15"
                                value={getPlayerScore(player, hole) || ''}
                                onChange={(e) => updateScore(player.id, hole, parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-t-2 border-emerald-500 bg-emerald-50 font-semibold">
                        <td className="px-4 py-3">Total</td>
                        <td className="px-4 py-3 text-center">{getTotalPar()}</td>
                        {players.map(player => (
                          <td key={player.id} className="px-4 py-3 text-center">
                            {getPlayerTotal(player)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🏌️‍♂️</div>
                  <p className="text-xl">Add players to start tracking scores!</p>
                </div>
              )}

              {/* Current Hole Info */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  Current Hole: <span className="text-emerald-600">{gameState.currentHole}</span>
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setActiveTab('waterfall')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    🌊 Start Waterfall
                  </button>
                  <button
                    onClick={nextHole}
                    disabled={gameState.currentHole >= 9}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {gameState.currentHole >= 9 ? 'Game Complete!' : 'Next Hole →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Waterfall Tab */}
          {activeTab === 'waterfall' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">🌊 Waterfall Ceremony</h2>
                <p className="text-gray-600 text-center mb-6">
                  After each hole, players drink in order from lowest to highest score!
                </p>

                {/* Waterfall Order */}
                <div className="space-y-3 mb-6">
                  {players.length === 0 ? (
                    <p className="text-center text-gray-500 italic py-8">
                      Add players in the Scorecard tab to see waterfall order
                    </p>
                  ) : (
                    getWaterfallOrder().map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4"
                        style={{ borderLeftColor: player.color }}
                      >
                        <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-600">
                            Hole {gameState.currentHole}: {player.currentScore || 'Not scored'} strokes
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Waterfall Controls */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {!waterfallActive ? (
                    <button
                      onClick={startWaterfallCeremony}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                    >
                      🌊 Start Ceremony
                    </button>
                  ) : (
                    <button
                      onClick={stopWaterfallCeremony}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                    >
                      ⏹️ Stop Waterfall
                    </button>
                  )}
                </div>

                {/* Waterfall Timer */}
                {waterfallActive && (
                  <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800">Waterfall in Progress...</h3>
                    <div className="text-6xl font-mono font-bold text-blue-600">{waterfallTime}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Add New Player</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <input
                type="color"
                value={newPlayerColor}
                onChange={(e) => setNewPlayerColor(e.target.value)}
                className="w-full h-12 border rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addPlayer}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Add Player
              </button>
              <button
                onClick={() => {
                  setShowAddPlayerModal(false);
                  setNewPlayerName('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Par Edit Modal */}
      {showParEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Edit Par Values</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => {
                const parKey = `par${hole}` as keyof CourseSetup;
                return (
                  <div key={hole} className="text-center">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Hole {hole}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingPars[parKey] as number}
                      onChange={(e) => setEditingPars({
                        ...editingPars,
                        [parKey]: parseInt(e.target.value) || 1
                      })}
                      className="w-full px-2 sm:px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                  </div>
                );
              })}
            </div>
            <div className="text-center mb-4">
              <p className="text-sm sm:text-base text-gray-600">
                Total Par: <span className="font-semibold text-purple-600">
                  {Object.values(editingPars).reduce((sum, par) => sum + (typeof par === 'number' ? par : 0), 0)}
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={updateParValues}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Save Par Values
              </button>
              <button
                onClick={resetParValues}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Reset to 4s
              </button>
              <button
                onClick={() => setShowParEditModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
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

function RulesCard({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const ListComponent = ordered ? 'ol' : 'ul';
  const listClass = ordered ? 'list-decimal list-inside' : 'list-disc list-inside';
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <ListComponent className={`space-y-2 text-gray-700 ${listClass}`}>
        {items.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ListComponent>
    </div>
  );
}