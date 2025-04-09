import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Games() {
  const [games, setGames] = useState([]);
  const [selectedHacker, setSelectedHacker] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/get-magazine');
        const data = await response.json();
        console.log('Screenshot format example:', data[0]?.Screenshot);
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleHackerClick = (hacker) => {
    console.log('Selected hacker screenshot:', hacker.Screenshot);
    setSelectedHacker(hacker);
  };

  const handleBack = () => {
    setSelectedHacker(null);
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
              <button 
                onClick={handleBack}
                style={{
                  alignSelf: 'flex-start',
                  marginBottom: '20px',
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
              <h1 style={{color: '#000', fontSize: 32, marginBottom: 16}}>
                {selectedHacker["First Name"]} {selectedHacker["Last Name"]}'s Game
              </h1>
              {selectedHacker["Screenshot"]?.[0]?.url ? (
                <img 
                  src={selectedHacker["Screenshot"][0].url} 
                  alt={`${selectedHacker["First Name"]}'s game screenshot`}
                  style={{
                    width: '100%',
                    maxWidth: 700,
                    marginBottom: 20,
                    border: '1px solid #000'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  maxWidth: 700,
                  aspectRatio: '16/9',
                  backgroundColor: '#000',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #000'
                }}>
                  <p style={{color: '#FFF600', margin: 0, fontSize: 18}}>Image Missing...</p>
                </div>
              )}
              {selectedHacker["Description"] && (
                <div style={{color: '#000', marginBottom: 20}}>
                  <h2 style={{fontSize: 24, marginBottom: 12}}>About the Game</h2>
                  <p style={{lineHeight: 1.6}}>{selectedHacker["Description"]}</p>
                </div>
              )}
              <div style={{color: '#000'}}>
                <h2 style={{fontSize: 24, marginBottom: 12}}>Links</h2>
                <p>Code URL: <a href={selectedHacker["Code URL"]} style={{color: '#000'}}>{selectedHacker["Code URL"]}</a></p>
                <p>Playable URL: <a href={selectedHacker["Playable URL"]} style={{color: '#000'}}>{selectedHacker["Playable URL"]}</a></p>
                {selectedHacker["videoURL"] && (
                  <p>Video: <a href={selectedHacker["videoURL"]} style={{color: '#000'}}>{selectedHacker["videoURL"]}</a></p>
                )}
                <p>Github Username: {selectedHacker["Github Username"]}</p>
              </div>
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
                {games.map((game, index) => (
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
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 