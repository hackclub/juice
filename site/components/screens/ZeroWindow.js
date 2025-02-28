import React from 'react';

export default function ZeroWindow({
  position,
  isDragging,
  isActive,
  handleMouseDown,
  handleDismiss,
  handleWindowClick,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        top: '50%',
        left: '50%',
      }}
    >
      <div
        onClick={handleWindowClick('zero')}
        style={{
          display: 'flex',
          width: 500,
          height: 350,
          color: 'black',
          backgroundColor: '#fff',
          border: '1px solid #000',
          borderRadius: 4,
          flexDirection: 'column',
          padding: 0,
          justifyContent: 'space-between',
          userSelect: 'none',
          animation: 'linear .3s windowShakeAndScale',
        }}
      >
        <div
          onMouseDown={handleMouseDown('zero')}
          style={{
            display: 'flex',
            borderBottom: '1px solid #000',
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss('zero');
              }}
            >
              x
            </button>
          </div>
          <p>
            Juice <i>Zero</i>
          </p>
          <div></div>
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflowY: 'scroll',
          }}
        >
          <style jsx>{`
            .zero-button-box {
              display: flex;
              flex-direction: row;
              justify-content: space-evenly;
            }

            .zero-button {
              display: inline;
              padding: 1px 30px;
              cursor: pointer;
            }

            .zero-window-select {
              display: flex;
              flex-direction: column;
              gap: 1px;
            }

            .zero-window-option {
              display: flex;
              flex-direction: row;
              gap: 10px;
            }
          `}</style>
          <p>
            All the juice <i>none of the calories!</i>
          </p>
          <p>
            Juice Zero is designed to bring the same great juicing experience
            with up to 80%* less lag!
          </p>
          <p>
            Juice Zero works by only opening the windows you want open and then
            deleting everything else. You can open any subset of the windows you
            would like, or use one of these handy buttons to get exactly where
            you need to go:
          </p>
          <div className="zero-button-box">
            <button
              className="zero-button"
              onClick={() => {
                window.location.href = window.origin + '/zero';
              }}
            >
              Juice
            </button>
            <button
              className="zero-button"
              onClick={() => {
                window.location.href =
                  window.origin + '/zero?windows=jungleWindow';
              }}
            >
              Jungle
            </button>
          </div>
          <p>
            Here's a list of all the possible windows. Select the windows you
            need and then select [Zeroify!]
          </p>
          <div className="zero-window-select">
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="zero"
                className="zero-window-option-check"
              />{' '}
              <p>Juice Zero (this!)</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="juiceWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Juicer</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="jungleWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Jungle</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="fruitBasketWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Fruit Basket</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="welcomeWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Welcome Window</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="achievements"
                className="zero-window-option-check"
              />{' '}
              <p>Achievements</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="kudos"
                className="zero-window-option-check"
              />{' '}
              <p>Kudos</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="Gallery"
                className="zero-window-option-check"
              />{' '}
              <p>Gallery</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="menuWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Moments</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="fortuneBasket"
                className="zero-window-option-check"
              />{' '}
              <p>Fortune Basket</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="thanks"
                className="zero-window-option-check"
              />{' '}
              <p>Thanks</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="faction"
                className="zero-window-option-check"
              />{' '}
              <p>Team Tickets</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="jungleShopWindow"
                className="zero-window-option-check"
              />{' '}
              <p>Cosmin's Jungle Shop</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="wutIsJuice"
                className="zero-window-option-check"
              />{' '}
              <p>wutIsJuice</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="wutIsJungle"
                className="zero-window-option-check"
              />{' '}
              <p>wutIsJungle</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="tamagotchiNotes"
                className="zero-window-option-check"
              />{' '}
              <p>wutIsEgg</p>
            </div>
            <div className="zero-window-option">
              <input
                type="checkbox"
                window="video"
                className="zero-window-option-check"
              />{' '}
              <p>Introduction Video</p>
            </div>
          </div>
          <button
            className="zero-button"
            onClick={() => {
              let selectedWindows = [];
              Array.prototype.forEach.call(
                document.getElementsByClassName('zero-window-option-check'),
                (elem) => {
                  if (
                    elem.hasAttributes() &&
                    elem.attributes['window'] &&
                    elem.checked
                  ) {
                    selectedWindows.push(
                      elem.attributes.getNamedItem('window').value
                    );
                  }
                }
              );
              console.log(selectedWindows);
              if (selectedWindows.length > 0) {
                window.location.href =
                  window.origin + '/zero?windows=' + selectedWindows.join('-');
              } else {
                window.location.href = window.origin + '/zero';
              }
            }}
          >
            Zeroify!
          </button>
          <p>
            <i>* your results may vary</i>
          </p>
        </div>
      </div>
    </div>
  );
}
