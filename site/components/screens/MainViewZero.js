import React from 'react';
import WelcomeWindow from './WelcomeWindow';
import AchievementsWindow from './AchievementsWindow';
import WutIsJuiceWindow from './WutIsJuiceWindow';
import RegisterWindow from './RegisterWindow';
import VideoWindow from './VideoWindow';
import FactionWindow from './FactionWindow';
import FirstChallengeWindow from './FirstChallengeWindow';
import JuiceWindow from './JuiceWindow';
import KudosWindow from './KudosWindow';
import GalleryWindow from './GalleryWindow';
import FortuneBasket from './FortuneBasket';
import ThanksWindow from './ThanksWindow';
import JungleWindow from './JungleWindow';
import FruitBasketWindow from './FruitBasketWindow';
import WutIsJungleWindow from './WutIsJungleWindow';
import SecondChallengeWindow from './SecondChallengeWindow';
import MenuWindow from './MenuWindow';
import ZeroWindow from './ZeroWindow';
import JungleShopWindow from './JungleShopWindow';
import TamagotchiNotesWindow from './TamagotchiNotesWindow';
import WutIsPenguathonWindow from './WutIsPenguathonWindow';

export default function MainViewZero({
  isLoggedIn,
  setIsLoggedIn,
  userData,
  setUserData,
  isJungle,
  windowsOpen,
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState(null);
  const [welcomePosition, setWelcomePosition] = React.useState({ x: 0, y: 0 });
  const [achievementsPosition, setAchievementsPosition] = React.useState({
    x: 50,
    y: 50,
  });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = React.useState([
    ...(windowsOpen ?? ['welcomeWindow']),
    Date.now() < 1740294000 ? 'wutIsPenguathon' : '',
  ]);
  const [windowOrder, setWindowOrder] = React.useState([
    ...(windowsOpen ?? ['welcomeWindow']),
    Date.now() < 1740294000 ? 'wutIsPenguathon' : '',
  ]);
  const [selectedRank, setSelectedRank] = React.useState(1);
  const [wutIsJuicePosition, setwutIsJuicePosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [wutIsJunglePosition, setwutIsJunglePosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [registerPosition, setRegisterPosition] = React.useState({
    x: 250,
    y: 0,
  });
  const [videoPosition, setVideoPosition] = React.useState({ x: 200, y: 200 });
  const [factionPosition, setFactionPosition] = React.useState({
    x: 250,
    y: 150,
  });
  const [firstChallengePosition, setFirstChallengePosition] = React.useState({
    x: 300,
    y: 200,
  });
  const [juiceWindowPosition, setJuiceWindowPosition] = React.useState({
    x: -250,
    y: 0,
  });
  const [jungleWindowPosition, setjungleWindowPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [fruitBasketWindowPosition, setFruitBasketWindowPosition] =
    React.useState({ x: 0, y: 0 });
  const [jungleShopWindowPosition, setJungleShopWindowPosition] =
    React.useState({ x: 0, y: 0 });
  const [fortuneBasketPosition, setFortuneBasketPosition] = React.useState({
    x: Math.max(0, window.innerWidth / 2 - 150),
    y: Math.max(0, window.innerHeight / 2 - 110),
  });

  const [menuWindowPosition, setMenuWindowPosition] = React.useState({
    x: 400,
    y: 100,
  });
  const [zeroWindowPosition, setZeroWindowPosition] = React.useState({
    x: -400,
    y: -150,
  });
  const [wutIsPenguathonWindowPosition, setWutIsPenguathonWindowPosition] =
    React.useState({
      x: 400,
      y: 150,
    });

  const [isShaking, setIsShaking] = React.useState(false);
  const [showCookies, setShowCookies] = React.useState(false);
  const [kudosPosition, setKudosPosition] = React.useState({ x: 350, y: 350 });
  const [GalleryPosition, setGalleryPosition] = React.useState({
    x: 400,
    y: 200,
  });

  const [isJuicing, setIsJuicing] = React.useState(false);
  const [thanksPosition, setThanksPosition] = React.useState({
    x: 400,
    y: 200,
  });
  const [secondChallengePosition, setSecondChallengePosition] = React.useState({
    x: 350,
    y: 150,
  });
  const [tamagotchiNotesPosition, setTamagotchiNotesPosition] = React.useState({
    x: 100,
    y: 100,
  });

  // Constants
  const TOP_BAR_HEIGHT = 36;
  const WINDOW_HEIGHTS = {
    welcomeWindow: 160,
    achievements: 320,
    wutIsJuice: 470,
    wutIsJungle: 470,
    register: 200,
    video: 397,
    faction: 200,
    juiceWindow: 300,
    jungleWindow: 300,
    fruitBasketWindow: 300,
    fortuneBasket: 220,
    thanks: 300,
    secondChallenge: 300,
    menuWindow: 470,
    wutIsRelay: 470,
    galleryWindow: 397,
    zero: 300,
    jungleShopWindowPosition: 300,
    tamagotchiNotes: 470,
    wutIsPenguathon: 300,
  };
  const BASE_Z_INDEX = 1;

  const handleMouseDown = (windowName) => (e) => {
    console.log('MouseDown triggered for window:', windowName);
    e.stopPropagation();
    setIsDragging(true);
    setActiveWindow(windowName);
    console.log('Active window set to:', windowName);
    setWindowOrder((prev) => [
      ...prev.filter((w) => w !== windowName),
      windowName,
    ]);

    let position;
    switch (windowName) {
      case 'welcomeWindow':
        position = welcomePosition;
        break;
      case 'achievements':
        position = achievementsPosition;
        break;
      case 'wutIsJuice':
        position = wutIsJuicePosition;
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
      case 'Gallery':
        position = GalleryPosition;
        break;
      case 'thanks':
        position = thanksPosition;
        break;
      case 'jungleWindow':
        position = jungleWindowPosition;
        break;
      case 'fruitBasketWindow':
        position = fruitBasketWindowPosition;
        break;
      case 'wutIsJungle':
        position = wutIsJunglePosition;
        break;
      case 'menuWindow':
        position = menuWindowPosition;
        break;
      case 'secondChallenge':
        position = secondChallengePosition;
        break;
      case 'zero':
        position = zeroWindowPosition;
        break;
      case 'jungleShopWindow':
        position = jungleShopWindowPosition;
        break;
      case 'tamagotchiNotes':
        position = tamagotchiNotesPosition;
        break;
      case 'wutIsPenguathon':
        position = wutIsPenguathonWindowPosition;
        break;
      default:
        console.log('Unknown window name:', windowName);
        position = { x: 0, y: 0 };
    }

    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    console.log('Drag start set to:', {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      console.log('Mouse move with active window:', activeWindow);
      const newY = e.clientY - dragStart.y;
      const actualTopPosition = window.innerHeight / 2 + newY;

      const windowHeight =
        WINDOW_HEIGHTS[activeWindow] || WINDOW_HEIGHTS.welcomeWindow;
      const boundedY =
        actualTopPosition < TOP_BAR_HEIGHT + windowHeight / 2
          ? TOP_BAR_HEIGHT + windowHeight / 2 - window.innerHeight / 2
          : newY;

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: boundedY,
      };

      if (activeWindow === 'welcomeWindow') {
        setWelcomePosition(newPosition);
      } else if (activeWindow === 'achievements') {
        setAchievementsPosition(newPosition);
      } else if (activeWindow === 'wutIsJuice') {
        setwutIsJuicePosition(newPosition);
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
      } else if (activeWindow === 'Gallery') {
        setGalleryPosition(newPosition);
      } else if (activeWindow === 'thanks') {
        setThanksPosition(newPosition);
      } else if (activeWindow === 'jungleWindow') {
        setjungleWindowPosition(newPosition);
      } else if (activeWindow === 'fruitBasketWindow') {
        setFruitBasketWindowPosition(newPosition);
      } else if (activeWindow === 'menuWindow') {
        setMenuWindowPosition(newPosition);
      } else if (activeWindow === 'wutIsJungle') {
        setwutIsJunglePosition(newPosition);
      } else if (activeWindow === 'secondChallenge') {
        setSecondChallengePosition(newPosition);
      } else if (activeWindow === 'zero') {
        setZeroWindowPosition(newPosition);
      } else if (activeWindow === 'wutIsPenguathon') {
        setWutIsPenguathonWindowPosition(newPosition);
      }
    }
  };

  const handleMouseUp = () => {
    console.log(
      'Mouse up, was dragging:',
      isDragging,
      'active window was:',
      activeWindow
    );
    setIsDragging(false);
    setActiveWindow(null);
  };

  const handleDismiss = (windowName) => {
    setOpenWindows((prev) => prev.filter((window) => window !== windowName));
    setWindowOrder((prev) => prev.filter((w) => w !== windowName));

    // Stop any audio when postcard window is closed
    if (windowName === 'postcard') {
      const audio = document.querySelector('audio[src="./song.mp3"]');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    if (windowName === 'register' && isLoggedIn) {
      // Any additional UI updates can go here
    }
  };

  const handleWindowClick = (windowName) => (e) => {
    e.stopPropagation();
    setWindowOrder((prev) => [
      ...prev.filter((w) => w !== windowName),
      windowName,
    ]);
  };

  const playCollectSound = () => {
    const collectAudio = document.getElementById('collectAudio');
    if (collectAudio) {
      collectAudio.currentTime = 0;
      collectAudio.play();
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

  React.useEffect(() => {
    if (isDragging) {
      console.log(
        'Adding mouse move/up listeners, active window:',
        activeWindow
      );
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

  return (
    <div
      data-shake-container="true"
      style={{
        animation: isJuicing ? 'juicerShake 1s ease-in-out infinite' : 'none',
        transform: `scale(${isJuicing ? 1.1 : 1})`,
        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style jsx global>{`
        @keyframes shake {
          10%,
          90% {
            transform: translate3d(-1px, 0, 0) scale(1.01);
          }
          20%,
          80% {
            transform: translate3d(2px, 0, 0) scale(1.01);
          }
          30%,
          50%,
          70% {
            transform: translate3d(-4px, 0, 0) scale(1.01);
          }
          40%,
          60% {
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
          0% {
            transform: rotateZ(0deg) scale(0.5);
          }
          33% {
            transform: rotateZ(20deg) scale(1.2);
          }
          66% {
            transform: rotateZ(-20deg) scale(0.8);
          }
          100% {
            transform: rotateZ(0deg) scale(1);
          }
        }
        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes rainbowGlass {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .rainbow-glass-panel {
          background: linear-gradient(
            90deg,
            rgba(255, 220, 180, 0.4),
            rgba(255, 180, 220, 0.4),
            rgba(180, 220, 255, 0.4),
            rgba(180, 255, 220, 0.4)
          );
          background-size: 300% 100%;
          animation: rainbowGlass 3s linear infinite;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 2px 30px rgba(255, 255, 255, 0.2);
        }
        @keyframes buttonBounce {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
        }
        .bounce-button {
          animation: buttonBounce 2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes floatBoat1 {
          0% {
            transform: translate(-50%, 100%);
          }
          100% {
            transform: translate(150%, -100%) rotate(45deg);
          }
        }
        @keyframes floatBoat2 {
          0% {
            transform: translate(150%, 100%) rotate(-45deg);
          }
          100% {
            transform: translate(-50%, -100%) rotate(45deg);
          }
        }
        .floating-boat {
          position: absolute;
          font-size: 24px;
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }
        .boat1 {
          animation: floatBoat1 8s linear infinite;
        }
        .boat2 {
          animation: floatBoat2 10s linear infinite;
        }
        @keyframes jiggleEnvelope {
          0% {
            transform: rotate(0deg) scale(1);
          }
          15% {
            transform: rotate(-0.5deg) scale(0.998);
          }
          30% {
            transform: rotate(0.8deg) scale(1.001);
          }
          45% {
            transform: rotate(-0.7deg) scale(0.999);
          }
          60% {
            transform: rotate(0.3deg) scale(1.002);
          }
          75% {
            transform: rotate(-0.5deg) scale(0.998);
          }
          85% {
            transform: rotate(0.4deg) scale(1.001);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }
        @keyframes jiggleEnvelopeIntense {
          0% {
            transform: rotate(0deg) scale(1);
          }
          15% {
            transform: rotate(-2deg) scale(0.99);
          }
          30% {
            transform: rotate(3deg) scale(1.02);
          }
          45% {
            transform: rotate(-2.5deg) scale(0.98);
          }
          60% {
            transform: rotate(2deg) scale(1.03);
          }
          75% {
            transform: rotate(-3deg) scale(0.99);
          }
          85% {
            transform: rotate(2.5deg) scale(1.02);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }
        @keyframes rainbowOverlay {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes rainbowShadow {
          0% {
            filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.1))
              drop-shadow(0 0 12px rgba(255, 0, 255, 0.1));
          }
          33% {
            filter: drop-shadow(0 0 8px rgba(0, 255, 0, 0.1))
              drop-shadow(0 0 12px rgba(255, 255, 0, 0.1));
          }
          66% {
            filter: drop-shadow(0 0 8px rgba(0, 0, 255, 0.1))
              drop-shadow(0 0 12px rgba(0, 255, 255, 0.1));
          }
          100% {
            filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.1))
              drop-shadow(0 0 12px rgba(255, 0, 255, 0.1));
          }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          // zIndex: 9999,
          animation: isShaking
            ? 'saturate 0.6s cubic-bezier(.36,.07,.19,.97) both'
            : 'none',
          // mixBlendMode: 'saturation',
          backgroundImage: 'url("/still-background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      <div
        style={{
          position: 'absolute',
          zIndex: 3,
          height: TOP_BAR_HEIGHT,
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          justifyContent: 'space-between',
          padding: '8px 16px',
          top: 0,
          left: 0,
          display: 'flex',
          width: '100vw',
          margin: 0,
          backgroundColor: 'rgba(255, 220, 180, 0.8)',
          backdropFilter:
            'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
          WebkitBackdropFilter:
            'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
          boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)',
        }}
      >
        <p
          style={{
            color: 'rgba(0, 0, 0, 0.8)',
            fontWeight: 500,
          }}
        >
          Juice{' '}
          <i style={{ display: 'inline', color: 'rgba(80, 80, 80, .8)' }}>
            Zero
          </i>
        </p>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              border: '1px solid #000',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderRadius: 4,
              padding: '2px 4px',
              minWidth: 42,
              gap: 6,
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderColor: '#000',
            }}
          >
            <img style={{ width: 14, height: 14 }} src={'./kudos.png'} />
            <p
              style={{
                fontSize: 16,
                color: '#000',
                fontWeight: userData?.totalKudos > 0 ? 'bold' : 'normal',
              }}
            >
              {userData?.totalKudos || 0}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              border: '1px solid #000',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderRadius: 4,
              padding: '2px 4px',
              minWidth: 42,
              gap: 6,
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderColor: '#000',
            }}
          >
            <img style={{ width: 14, height: 14 }} src={'/jungle/token.png'} />
            <p
              style={{
                fontSize: 16,
                color: '#000',
                fontWeight: userData?.totalKudos > 0 ? 'bold' : 'normal',
              }}
            >
              {userData?.totalTokens || 0}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              border: '1px solid #000',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderRadius: 4,
              padding: '2px 4px',
              minWidth: 42,
              gap: 6,
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderColor: '#000',
            }}
          >
            <img
              style={{ width: 14, height: 14 }}
              src={'/jungle/goldToken.png'}
            />
            <p
              style={{
                fontSize: 16,
                color: '#000',
                fontWeight: userData?.totalKudos > 0 ? 'bold' : 'normal',
              }}
            >
              {userData?.totalRedeemableTokens || 0}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {openWindows.includes('welcomeWindow') && (
          <WelcomeWindow
            isJungle={isJungle}
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

        {openWindows.includes('achievements') && userData && (
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

        {openWindows.includes('wutIsJuice') && (
          <WutIsJuiceWindow
            position={wutIsJuicePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'wutIsJuice'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('wutIsJuice')}
            ACTIVE_Z_INDEX={getWindowZIndex('wutIsJuice')}
          />
        )}

        {openWindows.includes('wutIsJungle') && (
          <WutIsJungleWindow
            position={wutIsJunglePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'wutIsJungle'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('wutIsJungle')}
            ACTIVE_Z_INDEX={getWindowZIndex('wutIsJungle')}
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

        {openWindows.includes('faction') && userData && (
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

        {openWindows.includes('firstChallenge') && userData && (
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

        {openWindows.includes('juiceWindow') && userData && (
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

        {openWindows.includes('jungleWindow') && userData && (
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

        {openWindows.includes('fruitBasketWindow') && userData && (
          <FruitBasketWindow
            position={fruitBasketWindowPosition}
            isDragging={isDragging && activeWindow === 'fruitBasketWindow'}
            isActive={
              windowOrder[windowOrder.length - 1] === 'fruitBasketWindow'
            }
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

        {openWindows.includes('jungleShopWindow') && (
          <JungleShopWindow
            position={jungleShopWindowPosition}
            isDragging={isDragging && activeWindow === 'jungleShopWindow'}
            isActive={
              windowOrder[windowOrder.length - 1] === 'jungleShopWindow'
            }
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('jungleShopWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('jungleShopWindow')}
            userData={userData}
            setUserData={setUserData}
            startJuicing={startJuicing}
            playCollectSound={playCollectSound}
            isJuicing={isJuicing}
            setOpenWindows={setOpenWindows}
            setWindowOrder={setWindowOrder}
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
              animation: showCookies
                ? 'fortuneCookiePop 0.4s ease forwards'
                : 'none',
              zIndex: getWindowZIndex('fortuneBasket'),
              transform: `translate(${fortuneBasketPosition.x}px, ${fortuneBasketPosition.y}px)`,
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
        {openWindows.includes('Gallery') && (
          <GalleryWindow
            position={GalleryPosition}
            isDragging={isDragging && activeWindow === 'Gallery'}
            isActive={windowOrder[windowOrder.length - 1] === 'Gallery'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('Gallery')}
            ACTIVE_Z_INDEX={getWindowZIndex('Gallery')}
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

        {openWindows.includes('secondChallenge') && userData && (
          <SecondChallengeWindow
            position={secondChallengePosition}
            isDragging={isDragging && activeWindow === 'secondChallenge'}
            isActive={windowOrder[windowOrder.length - 1] === 'secondChallenge'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('secondChallenge')}
            ACTIVE_Z_INDEX={getWindowZIndex('secondChallenge')}
            userData={userData}
            setUserData={setUserData}
          />
        )}

        {openWindows.includes('menuWindow') && userData && (
          <MenuWindow
            position={menuWindowPosition}
            isDragging={isDragging && activeWindow === 'menuWindow'}
            isActive={windowOrder[windowOrder.length - 1] === 'menuWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('menuWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('menuWindow')}
            userData={userData}
            setUserData={setUserData}
          />
        )}

        {openWindows.includes('zero') && (
          <ZeroWindow
            position={zeroWindowPosition}
            isDragging={isDragging && activeWindow === 'zero'}
            isActive={windowOrder[windowOrder.length - 1] === 'zero'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('zero')}
            ACTIVE_Z_INDEX={getWindowZIndex('zero')}
          />
        )}

        {openWindows.includes('tamagotchiNotes') && (
          <TamagotchiNotesWindow
            position={tamagotchiNotesPosition}
            isDragging={isDragging && activeWindow === 'tamagotchiNotes'}
            isActive={windowOrder[windowOrder.length - 1] === 'tamagotchiNotes'}
            handleMouseDown={handleMouseDown('tamagotchiNotes')}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('tamagotchiNotes')}
            ACTIVE_Z_INDEX={getWindowZIndex('tamagotchiNotes')}
          />
        )}

        {openWindows.includes('wutIsPenguathon') && (
          <WutIsPenguathonWindow
            position={wutIsPenguathonWindowPosition}
            isDragging={isDragging && activeWindow === 'zero'}
            isActive={windowOrder[windowOrder.length - 1] === 'zero'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('wutIsPenguathon')}
            ACTIVE_Z_INDEX={getWindowZIndex('wutIsPenguathon')}
          />
        )}

        <audio id="juicerAudio" src="./juicer.mp3" preload="auto"></audio>
        <audio id="collectAudio" src="./collect.mp3" preload="auto"></audio>
        <audio id="windowOpenAudio" src="./sounds/windowOpenSound.wav" />
      </div>
    </div>
  );
}
