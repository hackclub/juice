import React, { useState, useEffect } from "react";

export default function MenuWindow({
  position,
  isDragging,
  isActive,
  handleMouseDown,
  handleDismiss,
  handleWindowClick,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX,
  userData,
  setUserData,
}) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMoment, setSelectedMoment] = useState(null); // To handle popup

  // Variables to hold calculated total hours for each status
  const [totalHours, setTotalHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [acceptedHours, setAcceptedHours] = useState(0);
  const [rejectedHours, setRejectedHours] = useState(0);

  // Add this after the other state declarations
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);

  // Add this with other state declarations at the top
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    if (userData?.juiceStretches) {
      let total = 0;
      let pending = 0;
      let accepted = 0;
      let rejected = 0;

      userData.juiceStretches.forEach((stretch) => {
        const stretchHours =
          Math.round(((stretch.timeWorkedSeconds || 0) / 3600) * 100) / 100;
        total += stretchHours;

        if (stretch.Review[0] === "Accepted") {
          accepted += stretchHours;
        } else if (stretch.Review[0] === "Rejected") {
          rejected += stretchHours;
        } else {
          pending += stretchHours;
        }
      });

      setTotalHours(total);
      setPendingHours(pending);
      setAcceptedHours(accepted);
      setRejectedHours(rejected);

      // Transform the stretches into moments
      const allMoments = userData.juiceStretches.reduce((acc, stretch) => {
        if (stretch.omgMoments && stretch.omgMoments.length > 0) {
          // Create a moment object for each omgMoment in the stretch
          const stretchMoments = stretch.omgMoments.map((_, index) => ({
            id: stretch.ID + "-" + index, // Create unique ID
            description: stretch["description (from omgMoments)"]?.[index] || "",
            video: stretch["video (from omgMoments)"]?.[index] || "",
            created_at: stretch.endTime,
            stretchReview: stretch.Review[0]
          }));
          return [...acc, ...stretchMoments];
        }
        return acc;
      }, []);

      // Sort moments by created_at in ascending order (oldest first)
      const sortedMoments = allMoments.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setMoments(sortedMoments);
      setLoading(false);
    }
  }, [userData]);

  const handleMomentClick = (moment) => {
    const index = moments.findIndex(m => m.id === moment.id);
    setCurrentMomentIndex(index);
    setSelectedMoment(moment);
  };

  const closePopup = () => {
    setSelectedMoment(null);
  };

  const navigateMoments = (direction) => {
    const newIndex = currentMomentIndex + direction;
    
    // Check bounds
    if (newIndex >= 0 && newIndex < moments.length) {
        setCurrentMomentIndex(newIndex);
        setSelectedMoment(moments[newIndex]);
        setVideoKey(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (selectedMoment) {
            if (e.key === "Escape") {
                setSelectedMoment(null);
            } else if (e.key === "ArrowLeft") {
                navigateMoments(-1);
            } else if (e.key === "ArrowRight") {
                navigateMoments(1);
            }
        }
    };

    if (selectedMoment) {
        document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMoment, moments, currentMomentIndex]);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
      }}
    >
      <div
        onClick={handleWindowClick("menuWindow")}
        style={{
          display: "flex",
          width: 650,
          color: "black",
          height: 470,
          backgroundColor: "#fff",
          border: "1px solid #000",
          borderRadius: 4,
          flexDirection: "column",
          padding: 0,
          userSelect: "none",
          animation: "linear .3s windowShakeAndScale",
        }}
      >
        <div
          onMouseDown={handleMouseDown("menuWindow")}
          style={{
            display: "flex",
            borderBottom: "1px solid #000",
            padding: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss("menuWindow");
              }}
            >
              x
            </button>
          </div>
          <p>Moments</p>
          <div></div>
        </div>

        <div
          style={{
            margin: 0,
            textAlign: "center",
            flexDirection: "column",
            padding: "8px 0 0 0",
          }}
          className="subtle-gradient-bg"
        >
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              flexDirection: "row",
              fontSize: 32,
              marginTop: 8,
            }}
          >
            {acceptedHours.toFixed(2)}/100{" "}
            <p style={{ fontSize: 16 }}>accepted shipped hours</p>
          </h2>
          <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
            <div
              style={{
                height: "12px",
                width: "100%",
                background: "#ddd",
                borderRadius: "0px",
                overflow: "hidden",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(acceptedHours / 100) * 100}%`,
                  background: acceptedHours >= 100 ? "gold" : "green",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
          </div>

          <p
            style={{ margin: 0, textAlign: "center", padding: 10, fontSize: 14 }}
            className="rainbow-text"
          >
            After completing the base 100 hours, each new accepted hour will get
            <br />
            converted into $5 additional for your stipend!
          </p>
        </div>

        {/* Displaying the Hours Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #000",
            borderTop: "1px solid #000",
          }}
        >
          <div>
            Total Hours: <br />
            <span style={{ color: "black" }}>{totalHours.toFixed(2)} hrs</span>
          </div>
          <div>
            Pending Hours: <br />
            <span style={{ color: "orange" }}>
              {pendingHours.toFixed(2)} hrs
            </span>
          </div>
          <div>
            Accepted Hours: <br />
            <span style={{ color: "green" }}>
              {acceptedHours.toFixed(2)} hrs
            </span>
          </div>
          <div>
            Rejected Hours: <br />
            <span style={{ color: "red" }}>{rejectedHours.toFixed(2)} hrs</span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            border: "1px solid #000",
            width: 208,
            position: "absolute",
            bottom: 8,
            left: 8,
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 2,
            paddingBottom: 2,

          }}
        >
          <span
            style={{ color: "green", display: "flex", flexDirection: "row", gap: 4, marginRight: "10px", fontSize: "12px" }}
          >
            
            <div style={{width: 12, backgroundColor: "green", height: 12, borderRadius: 2}}>

            </div>
             Accepted
          </span>
          <span
            style={{ color: "orange", display: "flex", flexDirection: "row", gap: 4, marginRight: "10px", fontSize: "12px" }}
          >
            
            <div style={{width: 12, backgroundColor: "orange", height: 12, borderRadius: 2}}>

            </div>
             Pending
          </span>
          <span
            style={{ color: "red", display: "flex", flexDirection: "row", gap: 4, marginRight: "10px", fontSize: "12px" }}
          >
            
            <div style={{width: 12, backgroundColor: "red", height: 12, borderRadius: 2}}>

            </div>
             Rejected
          </span>        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 16,
            height: "calc(100% - 70px)", // Account for header and summary height
            overflow: "auto",
          }}
        >
          {loading && <p>Loading moments...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading &&
            !error &&
            (moments.length === 0 ? (
              <p>You haven't submitted any demos yet!</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: 16,
                  width: "100%",
                }}
              >
                {moments.map((moment) => {
                  let backgroundColor;
                  let strokeColor;
                  
                  if (moment.stretchReview === "Accepted") {
                    backgroundColor = "green";
                    strokeColor = "#90EE90";  // Light green
                  } else if (moment.stretchReview === "Rejected") {
                    backgroundColor = "red";
                    strokeColor = "#FFB6B6";  // Light red
                  } else {
                    backgroundColor = "orange";
                    strokeColor = "#FFD580";  // Light orange
                  }

                  return (
                    <div
                      key={moment.id}
                      onClick={() => handleMomentClick(moment)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: backgroundColor,
                        borderRadius: "4px",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        position: "relative",
                        boxShadow: `
                          inset 0 0 0 1px ${strokeColor},
                          inset 2px 2px 4px rgba(0, 0, 0, 0.05)
                        `,
                        transition: "all 0.2s ease",
                        transform: "scale(1)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(1.1)";
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = `
                          inset 0 0 0 1px ${strokeColor},
                          inset 2px 2px 4px rgba(0, 0, 0, 0.05),
                          0 2px 5px rgba(0, 0, 0, 0.2)
                        `;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "brightness(1)";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = `
                          inset 0 0 0 1px ${strokeColor},
                          inset 2px 2px 4px rgba(0, 0, 0, 0.05)
                        `;
                      }}
                    ></div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedMoment && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "80%",
            maxWidth: "800px",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            border: "1px solid #000",
          }}
        >
          <div style={{ flex: 1, marginRight: 16 }}>
            <div className="video-container">
              <video
                key={videoKey}
                controls
                autoPlay
                style={{
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: "#000",
                }}
              >
                <source src={selectedMoment.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <p>{selectedMoment.description}</p>
            <p style={{ 
              paddingTop: 10,
              fontSize: 13,
              opacity: 0.6
            }}>
              {new Date(selectedMoment.created_at).toLocaleString()}
            </p>
            <div style={{ 
              marginTop: 10,
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}>
              <button 
                onClick={() => navigateMoments(-1)}
                disabled={currentMomentIndex === 0}
                style={{ opacity: currentMomentIndex === 0 ? 0.5 : 1 }}
              >
                ← Prev
              </button>
              <button onClick={closePopup}>
                Close
              </button>
              <button 
                onClick={() => navigateMoments(1)}
                disabled={currentMomentIndex === moments.length - 1}
                style={{ opacity: currentMomentIndex === moments.length - 1 ? 0.5 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this style block before the closing div */}
      <style jsx>{`
        .subtle-gradient-bg {
          background-image: linear-gradient(
            238deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(240, 240, 255, 0.7) 20%,
            rgba(255, 240, 255, 0.7) 40%,
            rgba(255, 240, 240, 0.7) 60%,
            rgba(255, 240, 230, 0.7) 80%,
            rgba(255, 255, 255, 0.7) 100%
          );
          background-size: 400% 400%;
          animation: gradient 12s linear infinite;
          border-bottom: 1px solid #000;
        }

        .rainbow-text {
          background-image: linear-gradient(
            238deg,
            #000066 0%,
            #330066 20%,
            #660066 40%,
            #660033 60%,
            #663300 80%,
            #000066 100%
          );
          background-size: 400% 400%;
          animation: gradient 12s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: bold;
        }

        @keyframes gradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: -400% center;
          }
        }

        .video-container:not(:hover) video::-webkit-media-controls {
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-container video::-webkit-media-controls {
          opacity: 1;
          transition: opacity 0.3s;
        }

        /* For Firefox */
        .video-container:not(:hover) video::-moz-media-controls {
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-container video::-moz-media-controls {
          opacity: 1;
          transition: opacity 0.3s;
        }
      `}</style>
    </div>
  );
}
