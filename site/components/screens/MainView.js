import React, { Suspense, useState } from 'react';
import FileIcon from '../FileIcon';
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
import Background from '../Background';
import ShareSuccessPanel from './ShareSuccessPanel';
import FortuneBasket from './FortuneBasket';
import ThanksWindow from './ThanksWindow';
import JungleWindow from './JungleWindow';
import FruitBasketWindow from './FruitBasketWindow';
import WutIsJungleWindow from './WutIsJungleWindow';
import SecondChallengeWindow from './SecondChallengeWindow';
import MenuWindow from './MenuWindow';
import PostcardWindow from './PostcardWindow';
import WutIsRelayWindow from './WutIsRelayWindow';
import JungleShopWindow from './JungleShopWindow';
import TamagotchiNotesWindow from './TamagotchiNotesWindow';
import ZeroWindow from './ZeroWindow';
import WutIsPenguathonWindow from './WutIsPenguathonWindow';
import VillagerPokemonCard from '../VillagerPokemonCard';
import BrucePokemonCard from '../BrucePokemonCard';
import Win7PokemonCard from '../Win7PokemonCard';
import CardCreatorWindow from './CardCreatorWindow';
import RabbitMessage from '../RabbitMessage';
import V1Challenge from './V1Challenge';
import WutIsBubbleathonWindow from './WutIsBubbleathonWindow';
import ItineraryWindow from './ItineraryWindow';

export default function MainView({
  isLoggedIn,
  setIsLoggedIn,
  userData,
  setUserData,
  isJungle,
}) {



  const [time, setTime] = React.useState(new Date());
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [activeJuicersCount, setActiveJuicersCount] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState(null);
  const [welcomePosition, setWelcomePosition] = React.useState({ x: 0, y: 0 });
  const [achievementsPosition, setAchievementsPosition] = React.useState({
    x: 50,
    y: 50,
  });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = React.useState(['welcomeWindow']);
  const [windowOrder, setWindowOrder] = React.useState(['welcomeWindow']);
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
    x: 150,
    y: 150,
  });
  const [videoPosition, setVideoPosition] = React.useState({ x: 200, y: 200 });
  const [factionPosition, setFactionPosition] = React.useState({
    x: 250,
    y: 250,
  });
  const [firstChallengePosition, setFirstChallengePosition] = React.useState({
    x: 300,
    y: 300,
  });
  const [juiceWindowPosition, setJuiceWindowPosition] = React.useState({
    x: 0,
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
    x: -150,
    y: 0,
  });
  const [wutIsPenguathonWindowPosition, setWutIsPenguathonWindowPosition] =
    React.useState({
      x: 400,
      y: 150,
    });
  const [itineraryPosition, setItineraryPosition] = React.useState({
    x: 400,
    y: 150,
  });

  const [wutIsBubbleathonWindowPosition, setWutIsBubbleathonWindowPosition] =
    React.useState({
      x: 400,
      y: 150,
    });

  const [isShaking, setIsShaking] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const collectSoundRef = React.useRef(null);
  const [tickets, setTickets] = React.useState([]);
  const [isRsvped, setIsRsvped] = React.useState(false);
  const [showCookies, setShowCookies] = React.useState(false);
  const [kudosPosition, setKudosPosition] = React.useState({ x: 350, y: 350 });
  const [GalleryPosition, setGalleryPosition] = React.useState({
    x: 400,
    y: 400,
  });

  const [isJuicing, setIsJuicing] = React.useState(false);
  const juicerSoundRef = React.useRef(null);
  const [thanksPosition, setThanksPosition] = React.useState({
    x: 400,
    y: 400,
  });
  const [secondChallengePosition, setSecondChallengePosition] = React.useState({
    x: 350,
    y: 350,
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [postcardPosition, setPostcardPosition] = React.useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wutIsRelayPosition, setWutIsRelayPosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [tamagotchiNotesPosition, setTamagotchiNotesPosition] = React.useState({
    x: 100,
    y: 100,
  });

  const [penguathonCountdown, setPenguathonCountdown] = React.useState('');

  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef(null);

  const [countdownText, setCountdownText] = React.useState('');

  const [currentSound, setCurrentSound] = React.useState('');

  // Add this near the top with other state declarations
  const [displayedMessage, setDisplayedMessage] = React.useState('');
  const [playedCompletionSound, setPlayedCompletionSound] =
    React.useState(false); // Move this here
  const messageRef = React.useRef('');

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
    jungleShopWindowPosition: 300,
    fortuneBasket: 220,
    thanks: 300,
    secondChallenge: 300,
    menuWindow: 470,
    wutIsRelay: 470,
    galleryWindow: 397,
    tamagotchiNotes: 470,
    galleryWindow: 397,
    zero: 300,
    wutIsPenguathon: 300,
    cardCreator: 470,
    wutIsBubbleathon: 300,
  };
  const BASE_Z_INDEX = 1;

  // Remove the eggShake keyframes and replace with this new approach
  const [shakeValues, setShakeValues] = React.useState({ rotate: 0, scale: 1 });
  const shakeIntervalRef = React.useRef(null);

  const startShaking = () => {
    let time = 0;
    setIsExpanded(true);

    shakeIntervalRef.current = setInterval(() => {
      time += 50; // Update every 50ms
      setShakeValues({
        rotate: Math.sin(time * 0.1) * 2, // Oscillate between -2 and 2 degrees
        scale: 1.3 + Math.sin(time * 0.2) * 0.05, // Oscillate between 1.25 and 1.35
      });
    }, 50);
  };

  const stopShaking = () => {
    if (shakeIntervalRef.current) {
      clearInterval(shakeIntervalRef.current);
    }
    setShakeValues({ rotate: 0, scale: 1 });
    setIsExpanded(false);
  };

  const playRandomBritishSound = () => {
    try {
      const sounds = [
        'if i had arms.mp3',
        'constantly be an infant.mp3',
        'do you want me to stay small forevrr.mp3',
        'giving up now are we_.mp3',
        'ill jusft sit here and rot.mp3',
        'like a forgotten lemon.mp3',
        'like a juice carton with no straw.mp3',
        'oi slacker.mp3',
        'otherwise I_ll meet my tragic death.mp3',
        'sad little pixel.mp3',
        'the blender is gaining dust.mp3',
        'wither away like a biscuit in a cup of tea.mp3',
      ];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const audio = new Audio(`/BritishSoundsBad/${randomSound}`);

      audio.addEventListener('play', startShaking);
      audio.addEventListener('ended', stopShaking);
      audio.addEventListener('pause', stopShaking);
      audio.addEventListener('error', stopShaking);

      audio.play().catch((error) => {
        console.log('Audio playback error:', error);
        stopShaking();
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const kickoffDate = new Date('2025-02-01T19:30:00-05:00'); // EST time
      const diff = kickoffDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysNoun = pluralize(days, "Day", "Days");
        const hoursNoun = pluralize(hours, "Hour", "Hours");
        const minutesNoun = pluralize(minutes, "Minute", "Minutes");
        const secondsNoun = pluralize(seconds, "Second", "Seconds");

        setTimeRemaining(
          `${days} ${daysNoun}, ${hours} ${hoursNoun}, ${minutes} ${minutesNoun}, ${seconds} ${secondsNoun}`
        );
      } else {
        setTimeRemaining('Event has started!');
      }
    }, []);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleFileClick = (fileId) => (e) => {
    e.stopPropagation();
    if (selectedFile === fileId) {
      if (fileId === 'Achievements') {
        if (!openWindows.includes('achievements')) {
          setOpenWindows((prev) => [...prev, 'achievements']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'achievements'),
            'achievements',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'achievements'),
            'achievements',
          ]);
        }
      } else if (fileId === 'file1') {
        if (!openWindows.includes('wutIsJuice')) {
          setOpenWindows((prev) => [...prev, 'wutIsJuice']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJuice'),
            'wutIsJuice',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJuice'),
            'wutIsJuice',
          ]);
        }
      } else if (fileId === 'Register') {
        if (!openWindows.includes('register')) {
          setOpenWindows((prev) => [...prev, 'register']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
        }
      } else if (fileId === 'Juicer') {
        if (!openWindows.includes('juiceWindow')) {
          setOpenWindows((prev) => [...prev, 'juiceWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'juiceWindow'),
            'juiceWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'juiceWindow'),
            'juiceWindow',
          ]);
        }
      } else if (fileId === 'video.mp4') {
        if (!openWindows.includes('video')) {
          setOpenWindows((prev) => [...prev, 'video']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'video'),
            'video',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'video'),
            'video',
          ]);
        }
      } else if (fileId === 'Fortune Basket') {
        if (!openWindows.includes('fortuneBasket')) {
          setOpenWindows((prev) => [...prev, 'fortuneBasket']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fortuneBasket'),
            'fortuneBasket',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fortuneBasket'),
            'fortuneBasket',
          ]);
        }
      } else if (fileId === 'Kudos') {
        if (!openWindows.includes('kudos')) {
          setOpenWindows((prev) => [...prev, 'kudos']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'kudos'),
            'kudos',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'kudos'),
            'kudos',
          ]);
        }
      } else if (fileId === 'Thanks') {
        if (!openWindows.includes('thanks')) {
          setOpenWindows((prev) => [...prev, 'thanks']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'thanks'),
            'thanks',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'thanks'),
            'thanks',
          ]);
        }
      } else if (fileId === 'Menu') {
        if (!openWindows.includes('menuWindow')) {
          setOpenWindows((prev) => [...prev, 'menuWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'menuWindow'),
            'menuWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'menuWindow'),
            'menuWindow',
          ]);
        }
      } else if (fileId === 'Jungle') {
        if (!openWindows.includes('jungleWindow')) {
          setOpenWindows((prev) => [...prev, 'jungleWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleWindow'),
            'jungleWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleWindow'),
            'jungleWindow',
          ]);
        }
      } else if (fileId === 'FruitBasket') {
        if (!openWindows.includes('fruitBasketWindow')) {
          setOpenWindows((prev) => [...prev, 'fruitBasketWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fruitBasketWindow'),
            'fruitBasketWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fruitBasketWindow'),
            'fruitBasketWindow',
          ]);
        }
      } else if (fileId === 'Gallery') {
        if (!openWindows.includes('Gallery')) {
          setOpenWindows((prev) => [...prev, 'Gallery']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'Gallery'),
            'gallery',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'gallery'),
            'gallery',
          ]);
        }
      } else if (fileId === 'wutIsJungle') {
        if (!openWindows.includes('wutIsJungle')) {
          setOpenWindows((prev) => [...prev, 'wutIsJungle']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJungle'),
            'wutIsJungle',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJungle'),
            'wutIsJungle',
          ]);
        }
      } else if (fileId === 'JungleShop') {
        if (!openWindows.includes('jungleShopWindow')) {
          setOpenWindows((prev) => [...prev, 'jungleShopWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleShopWindow'),
            'jungleShopWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleShopWindow'),
            'jungleShopWindow',
          ]);
        }
      } else if (fileId === 'tamagotchiNotes') {
        if (!openWindows.includes('tamagotchiNotes')) {
          setOpenWindows((prev) => [...prev, 'tamagotchiNotes']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'tamagotchiNotes'),
            'tamagotchiNotes',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'tamagotchiNotes'),
            'tamagotchiNotes',
          ]);
        }
      } else if (fileId === 'Juice Zero') {
        if (!openWindows.includes('zero')) {
          setOpenWindows((prev) => [...prev, 'zero']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'zero'),
            'zero',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'zero'),
            'zero',
          ]);
        }
      } else if (fileId === 'itinerary') {
        if (e.detail === 2) { // Double click
          if (!openWindows.includes('itineraryWindow')) {
            setOpenWindows((prev) => [...prev, 'itineraryWindow']);
            setWindowOrder((prev) => [
              ...prev.filter((w) => w !== 'itineraryWindow'),
              'itineraryWindow',
            ]);
            setActiveWindow('itineraryWindow');
            document.getElementById('windowOpenAudio').currentTime = 0;
            document.getElementById('windowOpenAudio').play();
          } else {
            setWindowOrder((prev) => [
              ...prev.filter((w) => w !== 'itineraryWindow'),
              'itineraryWindow',
            ]);
            setActiveWindow('itineraryWindow');
          }
        }
        setSelectedFile('itinerary');
      } 
    }
    setSelectedFile(fileId);
  };

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
      case 'wutIsRelay':
        position = wutIsRelayPosition;
        break;
      case 'jungleShopWindow':
        position = jungleShopWindowPosition;
        break;
      case 'tamagotchiNotes':
        position = tamagotchiNotesPosition;
        break;
      case 'zero':
        position = zeroWindowPosition;
        break;
      case 'wutIsPenguathon':
        position = wutIsPenguathonWindowPosition;
        break;
      case 'cardCreator':
        position = cardCreatorPosition;
        break;
      case 'wutIsBubbleathon':
        position = wutIsBubbleathonWindowPosition;
        break;
      case 'itineraryWindow':
        position = itineraryPosition;
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
      } else if (activeWindow === 'wutIsRelay') {
        setWutIsRelayPosition(newPosition);
      } else if (activeWindow === 'jungleShopWindow') {
        setJungleShopWindowPosition(newPosition);
      } else if (activeWindow === 'tamagotchiNotes') {
        setTamagotchiNotesPosition(newPosition);
      } else if (activeWindow === 'zero') {
        setZeroWindowPosition(newPosition);
      } else if (activeWindow === 'wutIsPenguathon') {
        setWutIsPenguathonWindowPosition(newPosition);
      } else if (activeWindow === 'cardCreator') {
        setCardCreatorPosition(newPosition);
      } else if (activeWindow === 'wutIsBubbleathon') {
        setWutIsBubbleathonWindowPosition(newPosition);
      } else if (activeWindow === 'itineraryWindow') {
        setItineraryPosition(newPosition);
      }
    }
  }; // Add closing brace here

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

  const handleJuiceClick = () => {
    if (!openWindows.includes('welcomeWindow')) {
      setOpenWindows((prev) => [...prev, 'welcomeWindow']);
      setWelcomePosition({ x: 0, y: 0 });
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'welcomeWindow'),
        'welcomeWindow',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'welcomeWindow'),
        'welcomeWindow',
      ]);
    }
  };

  const handleWindowClick = (windowName) => (e) => {
    e.stopPropagation();
    setWindowOrder((prev) => [
      ...prev.filter((w) => w !== windowName),
      windowName,
    ]);
  };

  const handleRegisterOpen = () => {
    if (!openWindows.includes('register')) {
      setOpenWindows((prev) => [...prev, 'register']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'register'),
        'register',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'register'),
        'register',
      ]);
    }
  };

  const handleFactionOpen = () => {
    if (!openWindows.includes('faction')) {
      setOpenWindows((prev) => [...prev, 'faction']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'faction'),
        'faction',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'faction'),
        'faction',
      ]);
    }
  };

  const handleFirstChallengeOpen = () => {
    if (!openWindows.includes('firstChallenge')) {
      setOpenWindows((prev) => [...prev, 'firstChallenge']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'firstChallenge'),
        'firstChallenge',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'firstChallenge'),
        'firstChallenge',
      ]);
    }
  };
  const handleSecondChallengeOpen = () => {
    if (!openWindows.includes('secondChallenge')) {
      setOpenWindows((prev) => [...prev, 'secondChallenge']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'secondChallenge'),
        'secondChallenge',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'secondChallenge'),
        'secondChallenge',
      ]);
    }
  };

  const handleBubbleathonClick = () => {
    if (!openWindows.includes('wutIsBubbleathon')) {
      setOpenWindows([...openWindows, 'wutIsBubbleathon']);
      setWindowOrder([...windowOrder, 'wutIsBubbleathon']);
    } else {
      handleWindowClick('wutIsBubbleathon')();
    }
  };

  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Open register window if no token
        if (!openWindows.includes('register')) {
          setOpenWindows((prev) => [...prev, 'register']);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
        }
        return;
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  React.useEffect(() => {
    juicerSoundRef.current = new Audio('./juicer.mp3');
    juicerSoundRef.current.volume = 0.5;
    collectSoundRef.current = new Audio('./collect.mp3');
    collectSoundRef.current.volume = 0.5;
  }, []);

  React.useEffect(() => {
    if (userData?.invitesAvailable) {
      const allTickets = ['orange', 'kiwi', 'apple'];
      setTickets(
        allTickets.map((id) => ({
          id,
          used: !userData.invitesAvailable.includes(id),
        }))
      );
    }
  }, [userData?.invitesAvailable]);

  const handleFortuneCookieOpen = () => {
    if (!openWindows.includes('fortuneBasket')) {
      setOpenWindows((prev) => [...prev, 'fortuneBasket']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
    }
  };

  const handleAchievementsOpen = () => {
    if (!openWindows.includes('achievements')) {
      setOpenWindows((prev) => [...prev, 'achievements']);
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

  const isBeforeBubbleathonTime = () => {
    return Date.now() < 1741447800000;
  };

  const isBubbleathonTime = () => {
    return Date.now() > 1741447800000 && Date.now() < 1741465800000;
  };

  const getBubbleathonState = () => {
    const bubbleathonStart = 1741447800000;
    const bubbleathonEnd = 1741465800000;

    if (Date.now() > bubbleathonEnd) {
      return null;
    }

    if (Date.now() < bubbleathonStart) {
      return 'upcoming';
    }

    return 'happening now!';
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 20000); // Update every 20 seconds

    return () => clearInterval(timer);
  }, []);

  // Fetch active juicers count
  React.useEffect(() => {
    const fetchActiveJuicersCount = async () => {
      try {
        const response = await fetch('/api/get-active-juicers');
        if (response.ok) {
          const data = await response.json();
          setActiveJuicersCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching active juicers count:', error);
      }
    };

    // Fetch immediately
    fetchActiveJuicersCount();

    // Set up interval to fetch every 20 seconds
    const interval = setInterval(fetchActiveJuicersCount, 20000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 20000); // Update every second

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const penguathonStart = new Date(1740236400000);
      const penguathonEnd = new Date(1740294000000);

      if (now >= penguathonStart && now <= penguathonEnd) {
        const totalSeconds = 24 * 60 * 60; // 24 hours in seconds
        const elapsedSeconds = Math.floor((now - penguathonStart) / 1000);
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        setPenguathonCountdown(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // 1 second grace period
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Get next Friday 9pm EST
      const friday = new Date();
      friday.setDate(friday.getDate() + ((5 + 7 - friday.getDay()) % 7)); // Next Friday
      friday.setHours(21, 0, 0, 0); // 9pm
      friday.setMinutes(0);
      friday.setSeconds(0);

      const diff = friday - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdownText('Egg Hatched!');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSquareClick = async (e) => {
    e.stopPropagation();

    // Check progress before playing sound
    const progress = getProgressPercentage(userData);
    if (progress >= 100) {
      playRandomGoodSound();
    } else {
      playRandomBritishSound();
    }

    // Only create Tamagotchi if user is logged in and doesn't have one yet
    if (isLoggedIn && !userData?.Tamagotchi?.length) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/create-tamagotchi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to create Tamagotchi');
        }

        const data = await response.json();

        // Update userData with the new Tamagotchi
        setUserData((prevData) => ({
          ...prevData,
          Tamagotchi: [data.record],
        }));

        console.log('Tamagotchi created:', data);
      } catch (error) {
        console.error('Error creating Tamagotchi:', error);
      }
    }
  };

  // Add this function near the top with other helper functions
  const getEggColor = (email) => {
    if (!email) return 'blueegg.gif';

    const firstChar = email.charAt(0).toLowerCase();
    // Split alphabet roughly into thirds
    if ('abcdefghi'.includes(firstChar)) {
      return 'blueegg.gif';
    } else if ('jklmnopq'.includes(firstChar)) {
      return 'greenegg.gif';
    } else {
      return 'pinkegg.gif';
    }
  };

  // Add this helper function near the top of MainView component
  const getTamagotchiDay = (startDate) => {
    // Try to get the current day from localStorage first
    const storedCurrentDay = localStorage.getItem('tamagotchiCurrentDay');
    if (storedCurrentDay) {
      return parseInt(storedCurrentDay, 10);
    }

    if (!startDate) return 1;

    // Fallback to calculation
    const start = new Date(startDate);
    const now = new Date();
    const diffHours = (now - start) / (1000 * 60 * 60);
    return Math.floor(diffHours / 24) + 1;
  };

  // Helper function to get hours for stretches that ended in a given window
  const getHoursInWindow = (stretches, windowStart, windowEnd, tamagotchiStart) => {
    if (!stretches) return 0;
    return stretches.reduce((total, stretch) => {
      const stretchStart = new Date(stretch.startTime);
      const stretchEnd = new Date(stretch.endTime);

      // If stretch ends after tamagotchi was created and before window end
      if (stretchEnd >= tamagotchiStart && stretchEnd <= windowEnd) {
        // If stretch started before tamagotchi, only count time after tamagotchi creation
        const effectiveStart = stretchStart < tamagotchiStart ? tamagotchiStart : stretchStart;
        const overlapHours = (stretchEnd - effectiveStart) / (1000 * 60 * 60);
        return total + overlapHours;
      }
      return total;
    }, 0);
  };

  // Get hours for stretches that ended in the current window
  const getTodaysHours = (stretches, periodStart) => {
    if (!stretches || !periodStart) return 0;

    const now = new Date();
    const periodStartDate = new Date(periodStart);
    const periodEnd = new Date(now > periodStartDate ? now : periodStartDate);

    return stretches.reduce((total, stretch) => {
      const stretchStart = new Date(stretch.startTime);
      const stretchEnd = new Date(stretch.endTime);

      // Skip if stretch ended before period start
      if (stretchEnd < periodStartDate) {
        return total;
      }

      // Calculate overlap duration
      const effectiveStart = stretchStart < periodStartDate ? periodStartDate : stretchStart;
      const effectiveEnd = stretchEnd < periodEnd ? stretchEnd : periodEnd;
      const overlapHours = (effectiveEnd - effectiveStart) / (1000 * 60 * 60);

      return total + overlapHours;
    }, 0);
  };

  // Update isTamagotchiDead to use the same window logic
  const isTamagotchiDead = (userData) => {
    if (!userData?.Tamagotchi?.[0]) return false;

    const tamagotchi = userData.Tamagotchi[0];
    if (!tamagotchi.isAlive) return true;

    const startDate = new Date(tamagotchi.startDate);
    const now = new Date();

    // Don't check for death in the first 24 hours
    const timeSinceStart = Math.abs(now - startDate);
    const hoursSinceStart = timeSinceStart / (1000 * 60 * 60);
    if (hoursSinceStart < 24) return false;

    // Only check for death if more than 24 hours have passed since the last juicing
    const lastJuiceTime = userData?.Loops?.['juiceLastOmgMomentAt']
      ? new Date(userData.Loops['juiceLastOmgMomentAt'])
      : now;

    const timeSinceLastJuice = Math.abs(now - lastJuiceTime);
    const hoursSinceLastJuice = timeSinceLastJuice / (1000 * 60 * 60);

    return hoursSinceLastJuice > 24;
  };

  // Update getRemainingHours to track daily requirement
  const getRemainingHours = (userData) => {
    const startDate = userData?.Tamagotchi?.[0]?.startDate;
    if (!startDate) return { hoursNeeded: '0.0', hoursLeft: '0.0' };

    const start = new Date(startDate);
    const now = new Date();
    const hoursSinceStart = (now - start) / (1000 * 60 * 60);
    const currentPeriodEnd = new Date(start.getTime() + (Math.floor(hoursSinceStart / 24) + 1) * 24 * 60 * 60 * 1000);
    const hoursUntilNextPeriod = (currentPeriodEnd - now) / (1000 * 60 * 60);

    // Calculate hours worked in current period
    const periodStart = new Date(currentPeriodEnd.getTime() - 24 * 60 * 60 * 1000);
    const todaysJuiceHours = getTodaysHours(userData?.juiceStretches, periodStart);
    const todaysJungleHours = getTodaysHours(userData?.jungleStretches, periodStart);
    const totalHours = todaysJuiceHours + todaysJungleHours;

    return {
      hoursNeeded: Math.max(0, 2 - totalHours).toFixed(1),
      hoursLeft: hoursUntilNextPeriod.toFixed(1)
    };
  };

  // Update getProgressPercentage to use the same window logic
  const getProgressPercentage = (userData) => {
    if (!userData?.Tamagotchi?.length) return 0;

    const startDate = userData.Tamagotchi[0].startDate;
    if (!startDate) return 0;

    const start = new Date(startDate);
    const now = new Date();
    const hoursSinceStart = (now - start) / (1000 * 60 * 60);
    const currentPeriodEnd = new Date(start.getTime() + (Math.floor(hoursSinceStart / 24) + 1) * 24 * 60 * 60 * 1000);

    // Calculate hours worked in current period
    const periodStart = new Date(currentPeriodEnd.getTime() - 24 * 60 * 60 * 1000);
    const todaysJuiceHours = getTodaysHours(userData?.juiceStretches, periodStart);
    const todaysJungleHours = getTodaysHours(userData?.jungleStretches, periodStart);
    const totalHours = todaysJuiceHours + todaysJungleHours;

    // Progress is based on getting 2 hours per day
    return Math.min(100, (totalHours / 2) * 100);
  };

  const pluralize = (value, singular, plural) => parseFloat(value) === 1 ? singular : plural;

  // Add this after getProgressPercentage and before MainView component
  const getStatusMessage = (userData) => {
    const remainingHours = getRemainingHours(userData);
    const startTime = userData?.Tamagotchi?.[0]?.startDate;
    const now = new Date();

    // Calculate next feeding deadline in UTC
    const nextFeedingDeadline = startTime
      ? new Date(new Date(startTime).getTime() + 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const hoursUntilDeadline = Math.max(
      0,
      Math.ceil(
        (nextFeedingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      )
    );
    const daysLeft =
      10 - getTamagotchiDay(userData?.Tamagotchi?.[0]?.startDate);

    const tilDeadlineNoun = pluralize(hoursUntilDeadline, "hour", "hours");
    const remainingHoursNoun = pluralize(remainingHours, "hour", "hours");
    const daysLeftNoun = pluralize(daysLeft, "day", "days");

    if (remainingHours === '0.00') {
      return `I'm full for the next ${hoursUntilDeadline} ${tilDeadlineNoun}. ty for feeding me. just ${daysLeft} more ${daysLeftNoun} of feeding me and then I'll come to you in the mail as a tamagotchi`;
    } else {
      return `i'm hungry! feed me ${remainingHours} ${remainingHoursNoun} hours of juice or jungle within the next ${hoursUntilDeadline} ${tilDeadlineNoun} or I'll perish. ${
        daysLeft > 0
          ? `if you keep me alive ${daysLeft} more ${daysLeftNoun}, Hack Club will mail me to you (a real life tamagotchi)`
          : 'Hack Club will mail me to you soon!'
      }`;
    }
  };

  // Add this effect to handle the typing animation
  React.useEffect(() => {
    if (!isHovered) {
      setDisplayedMessage('');
      return;
    }

    const progress = getProgressPercentage(userData);

    // Play completion sound when reaching 100% for the first time today
    if (progress >= 100 && !playedCompletionSound) {
      playRandomGoodSound();
      setPlayedCompletionSound(true);
    }

    const message = !isTamagotchiDead(userData) && getStatusMessage(userData);
    messageRef.current = message || '';

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= messageRef.current.length) {
        setDisplayedMessage(messageRef.current.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 7); // Changed from 20ms to 7ms for 3x speed

    return () => clearInterval(interval);
  }, [isHovered, userData, playedCompletionSound]);

  // Reset the completion sound flag at midnight
  React.useEffect(() => {
    const resetCompletionSound = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setPlayedCompletionSound(false);
      }
    };

    const interval = setInterval(resetCompletionSound, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Add this new function near the other sound functions
  const playRandomGoodSound = () => {
    try {
      const sounds = [
        'distinguished gentlepet.mp3',
        'another day for my cup of tea.mp3',
        'blimey, tail wagging.mp3',
        'chance to meet.mp3',
        'high five.mp3',
        'most well raised in history.mp3',
        'orange juice or apple juice_.mp3',
        'round of applause.mp3',
        'stupendous work.mp3',
        'well done mate.mp3',
      ];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const audio = new Audio(`/BritishSoundsGood/${randomSound}`);

      audio.addEventListener('play', startShaking);
      audio.addEventListener('ended', stopShaking);
      audio.addEventListener('pause', stopShaking);
      audio.addEventListener('error', stopShaking);

      audio.play().catch((error) => {
        console.log('Audio playback error:', error);
        stopShaking();
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Update the getEggColor function to getTamagotchiType
  const getTamagotchiType = (email) => {
    if (!email) return 'kiwibird.gif'; // Default blue

    const firstChar = email.charAt(0).toLowerCase();
    // Match animals to similar colored eggs:
    // kiwibird (blue) -> blueegg
    // blueberryturtle (green) -> greenegg
    // strawberrycat (pink/red) -> pinkegg
    if ('abcdefghi'.includes(firstChar)) {
      return 'kiwibird.gif'; // Blue theme
    } else if ('jklmnopq'.includes(firstChar)) {
      return 'blueberryturtle.gif'; // Green theme
    } else {
      return 'strawberrycat.gif'; // Pink/red theme
    }
  };

  // Add this function after getRemainingHours
  const getMessage = (userData) => {
    if (!userData?.Tamagotchi?.length) {
      return 'Click to hatch a Tamagotchi!';
    }

    const tamagotchi = userData.Tamagotchi[0];
    if (!tamagotchi.isAlive) {
      return 'Your Tamagotchi died! Click to try again.';
    }

    return 'Keep me alive by giving me more juice & jungle fruits yum yum yum';
  };

  // Add these new state variables with the other state declarations
  const [pressTimer, setPressTimer] = React.useState(null);
  const [pressStartTime, setPressStartTime] = React.useState(null);
  const [showPressIndicator, setShowPressIndicator] = React.useState(false);
  const [pressUpdateInterval, setPressUpdateInterval] = React.useState(null);

  // Add these new handler functions before the return statement
  const handleTamagotchiMouseDown = () => {
    if (!userData?.Tamagotchi?.length) return; // Only work if there's a Tamagotchi

    setPressStartTime(Date.now());
    const timer = setTimeout(async () => {
      const shouldDelete = window.confirm("Are you sure you want to kill the Tamagotchi and start fresh?");
      if (shouldDelete) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/delete-tamagotchi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            // Update local state first
            setUserData(prev => ({
              ...prev,
              Tamagotchi: []
            }));
            // Then refresh the page
            window.location.reload();
          } else {
            console.error('Failed to delete Tamagotchi');
          }
        } catch (error) {
          console.error('Error deleting Tamagotchi:', error);
        }
      }
    }, 10000); // 10 seconds
    setPressTimer(timer);
    setShowPressIndicator(true);

    // Start interval to update progress bar
    const interval = setInterval(() => {
      setPressStartTime(prev => prev); // Force re-render to update progress bar
    }, 100);
    setPressUpdateInterval(interval);
  };

  const handleTamagotchiMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    if (pressUpdateInterval) {
      clearInterval(pressUpdateInterval);
      setPressUpdateInterval(null);
    }
    setPressStartTime(null);
    setShowPressIndicator(false);
  };

  // Add cleanup effect
  React.useEffect(() => {
    return () => {
      if (pressTimer) clearTimeout(pressTimer);
      if (pressUpdateInterval) clearInterval(pressUpdateInterval);
    };
  }, [pressTimer, pressUpdateInterval]);

  // Add these state variables at the top of MainView component
  const [villagerHover, setVillagerHover] = useState(false);
  const [win7Hover, setWin7Hover] = useState(false);
  const [bruceHover, setBruceHover] = useState(false);

  // Add single hover state
  const [isCardsFanned, setIsCardsFanned] = useState(false);

  const handleQuestionClick = (e) => {
    e.preventDefault(); // Prevent card click
    if (!openWindows.includes('cardCreator')) {
      setOpenWindows((prev) => [...prev, 'cardCreator']);
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'cardCreator'),
        'cardCreator'
      ]);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'cardCreator'),
        'cardCreator'
      ]);
    }
  };

  // Add this with the other position states near the top of MainView
  const [cardCreatorPosition, setCardCreatorPosition] = React.useState({
    x: 0,
    y: 0
  });

  // Add this state variable with the other state declarations
  const [lastSyncTime, setLastSyncTime] = React.useState(0);

  // Update the syncTamagotchiDays function to track last sync time
  const syncTamagotchiDays = async () => {
    if (!isLoggedIn || !userData?.Tamagotchi?.length) return;

    const now = Date.now();
    // Only sync if it's been more than 10 minutes since last sync
    if (now - lastSyncTime < 600000) { // 600000ms = 10 minutes
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sync-tamagotchi-days', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync Tamagotchi days');
      }

      const data = await response.json();

      // Update userData with the streak days
      setUserData(prevData => ({
        ...prevData,
        Tamagotchi: [
          {
            ...prevData.Tamagotchi[0],
            streakNumber: data.streakDays
          }
        ]
      }));

      // Store today's hours and OMG moments in localStorage
      localStorage.setItem('tamagotchiTodayHours', JSON.stringify(data.todayHours));
      localStorage.setItem('tamagotchiDayOmgMoments', JSON.stringify(data.dayOmgMoments));
      localStorage.setItem('tamagotchiDaysWithOmgMoments', JSON.stringify(data.daysWithOmgMoments));
      localStorage.setItem('tamagotchiCurrentDay', data.currentDay.toString());

      // Update last sync time
      setLastSyncTime(now);

      console.log('Tamagotchi days synced:', data);
    } catch (error) {
      console.error('Error syncing Tamagotchi days:', error);
    }
  };

  // Update the useEffect that handles syncing
  React.useEffect(() => {
    // ... existing code ...

    // Sync Tamagotchi days when component mounts and user is logged in
    if (isLoggedIn && userData?.Tamagotchi?.length) {
      syncTamagotchiDays();
    }

    // Set up a timer to sync Tamagotchi days every 10 minutes
    const syncInterval = setInterval(() => {
      if (isLoggedIn && userData?.Tamagotchi?.length) {
        syncTamagotchiDays();
      }
    }, 600000); // 600000ms = 10 minutes

    return () => clearInterval(syncInterval);
  }, [isLoggedIn, userData?.Tamagotchi]);

  // Add a function to get OMG moments for a specific day
  const getDayOmgMoments = (dayNumber) => {
    try {
      const dayOmgMomentsString = localStorage.getItem('tamagotchiDayOmgMoments');
      if (dayOmgMomentsString) {
        const dayOmgMoments = JSON.parse(dayOmgMomentsString);
        const dayKey = `Day${dayNumber}`;
        return dayOmgMoments[dayKey] || [];
      }
    } catch (e) {
      console.error('Error parsing day OMG moments:', e);
    }
    return [];
  };

  // Add a function to check if a day has OMG moments
  const dayHasOmgMoments = (dayNumber) => {
    try {
      const daysWithOmgMomentsString = localStorage.getItem('tamagotchiDaysWithOmgMoments');
      if (daysWithOmgMomentsString) {
        const daysWithOmgMoments = JSON.parse(daysWithOmgMomentsString);
        return daysWithOmgMoments.includes(dayNumber);
      }
    } catch (e) {
      console.error('Error parsing days with OMG moments:', e);
    }
    return false;
  };

  // Add this to the useEffect that loads user data
  React.useEffect(() => {
    // ... existing code ...

    // Sync Tamagotchi days when component mounts and user is logged in
    if (isLoggedIn && userData?.Tamagotchi?.length) {
      syncTamagotchiDays();
    }

    // Set up a timer to sync Tamagotchi days periodically (every 10 minutes)
    const syncInterval = setInterval(() => {
      if (isLoggedIn && userData?.Tamagotchi?.length) {
        syncTamagotchiDays();
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(syncInterval);
  }, [isLoggedIn, userData?.Tamagotchi]);

  // Add a function to get today's progress
  const getTodayProgress = () => {
    // Try to get today's hours from localStorage
    try {
      const todayHoursString = localStorage.getItem('tamagotchiTodayHours');
      if (todayHoursString) {
        const todayHours = JSON.parse(todayHoursString);
        return `${todayHours.total.toFixed(1)} / 2.0 hours`;
      }
    } catch (e) {
      console.error('Error parsing today hours:', e);
    }

    return "0.0 / 2.0 hours";
  };

  // Add a function to get the current streak
  const getTamagotchiStreak = () => {
    if (userData?.Tamagotchi?.[0]?.streakNumber) {
      return userData.Tamagotchi[0].streakNumber;
    }
    return 0;
  };

  // Add these new state variables
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayMoments, setDayMoments] = useState([]);
  const [videoKey, setVideoKey] = useState(0);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [selectedMoment, setSelectedMoment] = useState(null);

  // Add a function to get moments for a specific day
  const getDayMoments = (dayNumber) => {
    if (!userData?.juiceStretches && !userData?.jungleStretches) return [];

    const tamagotchiStartDate = userData?.Tamagotchi?.[0]?.startDate;
    if (!tamagotchiStartDate) return [];

    const dayStart = new Date(tamagotchiStartDate);
    dayStart.setDate(dayStart.getDate() + (dayNumber - 1));
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(tamagotchiStartDate);
    dayEnd.setDate(dayEnd.getDate() + dayNumber);
    dayEnd.setHours(0, 0, 0, 0);

    // Helper function to process stretches
    const processStretches = (stretches, type) => {
      if (!stretches) return [];
      return stretches.reduce((acc, stretch) => {
        if (!stretch.endTime) return acc;

        const stretchEnd = new Date(stretch.endTime);
        if (stretchEnd >= dayStart && stretchEnd < dayEnd && stretch.omgMoments && stretch.omgMoments.length > 0) {
          // Create a moment object for each omgMoment in the stretch
          const stretchMoments = stretch.omgMoments.map((_, index) => ({
            id: stretch.ID + "-" + index,
            description: stretch["description (from omgMoments)"]?.[index] || "",
            video: stretch["video (from omgMoments)"]?.[index] || "",
            created_at: stretch.endTime,
            stretchReview: stretch.Review?.[0] || "Pending",
            hours: Math.round((stretch.timeWorkedSeconds / 3600) * 10) / 10,
            type: type // Add type to distinguish between juice and jungle moments
          }));
          return [...acc, ...stretchMoments];
        }
        return acc;
      }, []);
    };

    // Get moments from both juice and jungle stretches
    const juiceMoments = processStretches(userData?.juiceStretches, 'juice');
    const jungleMoments = processStretches(userData?.jungleStretches, 'jungle');

    // Combine and sort all moments by creation time
    return [...juiceMoments, ...jungleMoments].sort((a, b) =>
      new Date(a.created_at) - new Date(b.created_at)
    );
  };

  // Add a function to get total hours for a day
  const getDayHours = (dayNumber) => {
    const moments = getDayMoments(dayNumber);
    return moments.reduce((total, moment) => total + (moment.hours || 0), 0).toFixed(1);
  };

  // Add handlers for moment navigation
  const handleMomentClick = (moment) => {
    const index = dayMoments.findIndex(m => m.id === moment.id);
    setCurrentMomentIndex(index);
    setSelectedMoment(moment);
  };

  const closePopup = () => {
    setSelectedMoment(null);
  };

  const navigateMoments = (direction) => {
    const newIndex = currentMomentIndex + direction;

    // Check bounds
    if (newIndex >= 0 && newIndex < dayMoments.length) {
      setCurrentMomentIndex(newIndex);
      setSelectedMoment(dayMoments[newIndex]);
      setVideoKey(prev => prev + 1);
    }
  };

  // Add this popup component for displaying moments
  const MomentPopup = ({ selectedMoment, closePopup, navigateMoments, currentMomentIndex, dayMoments }) => {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {selectedMoment.video && (
          <video
            key={selectedMoment.video}
            controls
            style={{ width: '100%', marginBottom: 10 }}
            src={selectedMoment.video}
          />
        )}
        <div style={{ flex: 1 }}>
          <p>{selectedMoment.description}</p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10,
            fontSize: 13,
            opacity: 0.6
          }}>
            <span>{new Date(selectedMoment.created_at).toLocaleString()}</span>
            <span>Duration: {selectedMoment.hours} hours</span>
          </div>
          <div style={{
            marginTop: 10,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center'
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
              disabled={currentMomentIndex === dayMoments.length - 1}
              style={{ opacity: currentMomentIndex === dayMoments.length - 1 ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this component for displaying the day's moments
  const DayMomentsPopup = ({ dayNumber, moments, onClose, onMomentClick }) => {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: 300,
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h3 style={{ margin: 0 }}>Day {dayNumber} OMG Moments</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center'
        }}>
          {moments.map((moment) => {
            let backgroundColor;
            let strokeColor;

            // First determine review status colors
            if (moment.stretchReview === "Accepted") {
              backgroundColor = moment.type === 'jungle' ? "#4CAF50" : "#2196F3"; // Green for jungle, Blue for juice
              strokeColor = moment.type === 'jungle' ? "#90EE90" : "#90CAF9";
            } else if (moment.stretchReview === "Rejected") {
              backgroundColor = "red";
              strokeColor = "#FFB6B6";
            } else {
              backgroundColor = "orange";
              strokeColor = "#FFD580";
            }

            return (
              <div
                key={moment.id}
                onClick={() => onMomentClick(moment)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: backgroundColor,
                  borderRadius: "4px",
                  width: "40px",
                  height: "40px",
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
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                <span style={{
                  fontSize: '10px',
                  color: 'white',
                  textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                  fontWeight: 'bold'
                }}>
                  {moment.hours}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Update the commit graph rendering to include the popups
  {/* Commit graph visualization */}


  {/* Add the popups */}
  {selectedDay && (
    <DayMomentsPopup
      dayNumber={selectedDay}
      moments={dayMoments}
      onClose={() => {
        setSelectedDay(null);
        setDayMoments([]);
      }}
      onMomentClick={handleMomentClick}
    />
  )}

  {selectedMoment && (
    <MomentPopup
      selectedMoment={selectedMoment}
      closePopup={closePopup}
      navigateMoments={navigateMoments}
      currentMomentIndex={currentMomentIndex}
      dayMoments={dayMoments}
    />
  )}

  // Add this state near the other state declarations
  const [isRabbitMessageVisible, setIsRabbitMessageVisible] = useState(false);

  // Add this state near other state declarations
  const [isRabbitShaking, setIsRabbitShaking] = useState(false);

  // Add this state near other state declarations
  const [isZoomedToRabbit, setIsZoomedToRabbit] = useState(false);

  // Update the handleRabbitClick function
  const handleRabbitClick = (e) => {
    e.stopPropagation();
    setIsRabbitMessageVisible(true);
    setIsRabbitShaking(true);
    setIsZoomedToRabbit(true);

    // Stop shaking after 6 seconds
    setTimeout(() => {
      setIsRabbitShaking(false);
    }, 6000);
  };

  // Add this handler function to hide the message when clicking outside
  const handleBackgroundClick = () => {
    setIsRabbitMessageVisible(false);
    setSelectedFile(null); // Keep existing functionality
  };

  // Update the handleGlobalClick function
  const handleGlobalClick = (e) => {
    const isRabbitClick = e.target.closest('[data-rabbit-component="true"]');

    if (!isRabbitClick) {
      setIsRabbitMessageVisible(false);
      setIsZoomedToRabbit(false);
    }
  };

  // Function to handle zooming out when user claims their fortune
  const handleClaimLuck = () => {
    // Hide the rabbit message
    setIsRabbitMessageVisible(false);
    // Reset the zoom state
    setIsZoomedToRabbit(false);
  };

  const handleItineraryOpen = () => {
    if (!openWindows.includes('itineraryWindow')) {
      setOpenWindows([...openWindows, 'itineraryWindow']);
      setWindowOrder([...windowOrder.filter(w => w !== 'itineraryWindow'), 'itineraryWindow']);
      setActiveWindow('itineraryWindow');
    } else {
      setWindowOrder([...windowOrder.filter(w => w !== 'itineraryWindow'), 'itineraryWindow']);
      setActiveWindow('itineraryWindow');
    }
  };

  return (
    <div
      onClick={handleGlobalClick}
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
      {/* Add a new wrapper div for the zoom effect */}
      <div style={{
        transform: isZoomedToRabbit ? 'scale(5.0) translateY(-6px)' : 'scale(1) translateY(0)',
        transition: isZoomedToRabbit
          ? 'all 8.9s cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy transition when zooming in
          : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', // Smooth transition when zooming out
        transformOrigin: 'top center',
        width: '100%',
        height: '100%',
        overflow: 'hidden' // Add this to prevent content from showing outside bounds
      }}>
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
          @keyframes eggShake {
            0% {
              transform: rotate(0deg) scale(1.2);
            }
            2% {
              transform: rotate(-2deg) scale(1.35);
            }
            4% {
              transform: rotate(2deg) scale(1.3);
            }
            6% {
              transform: rotate(-2.5deg) scale(1.35);
            }
            8% {
              transform: rotate(2.5deg) scale(1.3);
            }
            10% {
              transform: rotate(-2deg) scale(1.35);
            }
            12% {
              transform: rotate(2deg) scale(1.3);
            }
            14% {
              transform: rotate(-2.5deg) scale(1.35);
            }
            16% {
              transform: rotate(2.5deg) scale(1.3);
            }
            18% {
              transform: rotate(-2deg) scale(1.35);
            }
            20% {
              transform: rotate(0deg) scale(1.3);
            }
            90% {
              transform: rotate(0deg) scale(1.3);
            }
            100% {
              transform: rotate(0deg) scale(1);
            }
          }
          @keyframes shimmer {
            0% {
              background-position: 200% center;
            }
            100% {
              background-position: -200% center;
            }
          }
          @keyframes pressProgress {
            0% {
              transform: scaleX(0);
            }
            100% {
              transform: scaleX(1);
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
            zIndex: 9999,
            animation: isShaking
              ? 'saturate 0.6s cubic-bezier(.36,.07,.19,.97) both'
              : 'none',
            mixBlendMode: 'saturation',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* top bar */}
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
              onClick={handleJuiceClick}
              style={{
                cursor: 'pointer',
                width: 225,
                color: 'rgba(0, 0, 0, 0.8)',
                fontWeight: 500,
              }}
            >
              Juice {activeJuicersCount > 0 && (`(${activeJuicersCount} online juicers)`)}
            </p>

            <div style={{position: 'relative'}} data-rabbit-component="true">
              <RabbitMessage
                isVisible={isRabbitMessageVisible}
                onClaimLuck={handleClaimLuck}
              />
              <img
                style={{
                  height: 24,
                  marginTop: 0,
                  cursor: 'pointer',
                  animation: isRabbitShaking ? 'rabbitIconShake 0.5s ease-in-out infinite' : 'none'
                }}
                src="./rabbit.png"
                onClick={handleRabbitClick}
                data-rabbit-component="true"
              />
            </div>
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
                <img
                  style={{ width: 14, height: 14 }}
                  src={'/jungle/token.png'}
                />
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
              <p
                style={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontWeight: 500,
                }}
              >
                {formattedTime}
              </p>
            </div>
          </div>
          <div
            style={{
              zIndex: 3,
              position: 'absolute',
              bottom: 0,
              paddingBottom: 32,
              paddingTop: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 8,
              width: '100vw',
              cursor: 'pointer',
            }}
          >
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {userData?.Tamagotchi?.length > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '-246px',
                    padding: 8,
                    overflow: "hidden",
                    width: 196,
                    border: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: isHovered ? 'space-between' : 'center',
                    height: 232,
                    backgroundColor: '#fff',
                    borderRadius: isHovered ? '8px' : '1000px',
                    transform: `
                  scale(${!isHovered ? 0 : isExpanded ? shakeValues.scale : 1})
                  rotate(${shakeValues.rotate}deg)
                `,
                    transition: `
                  transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  border-radius 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                    isHovered ? '0.2s' : '0s'
                  },
                  justify-content 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                    isHovered ? '0.5s' : '0s'
                  }
                `,
                    transformOrigin: 'bottom center',
                  }}
                  onMouseDown={handleTamagotchiMouseDown}
                  onMouseUp={handleTamagotchiMouseUp}
                  onMouseLeave={handleTamagotchiMouseUp}
                >
                  {/* Add this progress indicator */}
                  {showPressIndicator && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: 4,
                        backgroundColor: '#ff0000',
                        transformOrigin: 'left',
                        transform: `scaleX(${
                          pressStartTime ? (Date.now() - pressStartTime) / 10000 : 0
                        })`,
                        transition: 'transform 0.1s linear',
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontSize: 12,
                      height: isHovered ? 12 : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 0 : 0,
                      transition: `
                    opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    margin-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    }
                  `,
                    }}
                  >
                    {`10 days of tamagotchi - day ${getTamagotchiDay(
                      userData?.Tamagotchi?.[0]?.startDate
                    )}`
                      .split('')
                      .map((char, i) => {
                        const text = `10 days of tamagotchi - day ${getTamagotchiDay(
                          userData?.Tamagotchi?.[0]?.startDate
                        )}`;
                        const position = Math.floor(
                          (Date.now() / 30) % text.length
                        );
                        return (
                          <span
                            key={i}
                            style={{
                              color:
                                isHovered && i === position
                                  ? '#FF0000'
                                  : '#000000',
                              display: 'inline-block',
                              height: isHovered ? 12 : 0,
                              opacity: isHovered ? 1 : 0,
                              whiteSpace: 'pre',
                              fontSize: 14,
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                  </p>
                  <div
                    onClick={handleSquareClick}
                    style={{
                      height: 96,
                      marginTop: isHovered ? 8 : 14,
                      marginBottom: isHovered ? 0 : 0,
                      borderRadius: 8,
                      width: 96,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `
                      margin 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                        isHovered ? '0.5s' : '0s'
                      },
                      transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
                    `,
                    }}
                  >
                    {isTamagotchiDead(userData) ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <p style={{ fontSize: 12, textAlign: 'center' }}>
                          I don't see your tamagotchi. pls refresh :)
                        </p>
                      </div>
                    ) : (
                      <img
                        src={
                          isTamagotchiDead(userData)
                            ? '🪦'
                            : `./${
                                userData?.email
                                  ? getTamagotchiType(userData.email)
                                  : 'kiwibird.gif'
                              }`
                        }
                        alt="Tamagotchi Pet"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 0 : 0,
                      transition: `
                    opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    margin-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    }
                  `,
                    }}
                  >
                    {getMessage(userData)}
                  </p>

                  {/* Commit graph visualization */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: 2,
                    width: '216px',
                    padding: '0 16px',
                    opacity: isHovered ? 1 : 0,
                    height: isHovered ? '16px' : 0,
                    transition: `
                      opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${isHovered ? '0.5s' : '0s'},
                      height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${isHovered ? '0.5s' : '0s'}
                    `
                  }}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const dayNumber = i + 1;
                      const currentDay = getTamagotchiDay(userData?.Tamagotchi?.[0]?.startDate);
                      const hasActivity = dayNumber <= currentDay;
                      const hasOmgMoments = dayHasOmgMoments(dayNumber);
                      const isToday = dayNumber === currentDay;
                      const dayHours = hasOmgMoments ? getDayHours(dayNumber) : "0.0";

                      return (
                        <div
                          key={i}
                          style={{
                            width: '16px',
                            height: "16px",
                            aspectRatio: '1',
                            backgroundColor: hasOmgMoments ? '#4CAF50' : (hasActivity ? '#E0E0E0' : '#F5F5F5'),
                            borderRadius: 2,
                            border: isToday ? '2px solid #1E88E5' : '1px solid rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease, filter 0.2s ease',
                            cursor: hasOmgMoments ? 'pointer' : 'default',
                            position: 'relative',
                          }}
                          onClick={() => {
                            if (hasOmgMoments) {
                              setSelectedDay(dayNumber);
                              setDayMoments(getDayMoments(dayNumber));
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.2)';
                            e.currentTarget.style.filter = 'brightness(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.filter = 'brightness(1)';
                          }}
                        >
                          {hasOmgMoments && (
                            <span style={{
                              fontSize: '8px',
                              color: 'white',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                              fontWeight: 'bold'
                            }}>
                              {dayHours}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      height: isHovered ? 24 : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 4 : 0,
                      transition: `
                    opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    margin-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    }
                  `,
                    }}
                  >
                    Today's progress: {getTodayProgress()}
                  </p>

                  {/* <p
                    style={{
                      fontSize: 12,
                      height: isHovered ? 24 : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 4 : 0,
                      transition: `
                    opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    margin-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    }
                  `,
                    }}
                  >
                    Current streak: {getTamagotchiStreak()} days
                  </p> */}
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: '-150px',
                    padding: 8,
                    width: 142,
                    border: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: isHovered ? 'space-between' : 'center',
                    height: 142,
                    backgroundColor: '#fff',
                    borderRadius: isHovered ? '8px' : '1000px',
                    transform: `
                  scale(${!isHovered ? 0 : isExpanded ? shakeValues.scale : 1})
                  rotate(${shakeValues.rotate}deg)
                `,
                    transition: `
                  transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  border-radius 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                    isHovered ? '0.2s' : '0s'
                  },
                  justify-content 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                    isHovered ? '0.5s' : '0s'
                  }
                `,
                    transformOrigin: 'bottom center',
                  }}
                >
                  <div
                    onClick={handleSquareClick}
                    style={{
                      height: 96,
                      marginTop: isHovered ? 8 : 14,
                      marginBottom: isHovered ? 0 : 0,
                      borderRadius: 8,
                      width: 96,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `
                      margin 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                        isHovered ? '0.5s' : '0s'
                      },
                      transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
                    `,
                    }}
                  >
                    {isTamagotchiDead(userData) ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <p style={{ fontSize: 12, textAlign: 'center' }}>
                          Refresh Please
                        </p>
                      </div>
                    ) : (
                      <img
                        src={`/${
                          userData?.email
                            ? getEggColor(userData.email)
                            : 'blueegg.gif'
                        }`}
                        alt="Colored Egg"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      height: isHovered ? 12 : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 0 : 0,
                      transition: `
                    opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    },
                    margin-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                      isHovered ? '0.5s' : '0s'
                    }
                  `,
                    }}
                  >
                    Tap to Hatch
                  </p>
                </div>
              )}
              <div
                style={{
                  width: isHovered ? 520 : 300,
                  height: 16,
                  borderRadius: 16,
                  backgroundColor: 'transparent',
                  border: '1px solid #000',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Colorful filled portion */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${getProgressPercentage(userData)}%`,
                    background: `
                      linear-gradient(
                        90deg,
                        #FF61D8 0%,
                        #FFA84B 15%,
                        #FFE81A 30%,
                        #76FF7A 45%,
                        #32F2F2 60%,
                        #A97FFF 75%,
                        #FF61D8 90%
                      )
                    `,
                    backgroundSize: '200% auto',
                    transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    animation: 'shimmer 3s linear infinite',
                    opacity: 0.9,
                  }}
                />
                {/* Original style background */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    background: `
                      linear-gradient(
                        90deg,
                        rgba(255,255,255,1) 0%,
                        rgba(255,220,250,0.4) 25%,
                        rgba(220,250,255,0.4) 35%,
                        rgba(255,255,255,1) 50%,
                        rgba(220,255,250,0.4) 65%,
                        rgba(250,220,255,0.4) 75%,
                        rgba(255,255,255,1) 100%
                      )
                    `,
                    backgroundSize: '200% auto',
                    animation: 'shimmer 3s linear infinite',
                  }}
                />
                {/* Percentage text */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold',
                    mixBlendMode: 'difference',
                    color: '#fff',
                  }}
                >
                  {userData?.Tamagotchi?.length
                    ? `${getProgressPercentage(userData).toFixed(1)}%`
                    : ''}
                </div>
              </div>
            </div>
          </div>
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
              isLoggedIn={isLoggedIn}
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

          {openWindows.includes('secondChallenge') && (
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

          {openWindows.includes('menuWindow') && (
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

          {openWindows.includes('postcard') && (
            <PostcardWindow
              position={postcardPosition}
              isDragging={isDragging && activeWindow === 'postcard'}
              isActive={windowOrder[windowOrder.length - 1] === 'postcard'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('postcard')}
              ACTIVE_Z_INDEX={getWindowZIndex('postcard')}
              userData={userData}
            />
          )}

          {openWindows.includes('wutIsRelay') && (
            <WutIsRelayWindow
              position={wutIsRelayPosition}
              isDragging={isDragging && activeWindow === 'wutIsRelay'}
              isActive={windowOrder[windowOrder.length - 1] === 'wutIsRelay'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('wutIsRelay')}
              ACTIVE_Z_INDEX={getWindowZIndex('wutIsRelay')}
            />
          )}

          {openWindows.includes('wutIsPenguathon') && (
            <WutIsPenguathonWindow
              position={wutIsPenguathonWindowPosition}
              isDragging={isDragging && activeWindow === 'wutIsPenguathon'}
              isActive={windowOrder[windowOrder.length - 1] === 'wutIsPenguathon'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('wutIsPenguathon')}
              ACTIVE_Z_INDEX={getWindowZIndex('wutIsPenguathon')}
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

          {openWindows.includes('cardCreator') && (
            <CardCreatorWindow
              position={cardCreatorPosition}
              isDragging={isDragging && activeWindow === 'cardCreator'}
              isActive={windowOrder[windowOrder.length - 1] === 'cardCreator'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('cardCreator')}
              ACTIVE_Z_INDEX={getWindowZIndex('cardCreator')}
              userData={userData}
            />
          )}

          {openWindows.includes('wutIsBubbleathon') && (
            <WutIsBubbleathonWindow
              position={wutIsBubbleathonWindowPosition}
              isDragging={isDragging && activeWindow === 'wutIsBubbleathon'}
              isActive={windowOrder[windowOrder.length - 1] === 'wutIsBubbleathon'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('wutIsBubbleathon')}
              ACTIVE_Z_INDEX={getWindowZIndex('wutIsBubbleathon')}
            />
          )}

          {openWindows.includes('itineraryWindow') && (
            <ItineraryWindow
              position={itineraryPosition}
              isDragging={isDragging && activeWindow === 'itineraryWindow'}
              isActive={windowOrder[windowOrder.length - 1] === 'itineraryWindow'}
              handleMouseDown={handleMouseDown}
              handleDismiss={handleDismiss}
              handleWindowClick={handleWindowClick}
              BASE_Z_INDEX={getWindowZIndex('itineraryWindow')}
              ACTIVE_Z_INDEX={getWindowZIndex('itineraryWindow')}
            />
          )}

          <div
            style={{
              position: 'absolute',
              top: TOP_BAR_HEIGHT,
              left: 0,
              // backgroundImage: 'url(background.GIF)',
              backgroundSize: 'cover',
              imageRendering: 'pixelated',
              width: '100vw',
              overflow: 'hidden',
              // height: "100vh"
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexDirection: 'row',
                padding: 8,
              }}
            >
              <div>
                {isLoggedIn && (
                  <FileIcon
                    text="Jungle"
                    icon="./jungle/jungleicon.png"
                    isSelected={selectedFile === 'Jungle'}
                    onClick={handleFileClick('Jungle')}
                    delay={0.5}
                    data-file-id="Jungle"
                  />
                )}
                {isJungle || (
                  <FileIcon
                    text="Achievements"
                    icon="achievmentsicon.png"
                    isSelected={selectedFile === 'Achievements'}
                    onClick={handleFileClick('Achievements')}
                    delay={0.1}
                    data-file-id="Achievements"
                  />
                )}
                <FileIcon
                  text="Fortune Basket"
                  icon="./fortunecookieicon.png"
                  isSelected={selectedFile === 'Fortune Basket'}
                  onClick={handleFileClick('Fortune Basket')}
                  delay={0.4}
                  data-file-id="Fortune Basket"
                />
                {isLoggedIn && (
                  <FileIcon
                    text="Fruit Basket"
                    icon="./jungle/fullbasket.png"
                    isSelected={selectedFile === 'FruitBasket'}
                    onClick={handleFileClick('FruitBasket')}
                    delay={0.5}
                    data-file-id="FruitBasket"
                  />
                )}
                <FileIcon
                  text="Cosmin's Jungle Shop"
                  icon="./jungle/goldToken.png"
                  isSelected={selectedFile === 'JungleShop'}
                  onClick={handleFileClick('JungleShop')}
                  delay={0.5}
                  data-file-id="JungleShop"
                />
              </div>
              <div>
                <FileIcon
                  text={isLoggedIn ? 'Juicer' : 'Register'}
                  icon={isLoggedIn ? './juicerRest.png' : 'registericon.png'}
                  isSelected={
                    selectedFile === (isLoggedIn ? 'Juicer' : 'Register')
                  }
                  onClick={handleFileClick(isLoggedIn ? 'Juicer' : 'Register')}
                  delay={0.2}
                  data-file-id={isLoggedIn ? 'Juicer' : 'Register'}
                />
                <FileIcon
                  text="video.mp4"
                  icon="./thumbnail.png"
                  isSelected={selectedFile === 'video.mp4'}
                  onClick={handleFileClick('video.mp4')}
                  delay={0.3}
                  data-file-id="video.mp4"
                />
                {isLoggedIn && (
                  <FileIcon
                    text="Kudos"
                    icon="./kudos.png"
                    style={{ backgroundColor: '#000', color: '#fff' }}
                    isSelected={selectedFile === 'Kudos'}
                    onClick={handleFileClick('Kudos')}
                    delay={0.5}
                    data-file-id="Kudos"
                  />
                )}
                {isLoggedIn && (
                  <FileIcon
                    text="Gallery"
                    icon="./gallery.png"
                    style={{ backgroundColor: '#000', color: '#fff' }}
                    isSelected={selectedFile === 'Gallery'}
                    onClick={handleFileClick('Gallery')}
                    delay={0.5}
                    data-file-id="Gallery"
                  />
                )}

                {isLoggedIn && !isJungle && (
                  <FileIcon
                    text="Moments"
                    icon="./fortunecookieright.png"
                    isSelected={selectedFile === 'Menu'}
                    onClick={handleFileClick('Menu')}
                    delay={0.5}
                    data-file-id="Menu"
                  />
                )}
              </div>
              <div>
                <FileIcon
                  text="wutIsJuice.txt"
                  icon="./texticon.png"
                  isSelected={selectedFile === 'file1'}
                  onClick={handleFileClick('file1')}
                  delay={0}
                  data-file-id="file1"
                />
                <FileIcon
                  text="wutIsJungle.txt"
                  icon="./texticon.png"
                  isSelected={selectedFile === 'wutIsJungle'}
                  onClick={handleFileClick('wutIsJungle')}
                  delay={0}
                  data-file-id="wutIsJungle"
                />

                <FileIcon
                  text="wutTheEgg.txt"
                  icon="./texticon.png"
                  isSelected={selectedFile === 'tamagotchiNotes'}
                  onClick={handleFileClick('tamagotchiNotes')}
                  delay={0}
                  data-file-id="tamagotchiNotes"
                />
                                {isLoggedIn && !isJungle && (

                <FileIcon
                  text="itinerary.csv"
                  icon="./greenIcon.png"
                  isSelected={selectedFile === 'itinerary'}
                  onClick={handleFileClick('itinerary')}
                  delay={0}
                  data-file-id="itinerary"
                />
                                )}
              </div>
              <div>
                <FileIcon
                  text="Juice Zero"
                  icon="./juiceZero.png"
                  isSelected={selectedFile === 'Juice Zero'}
                  onClick={handleFileClick('Juice Zero')}
                  delay={0.4}
                  data-file-id="Juice Zero"
                />
              </div>
            </div>
          </div>

          <div
            style={{ position: 'absolute',
              zIndex: 101,
              top: TOP_BAR_HEIGHT + 8, right: 8 }}
          >
            {isLoggedIn &&
              !userData?.achievements?.includes('pr_submitted') &&
              !isJungle && (
                <div
                  className="panel-pop"
                  style={{
                    width: 332,
                    marginTop: 8,
                    backgroundColor: 'rgba(255, 220, 180, 0.8)',
                    backdropFilter:
                      'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    WebkitBackdropFilter:
                      'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                    border: '1px solid rgba(255, 220, 180, 0.4)',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)',
                  }}
                >
                  <p style={{ color: 'rgba(0, 0, 0, 0.8)', margin: '0 0 8px 0' }}>
                    First Challenge Reveals Itself...
                  </p>
                  <button
                    onClick={handleFirstChallengeOpen}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#FF4002',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Uncover Challenge
                  </button>
                </div>
              )}

            {isLoggedIn &&
              userData?.achievements?.includes('poc_submitted') &&
              !isJungle && (
                <V1Challenge
                  userData={userData}
                  handleThirdChallengeOpen={console.log("ok")}
                />
              )}

            {isLoggedIn &&
              userData?.achievements?.includes('pr_submitted') &&
              !userData?.achievements?.includes('poc_submitted') &&
              !isJungle && (
                <div
                  className="panel-pop rainbow-glass-panel"
                  style={{
                    width: 332,
                    marginTop: 8,
                    borderRadius: 8,
                    padding: 12,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 1.0)',
                        margin: '0 0 8px 0',
                        textShadow: `
                                  -1px -1px 0 #000,
                                  1px -1px 0 #000,
                                  -1px 1px 0 #000,
                                  1px 1px 0 #000`,
                      }}
                    >
                      Second Challenge Reveals Itself...
                    </p>
                    <button
                      onClick={handleSecondChallengeOpen}
                      disabled={userData.achievements.includes('poc_submitted')}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#FFE600',
                        color: '#000',
                        opacity: userData.achievements.includes('poc_submitted')
                          ? 0.7
                          : 1.0,
                        border: '2px solid #000',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        animation: !userData.achievements.includes(
                          'poc_submitted'
                        )
                          ? 'buttonBounce 2s ease-in-out infinite'
                          : '',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      {userData.achievements.includes('poc_submitted')
                        ? 'Itch Submitted'
                        : 'Uncover Challenge'}
                    </button>
                  </div>
                  <div
                    className="floating-boat boat1"
                    style={{ left: '0', top: '50%' }}
                  >
                    ⛵️
                  </div>
                  <div
                    className="floating-boat boat2"
                    style={{ right: '0', top: '30%' }}
                  >
                    ⛵️
                  </div>
                  <div
                    className="floating-boat boat1"
                    style={{ left: '30%', top: '70%', animationDelay: '4s' }}
                  >
                    ⛵️
                  </div>
                </div>
              )}
            {getBubbleathonState() && (
              <div
                onClick={handleBubbleathonClick}
                className="panel-pop rainbow-glass-panel"
                style={{
                  width: 332,
                  marginTop: 8,
                  borderRadius: 8,
                  padding: 12,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor:
                    getBubbleathonState() === 'sprinting'
                      ? 'rgba(0, 255, 0, 0.1)'
                      : getBubbleathonState() === 'refueling'
                      ? 'rgba(0, 0, 255, 0.1)'
                      : 'transparent',
                }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 1.0)',
                        margin: 0,
                        textShadow: `
                          -1px -1px 0 #000,
                          1px -1px 0 #000,
                          -1px 1px 0 #000,
                          1px 1px 0 #000`,
                      }}
                    >
                      Bubbleathon
                    </p>
                    {getBubbleathonState() && (
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9em',
                          textShadow: `
                              -1px -1px 0 #000,
                              1px -1px 0 #000,
                              -1px 1px 0 #000,
                              1px 1px 0 #000`,
                        }}
                      >
                        • Currently {getBubbleathonState()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        if (!openWindows.includes('wutIsBubbleathon')) {
                          setOpenWindows((prev) => [...prev, 'wutIsBubbleathon']);
                          const audio =
                            document.getElementById('windowOpenAudio');
                          if (audio) {
                            audio.currentTime = 0;
                            audio.play();
                          }
                        }
                      }}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#F1CADB',
                        color: '#000',
                        border: '2px solid #000',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      What's Bubbleathon?
                    </button>
                    {isBubbleathonTime() && (
                      <button
                        onClick={() =>
                          window.open(
                            'https://hackclub.zoom.us/j/84884658967?pwd=zjWiAwyK03JXwxo7Tq9yAhgJKqlA3w.1',
                            '_blank'
                          )
                        }
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#F1CADB',
                          color: '#000',
                          border: '2px solid #000',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        Join Zoom Call
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="floating-boat boat1"
                  style={{ left: '0', top: '50%' }}
                >
                  🏃‍♂️
                </div>
                <div
                  className="floating-boat boat2"
                  style={{ right: '0', top: '30%' }}
                >
                  🏃‍♂️
                </div>
                <div
                  className="floating-boat boat1"
                  style={{ left: '30%', top: '70%', animationDelay: '4s' }}
                >
                  🏃‍♂️
                </div>
                <div
                  className="floating-boat boat2"
                  style={{ left: '30%', top: '70%', animationDelay: '4s' }}
                >
                  🏃‍♂️
                </div>
              </div>
            )}

            {isLoggedIn && tickets.some((t) => !t.used) && (
              <div
                className="panel-pop"
                style={{
                  width: 332,
                  marginTop: 8,
                  backgroundColor: 'rgba(255, 220, 180, 0.8)',
                  backdropFilter:
                    'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                  WebkitBackdropFilter:
                    'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                  border: '1px solid rgba(255, 220, 180, 0.4)',
                  borderRadius: 8,
                  padding: 12,
                  boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)',
                }}
              >
                <p style={{ color: 'rgba(0, 0, 0, 0.8)', margin: '0 0 8px 0' }}>
                  You found {tickets.filter((t) => !t.used).length} special ticket
                  {tickets.filter((t) => !t.used).length !== 1 ? 's' : ''}...
                </p>
                <button
                  onClick={handleFactionOpen}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    border: 'none',
                    backgroundColor: '#FF6000',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Grab Your Tickets
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: 8,
              flexDirection: 'column',
              alignItems: 'end',
              bottom: 0,
              right: 16,
              height: "100%",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                height: 240,
                transform: "rotate(270deg) scale(0.6) translateY(420px)",
                position: 'relative',
              }}
              onMouseEnter={() => setIsCardsFanned(true)}
              onMouseLeave={() => setIsCardsFanned(false)}
            >
              {/* Action Button - only visible when fanned out */}
              <div
                onClick={handleQuestionClick}
                style={{
                  position: 'absolute',
                  width: isCardsFanned ? 80 : 0,
                  opacity: isCardsFanned ? 1.0 : 0,
                  height: isCardsFanned ? 80 : 0,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  left: '50%',
                  top: "32px",
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  transition: 'all 0.3s ease-in',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  pointerEvents: 'auto' // Re-enable pointer events for the button
                }}
              >
                +
              </div>

              <div style={{
                transform: isCardsFanned
                  ? "rotate(-70deg) scale(1.0) translate(120px, -60px)"
                  : "rotate(-15deg) scale(0.8) translateX(65px) translateY(60px)",
                transition: "all 0.3s ease-out",
                pointerEvents: 'auto' // Re-enable pointer events for the card
              }}>
                <VillagerPokemonCard/>
              </div>

              <div style={{
                zIndex: 1,
                transform: isCardsFanned
                  ? "translateY(-280px) scale(1.0)"
                  : "translateY(10px) scale(0.9)",
                transition: "all 0.3s ease-out",
                pointerEvents: 'auto' // Re-enable pointer events for the card
              }}>
                <Win7PokemonCard />
              </div>

              <div style={{
                transform: isCardsFanned
                  ? "rotate(70deg) scale(1.0) translate(-120px, -60px)"
                  : "rotate(15deg) scale(0.8) translateX(-65px) translateY(60px)",
                transition: "all 0.3s ease-out",
                pointerEvents: 'auto' // Re-enable pointer events for the card
              }}>
                <BrucePokemonCard />
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: 8,
              flexDirection: 'column',
              alignItems: 'end',
              bottom: 0,
              right: 16,
            }}
          >

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* <div style={{width: 256, backgroundColor: "#fff", borderRadius: 4, padding: 4}}>
              <p>a Hack Clubber published a game on Itch.io 5min ago</p>
              </div>  */}
              {/* <div style={{width: 256, transform: "scale(0.9)", opacity: 0.9, backgroundColor: "#fff", borderRadius: 4, padding: 4}}>
              <p>a Hack Clubber published a game on Itch.io 5min ago</p>
              </div>
              <div style={{width: 256, transform: "scale(0.8)", opacity: 0.8, backgroundColor: "#fff", borderRadius: 4, padding: 4}}>
              <p>a Hack Clubber published a game on Itch.io 5min ago</p>
              </div>    */}
            </div>
            {userData?.Postcards?.length > 0 && (
              <img
                style={{
                  width: 96,
                  animation: 'jiggleEnvelope 1.2s linear infinite',
                  transformOrigin: '50% 50%',
                  transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.1))',
                }}
                onMouseEnter={(e) => {
                  e.target.style.width = '128px';
                  e.target.style.animation =
                    'jiggleEnvelopeIntense 0.8s linear infinite, rainbowShadow 8s linear infinite';
                }}
                onMouseLeave={(e) => {
                  e.target.style.width = '96px';
                  e.target.style.animation =
                    'jiggleEnvelope 1.2s linear infinite';
                }}
                onClick={() => {
                  if (!openWindows.includes('postcard')) {
                    setOpenWindows((prev) => [...prev, 'postcard']);
                    setWindowOrder((prev) => [
                      ...prev.filter((w) => w !== 'postcard'),
                      'postcard',
                    ]);
                    document.getElementById('mailAudio').play();
                  } else {
                    setWindowOrder((prev) => [
                      ...prev.filter((w) => w !== 'postcard'),
                      'postcard',
                    ]);
                  }
                }}
                src="./envelope.png"
              />
            )}
          </div>

          {/* background goes here */}
          <div
            onClick={handleBackgroundClick}
            style={{
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              display: 'flex',
              margin: 0,
              cursor: 'default',
            }}
          >
            <Background />
          </div>

          <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
            <FileIcon
              text="Thanks"
              icon="./heart.png"
              isSelected={selectedFile === 'Thanks'}
              onClick={handleFileClick('Thanks')}
              delay={0.6}
              data-file-id="Thanks"
            />
          </div>

          {/* Add audio elements */}
          <audio id="juicerAudio" src="./juicer.mp3" preload="auto"></audio>
          <audio id="collectAudio" src="./collect.mp3" preload="auto"></audio>
          <audio id="windowOpenAudio" src="./sounds/windowOpenSound.wav" />
          <audio id="mailAudio" src="/youGotMail.mp3" />
        </div>
      </div>
    </div>
  );
}
