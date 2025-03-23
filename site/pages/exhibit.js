import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';

// TopBar component for navigation and language toggle
const TopBar = ({ exhibitStage, handleNavClick, toggleLanguage, t }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "8px 8px 4px",
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
      
      <div style={{
        display: "flex", 
        paddingLeft: 8, 
        paddingTop: 8, 
        paddingBottom: 8, 
        borderBottom: "1px solid #000", 
        paddingRight: 8, 
        alignItems: "center", 
        flexDirection: "row"
      }}> 
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
            <div 
              style={{ 
                margin: 2, 
                width: 46, 
                height: 46, 
                backgroundImage: "url('/explore_1.png')", 
                backgroundSize: "cover", 
                backgroundPosition: "center center", 
                backgroundRepeat: "no-repeat", 
                imageRendering: "pixelated", 
                transition: "background-image 0.3s ease" 
              }} 
              onMouseOver={(e) => e.currentTarget.style.backgroundImage = "url('/explore_2.png')"}
              onMouseOut={(e) => e.currentTarget.style.backgroundImage = "url('/explore_1.png')"}
            ></div>
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
            opacity: exhibitStage === 2 ? 1.0 : 0.5,
            cursor: "pointer",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
          onMouseOut={(e) => e.currentTarget.style.opacity = exhibitStage === 2 ? 1.0 : 0.5}
          onClick={() => handleNavClick(1)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            <div 
              style={{ 
                margin: 2, 
                width: 46, 
                height: 46, 
                backgroundImage: "url('/rsvp_1.png')", 
                backgroundSize: "cover", 
                backgroundPosition: "center center", 
                backgroundRepeat: "no-repeat", 
                imageRendering: "pixelated", 
                transition: "background-image 0.3s ease" 
              }} 
              onMouseOver={(e) => e.currentTarget.style.backgroundImage = "url('/rsvp_2.png')"}
              onMouseOut={(e) => e.currentTarget.style.backgroundImage = "url('/rsvp_1.png')"}
            ></div>
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
            cursor: "pointer",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
          onMouseOut={(e) => e.currentTarget.style.opacity = exhibitStage === 2 ? 1.0 : 0.5}
          onClick={() => handleNavClick(2)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            <div 
              style={{ 
                margin: 2, 
                width: 46, 
                height: 46, 
                backgroundImage: "url('/ticket_1.png')", 
                backgroundSize: "cover", 
                backgroundPosition: "center center", 
                backgroundRepeat: "no-repeat", 
                imageRendering: "pixelated", 
                transition: "background-image 0.3s ease" 
              }} 
              onMouseOver={(e) => e.currentTarget.style.backgroundImage = "url('/ticket_2.png')"}
              onMouseOut={(e) => e.currentTarget.style.backgroundImage = "url('/ticket_1.png')"}
            ></div>
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
          opacity: exhibitStage === 2 ? 1.0 : 0.5,
          cursor: "pointer",
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
        onMouseOut={(e) => e.currentTarget.style.opacity = exhibitStage === 2 ? 1.0 : 0.5}
          onClick={() => handleNavClick(3)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
            <div 
              style={{ 
                margin: 2, 
                width: 46, 
                height: 46, 
                backgroundImage: "url('/friends_1.png')", 
                backgroundSize: "cover", 
                backgroundPosition: "center center", 
                backgroundRepeat: "no-repeat", 
                imageRendering: "pixelated", 
                transition: "background-image 0.3s ease" 
              }} 
              onMouseOver={(e) => e.currentTarget.style.backgroundImage = "url('/friends_2.png')"}
              onMouseOut={(e) => e.currentTarget.style.backgroundImage = "url('/friends_1.png')"}
            ></div>
          </div>
          <p style={{fontSize: 14, marginTop: 2,}}>{t.navFriends}</p>
        </div>
      </div>
    </div>
  );
};

// GameCarousel component to showcase games
const GameCarousel = ({ games, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div style={{ marginTop: 20, textAlign: 'center', overflow: 'hidden' }}>
      <h2>{t.gameShowcaseTitle}</h2>
      <div style={{ 
        display: 'flex', 
        transition: 'transform 0.5s ease-in-out', 
        transform: `translateX(-${currentIndex * 100}%)`
      }}>
        {games.map((game, index) => (
          <div 
            key={index} 
            style={{ 
              flex: '0 0 100%', 
              width: '100%', 
              textAlign: 'center', 
              padding: '0 10px',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '100%', height: 100, border: '1px solid #000' }}>
              {game}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// PostcardsSection component to display partner postcards
const PostcardsSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.postcardsTitle}</h2>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
      <div style={{ width: 100, height: 100, border: '1px solid #000', textAlign: 'center' }}>BottleDream Postcard</div>
      <div style={{ width: 100, height: 100, border: '1px solid #000', textAlign: 'center' }}>SparkLabs Postcard</div>
    </div>
  </div>
);

// FlightMapSection component to display the global flight map
const FlightMapSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.flightMapTitle}</h2>
    <p>{t.flightMapDescription}</p>
    <div style={{ width: '100%', height: 200, border: '1px solid #000', marginTop: 10 }}>Animated Flight Map</div>
  </div>
);

// VideoShowcaseSection component to display the showcase video
const VideoShowcaseSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.videoShowcaseTitle}</h2>
    <p>{t.videoShowcaseDescription}</p>
    <div style={{ width: '100%', height: 200, border: '1px solid #000', marginTop: 10 }}>Showcase Video</div>
  </div>
);

// FinalCTASection component for the final call-to-action
const FinalCTASection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <button style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
      {t.claimTicket}
    </button>
    <p>{t.eventDateLocation}</p>
  </div>
);

// Footer component for the page footer
const Footer = ({ t }) => (
  <footer style={{ marginTop: 20, textAlign: 'center', padding: '20px 0', borderTop: '1px solid #000' }}>
    <p>{t.openSourceText}</p>
    <p>{t.footerText}</p>
  </footer>
);

// Main Exhibit component
export default function Exhibit() {
  const [exhibitStage, setExhibitStage] = useState(0);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedDate, setSelectedDate] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [ticketUrl, setTicketUrl] = useState('');
  const qrCodeRef = useRef(null);

  const games = [
    "Game 1", "Game 2", "Game 3", "Game 4", "Game 5", 
    "Game 6", "Game 7", "Game 8", "Game 9", "Game 10", 
    "Game 11", "Game 12", "Game 13", "Game 14", "Game 15"
  ];
  
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
      rsvpAlert: "Please RSVP first before accessing this section of the site",
      toggleLanguage: "中文",
      openSourceText: "open-sourced free event made with <3",
      exploreDescription: "30 high school indie game developers from 10+ countries are coming to Shanghai to make you free fresh juice and let you try their game",
      claimTicket: "claim free juice ticket",
      eventDateLocation: "April 5th - 10th @ BottleDream & SparkLabs",
      postcardsTitle: "Postcards from Our Partners",
      gameShowcaseTitle: "Games by Developers",
      flightMapTitle: "Global Flight Map",
      flightMapDescription: "High schoolers from around the world spent the past couple months making their own games and launched them to Steam.",
      videoShowcaseTitle: "Showcase Video",
      videoShowcaseDescription: "Now they all flew to Shanghai to run a popup cafe displaying their games and giving free juice to people who come visit.",
      finalCTAText: "Claim your free juice ticket now!",
      footerText: "© 2025 Juice Popup Cafe. All rights reserved."
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
      openSourceText: "开源免费活动，用❤️制作",
      exploreDescription: "来自10多个国家的30位高中生独立游戏开发者将来到上海，为您提供免费新鲜果汁，并让您尝试他们的游戏",
      claimTicket: "领取免费果汁券",
      eventDateLocation: "4月5日至10日 @ BottleDream & SparkLabs",
      postcardsTitle: "合作伙伴的明信片",
      gameShowcaseTitle: "开发者制作的游戏",
      flightMapTitle: "全球飞行地图",
      flightMapDescription: "来自世界各地的高中生们花了几个月的时间制作了自己的游戏，并将它们发布到Steam上。",
      videoShowcaseTitle: "展示视频",
      videoShowcaseDescription: "现在他们都飞到了上海，经营一个快闪咖啡馆，展示他们的游戏，并为来访的人提供免费果汁。",
      finalCTAText: "立即领取您的免费果汁券！",
      footerText: "© 2025 果汁快闪咖啡馆。保留所有权利。"
    }
  };
  
  const t = translations[language];
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  
  const handleNavClick = (stage) => {
    if ((stage === 2 || stage === 3) && !hasRSVPed) {
      alert(t.rsvpAlert);
      setExhibitStage(1);
      return;
    }
    setExhibitStage(stage);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const name = event.target.name.value;
    const phone = event.target.phone.value;
    const eventDate = event.target.eventDate.value;
    const timeBlock = event.target.timeBlock.value;
  
    const data = JSON.stringify({ name, phone, eventDate, timeBlock });
    const encryptedData = btoa(encodeURIComponent(data));
    const ticketUrl = `${window.location.origin}?ticket=${encryptedData}`;
  
    setTicketData({ name, phone, eventDate, timeBlock });
    setTicketUrl(ticketUrl);
    setHasRSVPed(true);
    setExhibitStage(2);
  };

  const handleDownloadTicket = () => {
    const ticketElement = document.querySelector('.ticket');
    if (ticketElement) {
      html2canvas(ticketElement).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'ticket.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  // Check for ticket parameter in the URL when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedTicket = urlParams.get('ticket');
    if (encryptedTicket) {
      try {
        const decryptedData = JSON.parse(decodeURIComponent(atob(encryptedTicket)));
        setTicketData(decryptedData);
        setHasRSVPed(true);
        setExhibitStage(2); // Navigate directly to the ticket section
        setTicketUrl(`${window.location.origin}?ticket=${encryptedTicket}`);
      } catch (error) {
        console.error("Failed to decrypt ticket data:", error);
      }
    }
  }, []);

  // Initialize QR code
  useEffect(() => {
    if (ticketUrl && exhibitStage === 2) {
      qrCodeRef.current = new QRCodeStyling({
        width: 250,
        height: 250,
        data: ticketUrl,
        image: "/download.png",
        dotsOptions: {
          color: "#28a745",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10,
          imageSize: 0.4
        }
      });

      qrCodeRef.current.append(document.getElementById("qrCodeContainer"));
    }
  }, [ticketUrl, exhibitStage]);

  const cafeLocations = [
    {
      name: "Bottle Dream",
      address: "上海市长宁区利西路143号",
      dateRange: "April 4 - 8th",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.222662851988!2d121.42706507559934!3d31.21455997435548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b2655b4206a9dd%3A0x52c4a26f3959e0a0!2s143%20Li%20Xi%20Lu%2C%20Chang%20Ning%20Qu%2C%20Shang%20Hai%20Shi%2C%20China%2C%20200031!5e0!3m2!1sde!2sde!4v1742755657577!5m2!1sde!2sde",
    },
    {
      name: "SparkLabs",
      address: "漕河泾开发区公园-东门 上海市徐汇区平果路与桂果路交叉口正南方向33米左右",
      dateRange: "April 8th - 11th",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d265.70880253234407!2d121.4000672340257!3d31.169182193173473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b2648aa8c7febd%3A0x19c44e407065d5d9!2sCaohejing%20Development%20Zone%20Park!5e0!3m2!1sde!2sde!4v1742756024455!5m2!1sde!2sde",
    },
  ];

  const selectedCafe = new Date(selectedDate) < new Date("2025-04-08")
    ? cafeLocations[0]
    : cafeLocations[1];

  const topBarHeight = 32 + 80 + 16;

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>
      
      <div
        className="jsx-6d85b273455fbd4d"
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          margin: "0px",
          cursor: "default",
          position: "absolute",
          zIndex: -100,
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            backgroundImage: "url('/background.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        ></div>
      </div>

      <TopBar 
        exhibitStage={exhibitStage} 
        handleNavClick={handleNavClick} 
        toggleLanguage={toggleLanguage} 
        t={t} 
      />
      
      <main style={{
        width: "100vw", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        marginTop: `${topBarHeight}px`
      }}>
        <div style={{
          maxWidth: 500, 
          width: "100%", 
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{marginTop: 6, padding: 8}}>
            {exhibitStage === 0 && (
              <div>
                <h1 style={{fontSize: 48}}>{t.exploreTitle}</h1>
                <p style={{marginTop: 12, fontSize: 18}}>{t.exploreDescription}</p>
                <div 
                  onClick={() => setExhibitStage(1)}
                  style={{width: "100%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16, backgroundColor: "#000", color: "#fff", padding: 12, fontSize: 32}}>
                  <p>{t.claimTicket}</p>
                </div>
                <p style={{width: "100%", textAlign: "center", marginTop: 8}}>{t.eventDateLocation}</p>
                
                <PostcardsSection t={t} />
                <GameCarousel games={games} t={t} />
                <FlightMapSection t={t} />
                <VideoShowcaseSection t={t} />
                <FinalCTASection t={t} />
                <Footer t={t} />
              </div>
            )}
            
            {exhibitStage === 1 && (
              <div style={{padding: 8}}>
                <h1>{t.rsvpTitle}</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" name="name" placeholder="Enter your name" required />
                  <input type="tel" name="phone" placeholder="Enter your phone number" required />
                  <input
                    type="date"
                    name="eventDate"
                    min="2025-04-05"
                    max="2025-04-11"
                    required
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <select name="timeBlock" required>
                    <option value="" disabled selected>Select time block</option>
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                    <option value="Evening (6 PM - 9 PM)">Evening (6 PM - 9 PM)</option>
                  </select>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {t.rsvpButton}
                  </button>
                </form>
                {hasRSVPed && (
                  <p style={{color: "green", marginTop: 10}}>{t.rsvpSuccess}</p>
                )}
                <div style={{ marginTop: '20px' }}>
                  <iframe
                    src={selectedCafe.mapEmbedUrl}
                    width="100%"
                    height="400"
                    style={{ border: "0", borderRadius: "15px" }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}
            
            {exhibitStage === 2 && hasRSVPed && (
              <div>
                <h1>{t.ticketTitle}</h1>
                {ticketData ? (
                  <div className="ticket" style={{ border: '1px solid #000', padding: '20px', borderRadius: '10px', maxWidth: '500px', margin: '0 auto' }}>
                    <div className="top-part" style={{ textAlign: 'center' }}>
                      <div className="header" style={{ fontSize: '24px', fontWeight: 'bold' }}>JUICE POP-UP-CAFE</div>
                      <div id="qrCodeContainer"></div>
                    </div>
                    <div className="perforated-line" style={{ borderBottom: '1px dashed #000', margin: '20px 0' }}></div>
                    <div className="bottom-part">
                      <div className="details" style={{ marginBottom: '20px' }}>
                        <p><strong>Name:</strong> {ticketData.name}</p>
                        <p><strong>Phone:</strong> {ticketData.phone}</p>
                        <p><strong>Date:</strong> {ticketData.eventDate}</p>
                        <p><strong>Time Block:</strong> {ticketData.timeBlock}</p>
                        <p>
                          <strong>Address:</strong>{" "}
                          <a
                            href={
                              new Date(ticketData.eventDate) < new Date("2025-04-08")
                                ? "https://www.google.com/maps?q=上海市长宁区利西路143号"
                                : "https://www.google.com/maps?q=漕河泾开发区公园-东门 上海市徐汇区平果路与桂果路交叉口正南方向33米左右"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {new Date(ticketData.eventDate) < new Date("2025-04-08")
                              ? "上海市长宁区利西路143号"
                              : "漕河泾开发区公园-东门 上海市徐汇区平果路与桂果路交叉口正南方向33米左右"}
                          </a>
                        </p>
                      </div>
                      <div className="message" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                        Present this QR code at our POP-UP-CAFE!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
                <button onClick={handleDownloadTicket} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  <span className="material-icons">download</span> Download Ticket
                </button>
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
    </>);
}
