import React, { Suspense } from 'react';
import FileIcon from '../FileIcon';
import WelcomeWindow from './WelcomeWindow';
import AchievementsWindow from './AchievementsWindow';
import WutIsThisWindow from './WutIsThisWindow';
import RegisterWindow from './RegisterWindow';
import VideoWindow from './VideoWindow';
import FactionWindow from './FactionWindow';
import FirstChallengeWindow from './FirstChallengeWindow';
import JuiceWindow from './JuiceWindow';
import KudosWindow from './KudosWindow';
import Background from '../Background';
import ShareSuccessPanel from './ShareSuccessPanel';
import FortuneBasket from './FortuneBasket';
import ThanksWindow from './ThanksWindow';
import JungleWindow from './JungleWindow';
import FruitBasketWindow from './FruitBasketWindow';

export default function MainView({ isLoggedIn, setIsLoggedIn, userData, setUserData }) {
  const [time, setTime] = React.useState(new Date());
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState(null);
  const [welcomePosition, setWelcomePosition] = React.useState({ x: 0, y: 0 });
  const [achievementsPosition, setAchievementsPosition] = React.useState({ x: 50, y: 50 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = React.useState(['welcomeWindow']);
  const [windowOrder, setWindowOrder] = React.useState(['welcomeWindow']);
  const [selectedRank, setSelectedRank] = React.useState(1);
  const [wutIsThisPosition, setWutIsThisPosition] = React.useState({ x: 100, y: 100 });
  const [registerPosition, setRegisterPosition] = React.useState({ x: 150, y: 150 });
  const [videoPosition, setVideoPosition] = React.useState({ x: 200, y: 200 });
  const [factionPosition, setFactionPosition] = React.useState({ x: 250, y: 250 });
  const [firstChallengePosition, setFirstChallengePosition] = React.useState({ x: 300, y: 300 });
  const [juiceWindowPosition, setJuiceWindowPosition] = React.useState({ x: 0, y: 0 });
  const [jungleWindowPosition, setjungleWindowPosition] = React.useState({ x: 0, y: 0 });
  const [fruitBasketWindowPosition, setFruitBasketWindowPosition] = React.useState({ x: 0, y: 0})
  const [fortuneBasketPosition, setFortuneBasketPosition] = React.useState({ 
    x: Math.max(0, window.innerWidth / 2 - 150), 
    y: Math.max(0, window.innerHeight / 2 - 110)
  });
  const [isShaking, setIsShaking] = React.useState(false);
  const collectSoundRef = React.useRef(null);
  const [tickets, setTickets] = React.useState([]);
  const [isRsvped, setIsRsvped] = React.useState(false);
  const [showCookies, setShowCookies] = React.useState(false);
  const [kudosPosition, setKudosPosition] = React.useState({ x: 350, y: 350 });
  const [isJuicing, setIsJuicing] = React.useState(false);
  const juicerSoundRef = React.useRef(null);
  const [thanksPosition, setThanksPosition] = React.useState({ x: 400, y: 400 });

  // Constants
  const TOP_BAR_HEIGHT = 36;
  const WINDOW_HEIGHTS = {
    welcomeWindow: 160,
    achievements: 320,
    wutIsThis: 470,
    register: 200,
    video: 397,
    faction: 200,
    juiceWindow: 300,
    jungleWindow: 300,
    fruitBasketWindow: 300,
    fortuneBasket: 220,
    thanks: 300
  };
  const BASE_Z_INDEX = 1;

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const kickoffDate = new Date('2025-02-01T19:30:00-05:00'); // EST time
      const diff = kickoffDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`);
      } else {
        setTimeRemaining('Event has started!');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleFileClick = (fileId) => (e) => {
    e.stopPropagation();
    if (selectedFile === fileId) {
      if (fileId === "Achievements") {
        if (!openWindows.includes('achievements')) {
          setOpenWindows(prev => [...prev, 'achievements']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'achievements'), 'achievements']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'achievements'), 'achievements']);
        }
      } else if (fileId === "file1") {
        if (!openWindows.includes('wutIsThis')) {
          setOpenWindows(prev => [...prev, 'wutIsThis']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsThis'), 'wutIsThis']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsThis'), 'wutIsThis']);
        }
      } else if (fileId === "Register") {
        if (!openWindows.includes('register')) {
          setOpenWindows(prev => [...prev, 'register']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
        }
      } else if (fileId === "Juicer") {
        if (!openWindows.includes('juiceWindow')) {
          setOpenWindows(prev => [...prev, 'juiceWindow']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'juiceWindow'), 'juiceWindow']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'juiceWindow'), 'juiceWindow']);
        }
      } else if (fileId === "video.mp4") {
        if (!openWindows.includes('video')) {
          setOpenWindows(prev => [...prev, 'video']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'video'), 'video']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'video'), 'video']);
        }
      } else if (fileId === "Fortune Basket") {
        if (!openWindows.includes('fortuneBasket')) {
          setOpenWindows(prev => [...prev, 'fortuneBasket']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'fortuneBasket'), 'fortuneBasket']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'fortuneBasket'), 'fortuneBasket']);
        }
      } else if (fileId === "Kudos") {
        if (!openWindows.includes('kudos')) {
          setOpenWindows(prev => [...prev, 'kudos']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'kudos'), 'kudos']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'kudos'), 'kudos']);
        }
      } else if (fileId === "Thanks") {
        if (!openWindows.includes('thanks')) {
          setOpenWindows(prev => [...prev, 'thanks']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'thanks'), 'thanks']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'thanks'), 'thanks']);
        }
      } else if (fileId === "Jungle") {
        if (!openWindows.includes('jungleWindow')) {
          setOpenWindows(prev => [...prev, 'jungleWindow']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'jungleWindow'), 'jungleWindow']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'jungleWindow'), 'jungleWindow']);
        }
      } else if (fileId === "FruitBasket") {
        if (!openWindows.includes('fruitBasketWindow')) {
          setOpenWindows(prev => [...prev, 'fruitBasketWindow']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'fruitBasketWindow'), 'fruitBasketWindow']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'fruitBasketWindow'), 'fruitBasketWindow']);
        }
      }
    }
    setSelectedFile(fileId);
  }

  const handleMouseDown = (windowName) => (e) => {
    console.log('MouseDown triggered for window:', windowName);
    e.stopPropagation();
    setIsDragging(true);
    setActiveWindow(windowName);
    console.log('Active window set to:', windowName);
    setWindowOrder(prev => [...prev.filter(w => w !== windowName), windowName]);
    
    let position;
    switch(windowName) {
      case 'welcomeWindow':
        position = welcomePosition;
        break;
      case 'achievements':
        position = achievementsPosition;
        break;
      case 'wutIsThis':
        position = wutIsThisPosition;
        break;
      case 'register':
        position = registerPosition;
        break;
      case 'video':
        position = videoPosition;
        break;
      case 'faction':
        position = factionPosition;
        break;
      case 'firstChallenge':
        position = firstChallengePosition;
        break;
      case 'juiceWindow':
        position = juiceWindowPosition;
        break;
      case 'fortuneBasket':
        console.log('Fortune Basket position:', fortuneBasketPosition);
        position = fortuneBasketPosition;
        break;
      case 'kudos':
        position = kudosPosition;
        break;
      case 'thanks':
        position = thanksPosition;
        break;
      case 'jungleWindow':
        position = jungleWindowPosition
        break;
      case 'fruitBasketWindow':
        position = fruitBasketWindowPosition
        break
      default:
        console.log('Unknown window name:', windowName);
        position = { x: 0, y: 0 };
    }

    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    console.log('Drag start set to:', { x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      console.log('Mouse move with active window:', activeWindow);
      const newY = e.clientY - dragStart.y;
      const actualTopPosition = (window.innerHeight / 2) + newY;
      
      const windowHeight = WINDOW_HEIGHTS[activeWindow] || WINDOW_HEIGHTS.welcomeWindow;
      const boundedY = actualTopPosition < (TOP_BAR_HEIGHT + windowHeight/2) 
        ? (TOP_BAR_HEIGHT + windowHeight/2) - (window.innerHeight / 2)
        : newY;

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: boundedY
      };

      if (activeWindow === 'welcomeWindow') {
        setWelcomePosition(newPosition);
      } else if (activeWindow === 'achievements') {
        setAchievementsPosition(newPosition);
      } else if (activeWindow === 'wutIsThis') {
        setWutIsThisPosition(newPosition);
      } else if (activeWindow === 'register') {
        setRegisterPosition(newPosition);
      } else if (activeWindow === 'video') {
        setVideoPosition(newPosition);
      } else if (activeWindow === 'faction') {
        setFactionPosition(newPosition);
      } else if (activeWindow === 'firstChallenge') {
        setFirstChallengePosition(newPosition);
      } else if (activeWindow === 'juiceWindow') {
        setJuiceWindowPosition(newPosition);
      } else if (activeWindow === 'fortuneBasket') {
        console.log('Setting new fortune basket position:', newPosition);
        setFortuneBasketPosition(newPosition);
      } else if (activeWindow === 'kudos') {
        setKudosPosition(newPosition);
      } else if (activeWindow === 'thanks') {
        setThanksPosition(newPosition);
      } else if (activeWindow === 'jungleWindow') {
        setjungleWindowPosition(newPosition);
      } else if (activeWindow === 'fruitBasketWindow') {
        setFruitBasketWindowPosition(newPosition);
      }
    }
  };

  const handleMouseUp = () => {
    console.log('Mouse up, was dragging:', isDragging, 'active window was:', activeWindow);
    setIsDragging(false);
    setActiveWindow(null);
  };

  const handleDismiss = (windowName) => {
    setOpenWindows(prev => prev.filter(window => window !== windowName));
    setWindowOrder(prev => prev.filter(w => w !== windowName));

    if (windowName === 'register' && isLoggedIn) {
        // Any additional UI updates can go here
    }
  };

  const handleJuiceClick = () => {
    if (!openWindows.includes('welcomeWindow')) {
      setOpenWindows(prev => [...prev, 'welcomeWindow']);
      setWelcomePosition({ x: 0, y: 0 });
      setWindowOrder(prev => [...prev.filter(w => w !== 'welcomeWindow'), 'welcomeWindow']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'welcomeWindow'), 'welcomeWindow']);
    }
  };

  const handleWindowClick = (windowName) => (e) => {
    e.stopPropagation();
    setWindowOrder(prev => [...prev.filter(w => w !== windowName), windowName]);
  };

  const handleRegisterOpen = () => {
    if (!openWindows.includes('register')) {
      setOpenWindows(prev => [...prev, 'register']);
      document.getElementById("windowOpenAudio").currentTime = 0;
      document.getElementById("windowOpenAudio").play();
      setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
    }
  };

  const handleFactionOpen = () => {
    if (!openWindows.includes('faction')) {
      setOpenWindows(prev => [...prev, 'faction']);
      document.getElementById("windowOpenAudio").currentTime = 0;
      document.getElementById("windowOpenAudio").play();
      setWindowOrder(prev => [...prev.filter(w => w !== 'faction'), 'faction']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'faction'), 'faction']);
    }
  };

  const handleFirstChallengeOpen = () => {
    if (!openWindows.includes('firstChallenge')) {
      setOpenWindows(prev => [...prev, 'firstChallenge']);
      document.getElementById("windowOpenAudio").currentTime = 0;
      document.getElementById("windowOpenAudio").play();
      setWindowOrder(prev => [...prev.filter(w => w !== 'firstChallenge'), 'firstChallenge']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'firstChallenge'), 'firstChallenge']);
    }
  };

  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Open register window if no token
        if (!openWindows.includes('register')) {
          setOpenWindows(prev => [...prev, 'register']);
          document.getElementById("windowOpenAudio").currentTime = 0;
          document.getElementById("windowOpenAudio").play();
          setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
        }
        return;
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsRsvped(true);
      } else {
        console.error('Failed to RSVP');
      }
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      console.log('Adding mouse move/up listeners, active window:', activeWindow);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeWindow, dragStart]);

  const getWindowZIndex = (windowName) => {
    const index = windowOrder.indexOf(windowName);
    return BASE_Z_INDEX + index;
  };

  React.useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600); // Duration increased to 0.6s
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  React.useEffect(() => {
    juicerSoundRef.current = new Audio('./juicer.mp3');
    juicerSoundRef.current.volume = 0.5;
    collectSoundRef.current = new Audio('./collect.mp3');
    collectSoundRef.current.volume = 0.5;
  }, []);

  React.useEffect(() => {
    if (userData?.invitesAvailable) {
      const allTickets = ['orange', 'kiwi', 'apple'];
      setTickets(allTickets.map(id => ({ 
        id, 
        used: !userData.invitesAvailable.includes(id)
      })));
    }
  }, [userData?.invitesAvailable]);

  const handleFortuneCookieOpen = () => {
    if (!openWindows.includes('fortuneBasket')) {
      setOpenWindows(prev => [...prev, 'fortuneBasket']);
      document.getElementById("windowOpenAudio").currentTime = 0;
      document.getElementById("windowOpenAudio").play();
    }
  };

  const handleAchievementsOpen = () => {
    if (!openWindows.includes('achievements')) {
      setOpenWindows(prev => [...prev, 'achievements']);
    }
  };

  const startJuicing = () => {
    setIsJuicing(true);
    const juicerAudio = document.getElementById('juicerAudio');
    if (juicerAudio) {
      juicerAudio.currentTime = 0;
      juicerAudio.play();
    }
    
    // Stop after 7 seconds
    setTimeout(() => {
      setIsJuicing(false);
    }, 7000);
  };

  const playCollectSound = () => {
    const collectAudio = document.getElementById('collectAudio');
    if (collectAudio) {
      collectAudio.currentTime = 0;
      collectAudio.play();
    }
  };

  return (
    <div 
      data-shake-container="true"
      style={{
        animation: isJuicing ? 'juicerShake 1s ease-in-out infinite' : 'none',
        transform: `scale(${isJuicing ? 1.1 : 1})`,
        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        overflow: "hidden",
        position: 'relative'
    }}>
      <style jsx global>{`
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0) scale(1.01);
          }
          20%, 80% {
            transform: translate3d(2px, 0, 0) scale(1.01);
          }
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0) scale(1.01);
          }
          40%, 60% {
            transform: translate3d(4px, 0, 0) scale(1.01);
          }
        }
        @keyframes saturate {
          0% {
            backdrop-filter: saturate(100%);
          }
          50% {
            backdrop-filter: saturate(300%);
          }
          100% {
            backdrop-filter: saturate(100%);
          }
        }
        @keyframes popIn {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes popOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.4);
            opacity: 0;
          }
        }
        .panel-pop {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .panel-pop-out {
          animation: popOut 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fortuneCookiePop {
          0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.1) rotate(10deg);
          }
          80% {
            transform: scale(0.95) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes juicerShake {
          0% {
            transform: translate3d(0, 0, 0) scale(1.1);
          }
          25% {
            transform: translate3d(2px, 2px, 0) scale(1.1);
          }
          50% {
            transform: translate3d(-2px, -2px, 0) scale(1.1);
          }
          75% {
            transform: translate3d(-2px, 2px, 0) scale(1.1);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1.1);
          }
        }
        
        .juicing-enter {
          animation: juicingEnter 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes juicingEnter {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        @keyframes windowShakeAndScale {
          0%{
            transform: rotateZ(0deg) scale(0.5);
          }
          33%{
            transform: rotateZ(20deg) scale(1.2);
          }
          66%{
            transform: rotateZ(-20deg) scale(0.8);
          }
          100% {
            transform: rotateZ(0deg) scale(1);
          }
        }
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0%, 50%; }
        }
      `}</style>
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          animation: isShaking ? 'saturate 0.6s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          mixBlendMode: "saturation"
        }}
      />
      <div style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}>
        {/* top bar */}
        <div style={{
            position: "absolute", 
            zIndex: 3, 
            height: TOP_BAR_HEIGHT, 
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)", 
            justifyContent: "space-between", 
            padding: "8px 16px", 
            top: 0, 
            left: 0, 
            display: "flex", 
            width: "100vw", 
            margin: 0,
            backgroundColor: 'rgba(255, 220, 180, 0.8)',
            backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
            WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
            boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
        }}>
            <p onClick={handleJuiceClick} style={{
                cursor: "pointer",
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500
            }}>Juice</p>
            <div style={{display: "flex", flexDirection: "row", gap: 16}}>
                <div style={{
                    display: "flex", 
                    border: "1px solid #000", 
                    alignItems: "center", 
                    justifyContent: "space-around", 
                    borderRadius: 4, 
                    padding: "2px 4px",
                    minWidth: 42,
                    gap: 6,
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderColor: '#000'
                }}>  
                    <img style={{width: 14, height: 14}} src={"./kudos.png"}/>
                    <p style={{
                        fontSize: 16,
                        color: '#000',
                        fontWeight: userData?.totalKudos > 0 ? 'bold' : 'normal'
                    }}>{userData?.totalKudos || 0}</p>
                </div>
                <div style={{
                    display: "flex", 
                    border: "1px solid #000", 
                    alignItems: "center", 
                    justifyContent: "space-around", 
                    borderRadius: 4, 
                    padding: "2px 4px",
                    minWidth: 42,
                    gap: 6,
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderColor: '#000'
                }}>  
                    <img style={{width: 14, height: 14}} src={"/jungle/token.png"}/>
                    <p style={{
                        fontSize: 16,
                        color: '#000',
                        fontWeight: userData?.totalKudos > 0 ? 'bold' : 'normal'
                    }}>{userData?.totalTokens || 0}</p>
                </div>
                <p style={{
                    color: "rgba(0, 0, 0, 0.8)",
                    fontWeight: 500
                }}>{formattedTime}</p>
            </div>
        </div>

        {openWindows.includes('welcomeWindow') && (
          <WelcomeWindow 
            position={welcomePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'welcomeWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('welcomeWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('welcomeWindow')}
            setOpenWindows={setOpenWindows}
            setWindowOrder={setWindowOrder}
            openWindows={openWindows}
            isLoggedIn={isLoggedIn}
            isVideoOpen={openWindows.includes('video')}
          />
        )}

        {openWindows.includes('achievements') && (
          <AchievementsWindow 
            position={achievementsPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'achievements'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
            BASE_Z_INDEX={getWindowZIndex('achievements')}
            ACTIVE_Z_INDEX={getWindowZIndex('achievements')}
            userData={userData}
          />
        )}

        {openWindows.includes('wutIsThis') && (
          <WutIsThisWindow 
            position={wutIsThisPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'wutIsThis'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('wutIsThis')}
            ACTIVE_Z_INDEX={getWindowZIndex('wutIsThis')}
          />
        )}

        {openWindows.includes('register') && (
          <RegisterWindow 
            position={registerPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'register'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('register')}
            ACTIVE_Z_INDEX={getWindowZIndex('register')}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
          />
        )}

        {openWindows.includes('video') && (
          <VideoWindow 
            position={videoPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'video'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('video')}
            ACTIVE_Z_INDEX={getWindowZIndex('video')}
          />
        )}

        {openWindows.includes('faction') && (
          <FactionWindow 
            position={factionPosition}
            isDragging={isDragging && activeWindow === 'faction'}
            isActive={windowOrder[windowOrder.length - 1] === 'faction'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('faction')}
            ACTIVE_Z_INDEX={getWindowZIndex('faction')}
            userData={userData}
            setUserData={setUserData}
          />
        )}

        {openWindows.includes('firstChallenge') && (
          <FirstChallengeWindow 
            position={firstChallengePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'firstChallenge'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('firstChallenge')}
            ACTIVE_Z_INDEX={getWindowZIndex('firstChallenge')}
            userData={userData}
            setUserData={setUserData}
          />
        )}

        {openWindows.includes('juiceWindow') && (
          <JuiceWindow
            position={juiceWindowPosition}
            isDragging={isDragging && activeWindow === 'juiceWindow'}
            isActive={windowOrder[windowOrder.length - 1] === 'juiceWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('juiceWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('juiceWindow')}
            userData={userData}
            setUserData={setUserData}
            startJuicing={startJuicing}
            playCollectSound={playCollectSound}
            isJuicing={isJuicing}
          />
        )}

        {openWindows.includes('jungleWindow') && (
          <JungleWindow
            position={jungleWindowPosition}
            isDragging={isDragging && activeWindow === 'jungleWindow'}
            isActive={windowOrder[windowOrder.length - 1] === 'jungleWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('jungleWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('jungleWindow')}
            userData={userData}
            setUserData={setUserData}
            startJuicing={startJuicing}
            playCollectSound={playCollectSound}
            isJuicing={isJuicing}
          />
        )}

        {openWindows.includes('fruitBasketWindow') && (
          <FruitBasketWindow
            position={fruitBasketWindowPosition}
            isDragging={isDragging && activeWindow === 'fruitBasketWindow'}
            isActive={windowOrder[windowOrder.length - 1] === 'fruitBasketWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('fruitBasketWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('fruitBasketWindow')}
            userData={userData}
            setUserData={setUserData}
            startJuicing={startJuicing}
            playCollectSound={playCollectSound}
            isJuicing={isJuicing}
          />
        )}

        {openWindows.includes('fortuneBasket') && (
          <FortuneBasket 
            handleDismiss={() => handleDismiss('fortuneBasket')}
            position={fortuneBasketPosition}
            handleMouseDown={handleMouseDown}
            handleWindowClick={handleWindowClick}
            isDragging={isDragging && activeWindow === 'fortuneBasket'}
            isActive={windowOrder[windowOrder.length - 1] === 'fortuneBasket'}
            BASE_Z_INDEX={getWindowZIndex('fortuneBasket')}
            ACTIVE_Z_INDEX={getWindowZIndex('fortuneBasket')}
            style={{ 
              animation: showCookies ? 'fortuneCookiePop 0.4s ease forwards' : 'none',
              zIndex: getWindowZIndex('fortuneBasket'),
              transform: `translate(${fortuneBasketPosition.x}px, ${fortuneBasketPosition.y}px)`
            }}
          />
        )}

        {openWindows.includes('kudos') && (
          <KudosWindow 
            position={kudosPosition}
            isDragging={isDragging && activeWindow === 'kudos'}
            isActive={windowOrder[windowOrder.length - 1] === 'kudos'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('kudos')}
            ACTIVE_Z_INDEX={getWindowZIndex('kudos')}
          />
        )}

        {openWindows.includes('thanks') && (
          <ThanksWindow 
            position={thanksPosition}
            isDragging={isDragging && activeWindow === 'thanks'}
            isActive={windowOrder[windowOrder.length - 1] === 'thanks'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('thanks')}
            ACTIVE_Z_INDEX={getWindowZIndex('thanks')}
          />
        )}

        <div style={{
            position: "absolute", 
            top: TOP_BAR_HEIGHT, 
            left: 0,
            // backgroundImage: 'url(background.GIF)',
            backgroundSize: 'cover', 
            imageRendering: 'pixelated',
            width: "100vw", 
            overflow: "hidden"
            // height: "100vh"
        }}>
            <div style={{display: "flex", gap: 8, flexDirection: "row", padding: 8}}>
                <div>
                  {isLoggedIn && (
                      <FileIcon
                      text="Jungle"
                      icon="./jungle/jungleicon.png"
                      isSelected={selectedFile === "Jungle"}
                      onClick={handleFileClick("Jungle")}
                      delay={0.5}
                      data-file-id="Jungle"
                      />
                    )}
                    <FileIcon 
                        text="Achievements" 
                        icon="achievmentsicon.png"
                        isSelected={selectedFile === "Achievements"}
                        onClick={handleFileClick("Achievements")}
                        delay={0.1}
                        data-file-id="Achievements"
                    />
                    <FileIcon 
                        text="Fortune Basket" 
                        icon="./fortunecookieicon.png" 
                        isSelected={selectedFile === "Fortune Basket"} 
                        onClick={handleFileClick("Fortune Basket")} 
                        delay={0.4} 
                        data-file-id="Fortune Basket" 
                    />
                    {isLoggedIn && (
                      <FileIcon
                      text="Fruit Basket"
                      icon="./jungle/fullbasket.png"
                      isSelected={selectedFile === "FruitBasket"}
                      onClick={handleFileClick("FruitBasket")}
                      delay={0.5}
                      data-file-id="FruitBasket"
                      />
                    )}
                </div>
                <div>
                    <FileIcon 
                        text={isLoggedIn ? "Juicer" : "Register"}
                        icon={isLoggedIn ? "./juicerRest.png" : "registericon.png"}
                        isSelected={selectedFile === (isLoggedIn ? "Juicer" : "Register")}
                        onClick={handleFileClick(isLoggedIn ? "Juicer" : "Register")}
                        delay={0.2}
                        data-file-id={isLoggedIn ? "Juicer" : "Register"}
                    />
                    <FileIcon 
                        text="video.mp4" 
                        icon="./thumbnail.png" 
                        isSelected={selectedFile === "video.mp4"}
                        onClick={handleFileClick("video.mp4")}
                        delay={0.3}
                        data-file-id="video.mp4"
                    />
                    {isLoggedIn &&(
                      <FileIcon 
                          text="Kudos"
                          icon="./kudos.png" 
                          style={{ backgroundColor: "#000", color: "#fff" }}
                          isSelected={selectedFile === "Kudos"}
                          onClick={handleFileClick("Kudos")}
                          delay={0.5}
                          data-file-id="Kudos"
                      />
                    )
                    }
                </div>
                <div>
                    <FileIcon 
                        text="wutIsThis.txt" 
                        icon="./texticon.png"
                        isSelected={selectedFile === "file1"}
                        onClick={handleFileClick("file1")}
                        delay={0}
                        data-file-id="file1"
                    />
                </div>
            </div>
        </div>

        <div style={{position: "absolute", top: TOP_BAR_HEIGHT + 8, right: 8}}>
            <div 
                className="panel-pop"
                style={{
                    width: 332, 
                    backgroundColor: 'rgba(255, 220, 180, 0.8)',
                    backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    border: "1px solid rgba(255, 220, 180, 0.4)",
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
                }}>
                <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>{timeRemaining}</p>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: 0 }}>World Start Call (2/1/25)</p>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: 0 }}>7:30 PM EST SAT</p>
                </div>
                
                <button 
                    data-register-button="true"
                    onClick={isRsvped ? undefined : handleRsvp}
                    style={{
                        marginTop: 8,
                        padding: "4px 12px",
                        backgroundColor: isRsvped ? "#4CAF50" : "#3870FF",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: isRsvped ? "default" : "pointer"
                    }}>{isRsvped ? "Sent Google Calendar Invite" : "RSVP for Call"}</button>
            </div>
            {(isLoggedIn && !userData?.achievements?.includes("pr_submitted")) && (
                <div 
                    className="panel-pop"
                    style={{
                        width: 332,
                        marginTop: 8,
                        backgroundColor: 'rgba(255, 220, 180, 0.8)',
                        backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                        border: "1px solid rgba(255, 220, 180, 0.4)",
                        borderRadius: 8,
                        padding: 12,
                        boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
                    }}>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>First Challenge Reveals Itself...</p>
                    <button 
                        onClick={handleFirstChallengeOpen}
                        style={{
                            padding: "4px 12px",
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            backgroundColor: "#FF4002",
                            cursor: "pointer"
                        }}>Uncover Challenge</button>
                </div>
            )}
 
            {/* {isLoggedIn && (
              <>
              {userData?.achievements?.length > 1 &&
                <div className="panel-pop">
                    <ShareSuccessPanel />
                </div>}
              </>
            )} */}

            {isLoggedIn && tickets.some(t => !t.used) && <div 
                className="panel-pop"
                style={{
                    width: 332,
                    marginTop: 8,
                    backgroundColor: 'rgba(255, 220, 180, 0.8)',
                    backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    border: "1px solid rgba(255, 220, 180, 0.4)",
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
                }}>
                <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>
                    You found {tickets.filter(t => !t.used).length} special ticket{tickets.filter(t => !t.used).length !== 1 ? 's' : ''}...
                </p>
                <button 
                    onClick={handleFactionOpen}
                    style={{
                        padding: "4px 12px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        border: "none",
                        backgroundColor: "#FF6000",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}>Grab Your Tickets</button>
            </div>}
            
        </div>

        {/* background goes here */}
        <div 
            onClick={() => setSelectedFile(null)}
            style={{width: "100vw", height: "100vh", overflow: "hidden", display: "flex", margin: 0, cursor: "default"}}>
            <Background />
        </div>

        <div style={{position: "absolute", bottom: 8, left: 8}}>
            <FileIcon 
                text="Thanks" 
                icon="./heart.png"
                isSelected={selectedFile === "Thanks"}
                onClick={handleFileClick("Thanks")}
                delay={0.6}
                data-file-id="Thanks"
            />
        </div>

        {/* Add audio elements */}
        <audio id="juicerAudio" src="./juicer.mp3" preload="auto"></audio>
        <audio id="collectAudio" src="./collect.mp3" preload="auto"></audio>
        <audio id="windowOpenAudio" src="./sounds/windowOpenSound.wav"/>
      </div>
    </div>
  );
} 