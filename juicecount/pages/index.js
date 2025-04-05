import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static list of fruits
const fruits = [
  "🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍓 Strawberry", "🍊 Orange", 
  "🥭 Mango", "🍑 Peach", "🍍 Pineapple", "🥝 Kiwi", "🍒 Cherry",
  "🥥 Coconut", "🫐 Blueberry", "🍋 Lemon", "🍉 Watermelon", "🍏 Green Apple",
  "🥑 Avocado", "🍐 Pear", "🍈 Melon", "🍅 Tomato", "🫒 Olive"
];

// Simple component that doesn't rely on fetching data
const GameNameBackground = () => {
  // List of game names from Juice
  const gameNames = [
    "PlatformLands",
    "JunkPunk Rats",
    "JunkPunkRats",
    "Dust and Dawn",
    "Claw of Duty",
    "Echos",
    "Speed Tickers",
    "Vasilio",
    "Produced Demand",
    "Cooking Craze",
    "Exits",
    "A Theory of Evolution",
    "skullcrusher",
    "Soultrain",
    "Space Hitchhiker Stop",
    "Awakened",
    "Cavern's edge",
    "Depthscend",
    "SYMBOL",
    "Dajka Zea",
    "Quicksilver",
    "Flourish",
    "Deep-Roots",
    "Maya",
    "Undead Courier",
    "RiftStrike",
    "Fragments of Flavor",
    "Pixel Leap",
    "EchoEcho",
    "Survival's Edge",
    "SLIFT",
    "Rekindled Dawn",
    "Orienteering VR",
    "Asgard's Draw",
    "bake industry",
    "Spadooshka",
    "Lumensnuff",
    "Outlaw Heists",
    "Luminaze",
    "SpringTime Life",
    "MEMOI",
    "Untifted",
    "Monkey Mayhem",
    "Shoot Out",
    "Ossatura",
    "The Juicer",
    "astrojump!",
    "Shake It!",
    "Hole in One - Japanese Mini-Golf",
    "Devil's Kitchen",
    "Talos",
    "Club Robot",
    "Prism Maze",
    "Selenia",
    "DEADBEAT",
    "Salle d'evasion",
    "RacingTown",
    "Flower Escape",
    "Echoes Of The Past",
    "Mama's Jiaoziria",
    "Minebound",
    "Speedtickers",
    "Trench Of Shadows",
    "Onyx",
    "Signal Lost",
    "Modern Day Pirates",
    "Cocytus",
    "Obscura",
    "Line by Line",
    "Do you like trains?",
    "DungeonForge",
    "Dungeon Forge",
    "Chronos Descent",
    "Realm of Rhythm",
    "SpaceGoose",
    "Memory Maze",
    "Not an Idle"
  ];

  return (
    <div className={styles.commitBackground}>
      {/* {gameNames.map((gameName, index) => {
        // Randomly assign a fruit to each game
        const fruit = fruits[Math.floor(Math.random() * fruits.length)];
        
        // Position each game at a different height and with different delays
        const topPosition = (index * 2.5) % 85 + 5; // Spread vertically (5% to 90% of viewport)
        const delay = index * 1.5; // Stagger the animations
        const duration = 25 + Math.random() * 15; // Random duration between 25-40s
        
        return (
          <div 
            key={index} 
            className={styles.commitMessage}
            style={{
              top: `${topPosition}vh`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`
            }}
          >
            <div className={styles.commitContent}>
              <div className={styles.commitFruit}>{fruit}</div>
              <div className={styles.gameNameText}>{gameName}</div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Handle spacebar press to start/pause
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        setIsRunning(prevState => !prevState);
        setShowHint(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>Juice Countdown</title>
        <meta name="description" content="Countdown timer for Hack Club Juice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="./background.gif" />
        <meta property="og:image:alt" content="Juice Game Jam" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="./background.gif" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.background}></div>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <GameNameBackground />
        <main className={styles.main}>
          <div className={styles.timerContainer}>
            <div className={styles.timer}>{formatTime(timeLeft)}</div>
            {showHint && <div className={styles.spacebarHint}>Press Space to Start</div>}
          </div>
        </main>
      </div>
    </>
  );
}
