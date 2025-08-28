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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏌️‍♂️ Wedge & Wiffle
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.125rem'
          }}>Lawn Golf Drinking Game (21+)</p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('rules')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                margin: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'rules' ? '#10b981' : 'transparent',
                color: activeTab === 'rules' ? 'white' : '#6b7280'
              }}
            >
              📋 Rules
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                margin: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'scorecard' ? '#10b981' : 'transparent',
                color: activeTab === 'scorecard' ? 'white' : '#6b7280'
              }}
            >
              🏆 Scorecard
            </button>
            <button
              onClick={() => setActiveTab('waterfall')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                margin: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'waterfall' ? '#10b981' : 'transparent',
                color: activeTab === 'waterfall' ? 'white' : '#6b7280'
              }}
            >
              🌊 Waterfall
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center'
              }}>🎯 Game Rules</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                <div style={{
                  background: '#f0fdf4',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '12px',
                    color: '#166534'
                  }}>🏌️ Setup</h3>
                  <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                    <li style={{ marginBottom: '8px' }}>9 holes marked with flags, cones, or sticks</li>
                    <li style={{ marginBottom: '8px' }}>One wedge & unique-colored wiffle ball per player</li>
                    <li style={{ marginBottom: '8px' }}>Course = backyard, field, or lawn with obstacles</li>
                  </ul>
                </div>

                <div style={{
                  background: '#eff6ff',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '12px',
                    color: '#1e40af'
                  }}>🎮 How To Play</h3>
                  <ol style={{ listStyle: 'decimal', paddingLeft: '20px', color: '#374151' }}>
                    <li style={{ marginBottom: '8px' }}>Tee Off: Everyone shoots toward the target in turn</li>
                    <li style={{ marginBottom: '8px' }}>Scoring: Land within 1 stride (≈3 ft) of flag</li>
                    <li style={{ marginBottom: '8px' }}>Each stroke = 1 point. Lowest total wins</li>
                  </ol>
                </div>

                <div style={{
                  background: '#faf5ff',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e9d5ff'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '12px',
                    color: '#7c3aed'
                  }}>⚔️ Foiling</h3>
                  <p style={{ color: '#374151', marginBottom: '8px' }}>If your ball strikes another:</p>
                  <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                    <li style={{ marginBottom: '4px' }}><strong>Send:</strong> Move opponent&apos;s ball 1 wedge-head away</li>
                    <li style={{ marginBottom: '4px' }}><strong>Burn:</strong> Reset opponent&apos;s ball to previous spot</li>
                    <li style={{ marginBottom: '4px' }}><strong>Choice:</strong> Accept or drink & ignore</li>
                  </ul>
                </div>

                <div style={{
                  background: '#fef2f2',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '12px',
                    color: '#dc2626'
                  }}>🍻 Drinking Rules</h3>
                  <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                    <li style={{ marginBottom: '4px' }}>Reject foil → 1 sip</li>
                    <li style={{ marginBottom: '4px' }}>Overshoot 2+ strides → 1 sip</li>
                    <li style={{ marginBottom: '4px' }}>Out of bounds → 1 sip & reset</li>
                    <li style={{ marginBottom: '4px' }}>Triple Bogey → finish drink</li>
                  </ul>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                padding: '24px',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6',
                marginTop: '24px'
              }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  marginBottom: '12px',
                  color: '#1e40af'
                }}>🌊 Waterfall Ceremony (After Each Hole)</h3>
                <ol style={{ listStyle: 'decimal', paddingLeft: '20px', color: '#374151' }}>
                  <li style={{ marginBottom: '8px' }}>Players line up in order of strokes (lowest first)</li>
                  <li style={{ marginBottom: '8px' }}>Lowest scorer begins drinking; no one else may stop until they do</li>
                  <li style={{ marginBottom: '8px' }}>Once they stop, next lowest may stop, and so on</li>
                  <li style={{ marginBottom: '8px' }}>Highest scorer(s) end up drinking longest!</li>
                </ol>
              </div>

              <div style={{
                background: '#fffbeb',
                padding: '24px',
                borderRadius: '8px',
                textAlign: 'center',
                marginTop: '24px',
                border: '1px solid #fed7aa'
              }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  marginBottom: '12px',
                  color: '#d97706'
                }}>🏆 Victory</h3>
                <p style={{ color: '#374151', marginBottom: '8px' }}>Lowest total strokes after 9 holes wins!</p>
                <p style={{ color: '#374151' }}>Loser(s) buy/mix a communal drink or do a camp dare.</p>
              </div>
            </div>
          )}

          {/* Scorecard Tab */}
          {activeTab === 'scorecard' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center'
              }}>🏆 Scorecard</h2>
              
              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <button 
                  onClick={() => setShowAddPlayerModal(true)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  + Add Player
                </button>
                <button 
                  onClick={() => alert('Par editing feature - coming soon!')}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Edit Par
                </button>
                <button 
                  onClick={clearScores}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Clear Scores
                </button>
                <button 
                  onClick={resetGame}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Reset Game
                </button>
              </div>

              {/* Players List */}
              {players.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Players ({players.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {players.map(player => (
                      <div key={player.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#f3f4f6',
                        padding: '8px 12px',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: player.color
                        }}></div>
                        <span style={{ fontWeight: '500' }}>{player.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>({getPlayerTotal(player)})</span>
                        <button 
                          onClick={() => removePlayer(player.id)}
                          style={{
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '4px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scorecard Table */}
              <div style={{
                overflowX: 'auto',
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                {players.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '16px' }}>No players added yet!</p>
                    <button 
                      onClick={() => setShowAddPlayerModal(true)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Your First Player
                    </button>
                  </div>
                ) : (
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    <thead>
                      <tr style={{ background: '#e5e7eb' }}>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold' }}>Hole</th>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold' }}>Par</th>
                        {players.map(player => (
                          <th key={player.id} style={{
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontWeight: 'bold',
                            color: player.color
                          }}>
                            {player.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3,4,5,6,7,8,9].map(hole => (
                        <tr key={hole} style={{
                          background: hole === currentHole ? '#dbeafe' : 'white'
                        }}>
                          <td style={{
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}>{hole}</td>
                          <td style={{
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            textAlign: 'center'
                          }}>4</td>
                          {players.map(player => (
                            <td key={player.id} style={{
                              border: '1px solid #d1d5db',
                              padding: '8px'
                            }}>
                              <input 
                                type="number" 
                                style={{
                                  width: '100%',
                                  textAlign: 'center',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  padding: '4px 8px'
                                }}
                                min="1" 
                                max="15"
                                value={player.scores[hole - 1] || ''}
                                onChange={(e) => updateScore(player.id, hole, parseInt(e.target.value) || 0)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr style={{ background: '#dcfce7', fontWeight: 'bold' }}>
                        <td style={{
                          border: '1px solid #d1d5db',
                          padding: '12px',
                          textAlign: 'center'
                        }}>TOTAL</td>
                        <td style={{
                          border: '1px solid #d1d5db',
                          padding: '12px',
                          textAlign: 'center'
                        }}>36</td>
                        {players.map(player => (
                          <td key={player.id} style={{
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            textAlign: 'center'
                          }}>
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
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <div style={{
                    background: '#dbeafe',
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '8px' }}>Current Hole: {currentHole}</h3>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                      <button 
                        onClick={startWaterfall}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🌊 Start Waterfall
                      </button>
                      <button 
                        onClick={() => setCurrentHole(Math.min(9, currentHole + 1))}
                        style={{
                          background: '#6b7280',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
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
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center'
              }}>🌊 Waterfall Ceremony</h2>
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  After each hole, players drink in order from lowest to highest score!
                </p>
                
                {waterfallActive && (
                  <div style={{
                    background: '#dbeafe',
                    padding: '24px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1e40af',
                      marginBottom: '8px'
                    }}>Waterfall in Progress...</h3>
                    <div style={{
                      fontSize: '2.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#2563eb'
                    }}>{waterfallTime}</div>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
                  {!waterfallActive ? (
                    <button 
                      onClick={startWaterfall}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      🌊 Start Waterfall Ceremony
                    </button>
                  ) : (
                    <button 
                      onClick={stopWaterfall}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ⏹️ Stop Waterfall
                    </button>
                  )}
                </div>
              </div>

              {/* Waterfall Order */}
              <div style={{
                background: '#f9fafb',
                padding: '24px',
                borderRadius: '8px'
              }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>Drinking Order (Hole {currentHole})</h3>
                {players.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6b7280' }}>Add players in the Scorecard tab to see waterfall order</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {getWaterfallOrder().map((player, index) => (
                      <div key={player.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{
                          background: '#3b82f6',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: player.color
                        }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
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
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <p style={{ fontSize: '1.125rem' }}>🐸 Presented by Toad Hollow 🐸</p>
          <p style={{ fontSize: '0.875rem' }}>Drink responsibly and have fun! 🍻🏌️‍♂️</p>
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              textAlign: 'center'
            }}>Add New Player</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>Player Name</label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Enter player name"
                maxLength={20}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>Player Color</label>
              <input
                type="color"
                value={newPlayerColor}
                onChange={(e) => setNewPlayerColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={addPlayer}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add Player
              </button>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
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
