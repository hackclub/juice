import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Games() {
  const [games, setGames] = useState([]);
  const [selectedHacker, setSelectedHacker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [editMessage, setEditMessage] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const response = await fetch(`/api/get-magazine?token=${storedToken || ''}`);
        const data = await response.json();
        console.log('Screenshot format example:', data[0]?.Screenshot);
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } 
  }, []);

  const handleHackerClick = (hacker) => {
    console.log('Selected hacker screenshot:', hacker.Screenshot);
    setSelectedHacker(hacker);
    setIsEditing(false);
    setEditedFields({});
    setEditMessage('');
  };

  const handleBack = () => {
    setSelectedHacker(null);
    setIsEditing(false);
    setEditedFields({});
    setEditMessage('');
  };

  const handleEditClick = () => {
    const token = localStorage.getItem("token");

    setIsEditing(true);
    setEditedFields({
      "Code URL": selectedHacker["Code URL"] || '',
      "Playable URL": selectedHacker["Playable URL"] || '',
      "videoURL": selectedHacker["videoURL"] || '',
      "GitHub Username": selectedHacker["GitHub Username"] || '',
      "Description": selectedHacker["Description"] || '',
    });
  };

  const handleInputChange = (field, value) => {
    setEditedFields({
      ...editedFields,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!token) {
      setEditMessage('Error: Token is required to save changes');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/edit-magazine', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedHacker.id,
          token: token,
          fields: editedFields
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update the local state with the edited data
        setSelectedHacker({
          ...selectedHacker,
          ...data
        });
        
        // Update the games list
        setGames(games.map(game => 
          game.id === selectedHacker.id ? { ...game, ...data } : game
        ));
        
        setIsEditing(false);
        setEditMessage('Changes saved successfully!');
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setEditMessage('');
        }, 3000);
      } else {
        setEditMessage(`Error: ${data.message || 'Failed to save changes'}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setEditMessage('Error: Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({});
    setEditMessage('');
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background-color: #FFF600;
            min-height: 100vh;
          }
          @media (max-width: 768px) {
            .header {
              flex-direction: column;
              align-items: flex-start;
            }
            .header h1 {
              margin-bottom: 4px;
            }
            .main-image {
              width: 100%;
              height: auto;
            }
            .video-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .video-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          .video-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          .video-card {
            border: 1px solid #000;
            padding: 10px;
            background-color: #FFF600;
            height: 320px;
            display: flex;
            flex-direction: column;
          }
          .video-card video {
            width: 100%;
            aspect-ratio: 16/9;
            margin-bottom: 6px;
            background: #000;
          }
          .video-card video::-webkit-media-controls-panel {
            display: none !important;
          }
          @media (max-width: 768px) {
            .video-card video::-webkit-media-controls-panel {
              display: flex !important;
            }
          }
          .video-card h3 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: bold;
          }
          .video-card .description-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 4px;
            padding-right: 8px;
          }
          .video-card .description-container::-webkit-scrollbar {
            width: 6px;
          }
          .video-card .description-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }
          .video-card .description-container::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 3px;
          }
          .video-card p {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
          }
          .video-card .date {
            font-size: 12px;
            color: #666;
            margin-top: auto;
          }
        `}</style>
      </Head>
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#FFF600",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 16,
        paddingTop: 4
      }}>
        <div style={{
          maxWidth: 700,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "0 16px",
          boxSizing: "border-box"
        }}>
          {selectedHacker ? (
            <>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <button 
                  onClick={handleBack}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#000',
                    color: '#FFF600',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                {(!isEditing && selectedHacker.IsOwnedByMe) && (
                  <button 
                    onClick={handleEditClick}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#000',
                      color: '#FFF600',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
              <h1 style={{color: '#000', fontSize: 32, marginBottom: 16}}>
                {selectedHacker["First Name"]} {selectedHacker["Last Name"]}'s Game
              </h1>
              <div style={{
                width: '100%',
                maxWidth: 700,
                aspectRatio: '16/9',
                marginBottom: 20,
                border: '1px solid #000',
                overflow: 'hidden'
              }}>
                {selectedHacker["Screenshot"]?.[0]?.url ? (
                  <img 
                    src={selectedHacker["Screenshot"][0].url} 
                    alt={`${selectedHacker["First Name"]}'s game screenshot`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <p style={{color: '#FFF600', margin: 0, fontSize: 18}}>Image Missing...</p>
                  </div>
                )}
              </div>
              {editMessage && (
                <div style={{
                  padding: '10px',
                  marginBottom: '20px',
                  backgroundColor: '#FFF600',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  {editMessage}
                </div>
              )}
              {isEditing ? (
                <div style={{color: '#000', marginBottom: 20}}>
                  <h2 style={{fontSize: 24, marginBottom: 12}}>Edit Game Details</h2>
                  <div style={{marginBottom: 16}}>
                    <label style={{display: 'block', marginBottom: 4}}>Description:</label>
                    <textarea 
                      value={editedFields["Description"] || ''}
                      onChange={(e) => handleInputChange("Description", e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: '#FFF600'
                      }}
                    />
                  </div>
                  <div style={{marginBottom: 16}}>
                    <label style={{display: 'block', marginBottom: 4}}>Code URL:</label>
                    <input 
                      type="text"
                      value={editedFields["Code URL"] || ''}
                      onChange={(e) => handleInputChange("Code URL", e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: '#FFF600'
                      }}
                    />
                  </div>
                  <div style={{marginBottom: 16}}>
                    <label style={{display: 'block', marginBottom: 4}}>Playable URL:</label>
                    <input 
                      type="text"
                      value={editedFields["Playable URL"] || ''}
                      onChange={(e) => handleInputChange("Playable URL", e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: '#FFF600'
                      }}
                    />
                  </div>
                  <div style={{marginBottom: 16}}>
                    <label style={{display: 'block', marginBottom: 4}}>Video URL:</label>
                    <input 
                      type="text"
                      value={editedFields["videoURL"] || ''}
                      onChange={(e) => handleInputChange("videoURL", e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: '#FFF600'
                      }}
                    />
                  </div>
                  <div style={{marginBottom: 16}}>
                    <label style={{display: 'block', marginBottom: 4}}>GitHub Username:</label>
                    <input 
                      type="text"
                      value={editedFields["GitHub Username"] || ''}
                      onChange={(e) => handleInputChange("GitHub Username", e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: '#FFF600'
                      }}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                    <button 
                      onClick={handleCancel}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#FFF600',
                        color: '#000',
                        border: '1px solid #000',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#000',
                        color: '#FFF600',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {selectedHacker["Description"] && (
                    <div style={{color: '#000', marginBottom: 20}}>
                      {/* <h2 style={{fontSize: 24, marginBottom: 12}}>About the Game</h2> */}
                      <p style={{
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}>{selectedHacker["Description"]}</p>
                    </div>
                  )}
                  <div style={{color: '#000', marginBottom: 20}}>
                    {/* <h2 style={{fontSize: 24, marginBottom: 12}}>Links</h2> */}
                    <p>Code URL: <a href={selectedHacker["Code URL"]} style={{color: '#000'}}>{selectedHacker["Code URL"]}</a></p>
                    <p>Playable URL: <a href={selectedHacker["Playable URL"]} style={{color: '#000'}}>{selectedHacker["Playable URL"]}</a></p>
                    <p>Video: {selectedHacker["videoURL"] === "--" ? (
                      <span style={{color: '#000'}}>--</span>
                    ) : (
                      <a href={selectedHacker["videoURL"]} style={{color: '#000'}}>{selectedHacker["videoURL"]}</a>
                    )}</p>
                    <p>GitHub Username: {selectedHacker["GitHub Username"]}</p>
                    {selectedHacker["SlackHandle"] && (
                      <p>Slack: <a href={`https://hackclub.slack.com/team/${selectedHacker["SlackID"]}`} style={{color: '#000'}}>{selectedHacker["SlackHandle"]}</a></p>
                    )}
                  </div>
                  
                  {/* Dev Log Progress Videos Section */}
                  {selectedHacker["juiceStretches"] && selectedHacker["juiceStretches"].length > 0 && (
                    <div style={{color: '#000', marginBottom: 20}}>
                      <h2 style={{fontSize: 24, marginBottom: 12}}>Dev Log Progress Videos</h2>
                      <div className="video-grid">
                        {selectedHacker["juiceStretches"]
                          .filter(stretch => stretch.video && !stretch.isCancelled)
                          .map((stretch, index) => (
                            <div key={index} className="video-card">
                              <video 
                                controls
                                playsInline
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => {
                                  e.target.pause();
                                  e.target.currentTime = 0;
                                }}
                                onClick={(e) => {
                                  if (e.target.requestFullscreen) {
                                    e.target.requestFullscreen();
                                  } else if (e.target.webkitRequestFullscreen) {
                                    e.target.webkitRequestFullscreen();
                                  } else if (e.target.msRequestFullscreen) {
                                    e.target.msRequestFullscreen();
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <source src={stretch.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <h3>Hours Spent: {(stretch.timeWorkedHours || 0).toFixed(1)}</h3>
                              <div className="description-container">
                                <p>{stretch.description || 'No description available'}</p>
                              </div>
                              <p style={{fontSize: 12}}>
                                {formatDate(stretch.createdTime)}
                              </p>
                            </div>
                          ))}
                      </div>
                      {selectedHacker["juiceStretches"].filter(stretch => stretch.video && !stretch.isCancelled).length === 0 && (
                        <p>No dev log videos available for this game.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="header" style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                <h1 style={{fontSize: 24, marginTop: 8, marginBottom: 8}}>Juice Popup Cafe</h1>
                <h1 style={{fontSize: 24, marginTop: 8, marginBottom: 8}}>Shanghai, China</h1> 
              </div> 
              <img className="main-image" style={{width: "100%", maxWidth: 700}} src="./JuiceArchive.png"/>
              <p style={{marginTop: 16}}>The Juice popup cafe was a two month online game jam followed by an in-person popup hacker cafe in Shanghai, China. Over 90 teenagers from 20+ countries flew to Shanghai, China to present their games in our popup cafe and juice a bunch of fruits to give to the locals as they tried their game</p>
              <p style={{marginTop: 12}}>Paolo made a video series telling the story of Juice. Here's <a style={{color: "#000"}} href="https://youtu.be/fuTlToZ1SX8?feature=shared">episode one of Juice</a></p>
              <p style={{marginTop: 12}}>Below are the Hack Clubbers that participated in Juice and you can tap on them to see the game that they made & their journey making it</p>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                marginTop: '20px'
              }}>
              {games.length != 0 ? 
                games.map((game, index) => (
                  <div 
                    key={game.id} 
                    style={{
                      flex: '1 1 calc(33.333% - 20px)',
                      minWidth: '200px',
                      cursor: 'pointer',
                      '@media (max-width: 768px)': {
                        flex: '1 1 calc(50% - 20px)',
                      },
                      '@media (max-width: 480px)': {
                        flex: '1 1 100%',
                      }
                    }}
                    onClick={() => handleHackerClick(game)}
                  >
                    <p style={{
                      margin: '0',
                      padding: '10px',
                      backgroundColor: '#FFF600',
                      border: "1px solid #000",
                      borderRadius: '0px'
                    }}>
                      {game["First Name"]} {game["Last Name"]}
                    </p>
                  </div>
                )) 
                : 
                <p>Loading Games...</p>
               }
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
} 