import Head from 'next/head';
import { useState } from 'react';

export default function Exhibit() {
  const [exhibitStage, setExhibitStage] = useState(0); // 0 = explore, 1 = rsvp, 2 = ticket, 3 = friends
  const [hasRSVPed, setHasRSVPed] = useState(false); // Track if user has RSVPed
  const [language, setLanguage] = useState('en'); // 'en' for English, 'zh' for Mandarin
  
  // Translations
  const translations = {
    en: {
      title: "Juice Popup Cafe Exhibit",
      description: "Popup cafe of 30 games that teenagers from around the world made. Free exhibit with free juice",
      navExplore: "explore",
      navRsvp: "rsvp",
      navTicket: "ticket",
      navFriends: "friends",
      exploreTitle: "Popup Indie Game Cafe in Shanghai",
      rsvpTitle: "RSVP for the Event",
      rsvpButton: "Complete RSVP",
      rsvpSuccess: "You have successfully RSVPed!",
      ticketTitle: "Your Tickets",
      friendsTitle: "Friends",
      rsvpAlert: "Please RSVP first before accessing tickets or inviting your friends!",
      toggleLanguage: "中文",
      openSourceText: "open-sourced free event made with <3"
    },
    zh: {
      title: "果汁快闪咖啡馆展览",
      description: "来自世界各地的青少年制作的30款游戏快闪咖啡馆。免费展览，提供免费果汁",
      navExplore: "探索",
      navRsvp: "预约",
      navTicket: "门票",
      navFriends: "朋友",
      exploreTitle: "上海独立游戏快闪咖啡馆",
      rsvpTitle: "活动预约",
      rsvpButton: "完成预约",
      rsvpSuccess: "您已成功预约！",
      ticketTitle: "您的门票",
      friendsTitle: "朋友",
      rsvpAlert: "请先预约，然后再访问门票或邀请朋友！",
      toggleLanguage: "English",
      openSourceText: "开源免费活动，用❤️制作"
    }
  };
  
  // Get current language translation
  const t = translations[language];
  
  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  
  // Function to handle navigation clicks
  const handleNavClick = (stage) => {
    // If trying to access tickets or friends without RSVPing
    if ((stage === 2 || stage === 3) && !hasRSVPed) {
      alert(t.rsvpAlert);
      
      // Take them to RSVP page
      setExhibitStage(1);
      return;
    }
    
    setExhibitStage(stage);
  };
  
  // Function to complete RSVP process
  const completeRSVP = () => {
    setHasRSVPed(true);
    // Additional RSVP logic would go here
  };
  
  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>
      <main style={{width: "100vw", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{maxWidth: 500, width: "100%"}}>
          {/* Top bar with text and language toggle button */}
          <div style={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 10,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4
          }}>
            <a style={{
              fontSize: 14,
              margin: 0,
              color: "#000"
            }}
            href="http://github.com/hackclub/juice"
            >
              {t.openSourceText}
            </a>
            <button 
              onClick={toggleLanguage}
              style={{
                padding: "5px 10px",
                backgroundColor: "#fff",
                border: "1px solid #000",
                cursor: "pointer",
                borderRadius: "4px",
                color: "#000"
              }}
            >
              {t.toggleLanguage}
            </button>
          </div>
        
          <div style={{display: "flex", paddingLeft: 8, paddingTop: 8, paddingBottom: 8, borderBottom: "1px solid #000", paddingRight: 8, alignItems: "center", flexDirection: "row"}}>
            <div 
              style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "column", 
                opacity: exhibitStage === 0 ? 1.0 : 0.5,
                cursor: "pointer"
              }}
              onClick={() => handleNavClick(0)}
            >
            <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            </div>
            <p style={{fontSize: 14, marginTop: 2,}}>{t.navExplore}</p>
            </div>

            <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
            </div>

            <div 
              style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "column", 
                opacity: exhibitStage === 1 ? 1.0 : 0.5,
                cursor: "pointer"
              }}
              onClick={() => handleNavClick(1)}
            >
            <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            </div>
            <p style={{fontSize: 14, marginTop: 2,}}>{t.navRsvp}</p>
            </div>

            <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
            </div>

            <div 
              style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "column", 
                opacity: exhibitStage === 2 ? 1.0 : 0.5,
                cursor: "pointer"
              }}
              onClick={() => handleNavClick(2)}
            >
            <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            </div>
            <p style={{fontSize: 14, marginTop: 2,}}>{t.navTicket}</p>
            </div>

            <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
            </div>
            
            <div 
              style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "column", 
                opacity: exhibitStage === 3 ? 1.0 : 0.5,
                cursor: "pointer"
              }}
              onClick={() => handleNavClick(3)}
            >
            <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            </div>
            <p style={{fontSize: 14, marginTop: 2,}}>{t.navFriends}</p>
            </div>
        </div>

        {/* Content area based on selected stage */}
        <div style={{marginTop: 20}}>
          {exhibitStage === 0 && (
            <div>
              <h1>{t.exploreTitle}</h1>
              {/* Explore content */}
            </div>
          )}
          
          {exhibitStage === 1 && (
            <div>
              <h1>{t.rsvpTitle}</h1>
              {/* RSVP form would go here */}
              <button 
                onClick={completeRSVP}
                style={{
                  marginTop: 20,
                  padding: "10px 20px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {t.rsvpButton}
              </button>
              {hasRSVPed && (
                <p style={{color: "green", marginTop: 10}}>{t.rsvpSuccess}</p>
              )}
            </div>
          )}
          
          {exhibitStage === 2 && hasRSVPed && (
            <div>
              <h1>{t.ticketTitle}</h1>
              {/* Ticket content */}
            </div>
          )}
          
          {exhibitStage === 3 && hasRSVPed && (
            <div>
              <h1>{t.friendsTitle}</h1>
              {/* Friends content */}
            </div>
          )}
        </div>
        </div>
      </main>
    </>
  );
}
