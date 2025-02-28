import React, { useRef } from 'react';

export default function WutIsPenguathonWindow({
  position,
  isDragging,
  isActive,
  handleMouseDown,
  handleDismiss,
  handleWindowClick,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX,
}) {
  const contentRef = useRef(null);

  const isPenguathonTime = () => {
    return Date.now() > 1740236400000 && Date.now() < 1740294000000;
  };

  const formatLocalTime = () => {
    const startDate = new Date(1740236400000); // This is 7PM EST / 12AM GMT
    const endDate = new Date(1740294000000); // This is 7PM EST / 12AM GMT next day

    const startOptions = {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    const dateOptions = {
      month: 'short',
      day: 'numeric',
    };

    const localStartTime = startDate.toLocaleTimeString(
      undefined,
      startOptions
    );
    const localStartDate = startDate.toLocaleDateString(undefined, dateOptions);
    const localEndTime = endDate.toLocaleTimeString(undefined, startOptions);
    const localEndDate = endDate.toLocaleDateString(undefined, dateOptions);

    return `from ${localStartTime} ${localStartDate} to ${localEndTime} ${localEndDate}`;
  };

  return (
    <div
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        top: '50%',
        left: '50%',
        position: 'absolute',
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
        pointerEvents: isActive ? 'auto' : 'none',
        visibility: isActive ? 'visible' : 'hidden',
      }}
    >
      <div
        onClick={handleWindowClick('wutIsPenguathon')}
        style={{
          display: 'flex',
          width: 650,
          color: 'black',
          height: 300,
          backgroundColor: '#fff',
          border: '1px solid #000',
          borderRadius: 4,
          flexDirection: 'column',
          padding: 0,
          userSelect: 'none',
          animation: 'linear .3s windowShakeAndScale',
        }}
      >
        <div
          onMouseDown={handleMouseDown('wutIsPenguathon')}
          style={{
            display: 'flex',
            borderBottom: '1px solid #00000020',
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            cursor: isDragging ? 'grabbing' : 'grab',
            backgroundColor: '#f6e7ba',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss('wutIsPenguathon');
              }}
            >
              x
            </button>
          </div>
          <p>wutIsPenguathon.txt</p>
          <div></div>
        </div>

        <div
          ref={contentRef}
          style={{
            flex: 1,
            padding: 16,
            outline: 'none',
            overflowY: 'auto',
            cursor: 'text',
            userSelect: 'text',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p>
              Hiii!!!!,{' '}
              <a
                href="https://hackclub.slack.com/team/U07BN55GN3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                Olive
              </a>{' '}
              here!
            </p>
            <p>
              I'm hosting another juiceathon! The last couple have been so fun
              that I wanted to get everyone together again this weekend to be
              super productive again! So make sure to waddle on in and work on
              your game with us :)
            </p>
            <p>
              For this juiceathon, I'm only going to go for 16 hrs so that I
              don't go crazy, but it should hopefully be long enough that
              everyone has a chance to join in. Even if you can't make it to all
              of it, stop by and say hi! I really want to see what you've been
              working on, everyone's games are just so impressive!
            </p>
            <p>
              In your timezone, the penguathon will go from {formatLocalTime()}.
              I hope to see you there!
            </p>
            {isPenguathonTime() && (
              <a
                href="https://hack.af/z-join?id=h6tp88"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignSelf: 'center',
                  marginTop: '8px',
                  textDecoration: 'none',
                }}
              >
                <img
                  src="/JoinButton.png"
                  alt="relay icon"
                  style={{
                    width: '140px',
                    height: '64px',
                    imageRendering: 'pixelated',
                  }}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
