import React, { useState, useEffect } from 'react';
import './countdown.css';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-31T10:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section id="countdown" className="countdown-section">
      <div className="countdown-background">
        <div className="countdown-gradient"></div>
      </div>

      <div className="countdown-container">
        <h2 className="countdown-title">Event Countdown</h2>
        <p className="countdown-subtitle">Don't miss out on this incredible experience</p>

        <div className="countdown-grid">
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="countdown-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="countdown-number">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="countdown-label">{unit.label}</div>
              <div className="countdown-glow"></div>
            </div>
          ))}
        </div>

        <div className="countdown-cta">
          <p className="countdown-urgency">Limited seats available!</p>
          <button className="countdown-btn">
            Book Your Spot Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Countdown;