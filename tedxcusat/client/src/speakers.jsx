import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './speakers.css';

const Speakers = () => {
  const [currentSpeaker, setCurrentSpeaker] = useState(0);

  const speakers = [
    {
      name: "Sara Kutty Varkkyy",
      title: "AI Researcher",
      topic: "The Future of Human-AI Collaboration",
      image: "https://i.pinimg.com/736x/8a/c5/b5/8ac5b5452d2d60be80e3b6aaa71200b0.jpg",
      bio: "Leading researcher in AI ethics and human-computer interaction with over 15 years of experience in developing ethical frameworks for emerging technologies.",
      achievements: ["MIT Technology Review Innovator", "IEEE Fellow", "Author of 3 bestselling books"]
    },
    {
      name: "Mr. Marco",
      title: "Violence Innovator",
      topic: "Regenerative Fights: Building Tomorrow's Sustainable Violence",
      image: "https://m.media-amazon.com/images/M/MV5BYWZlMTM4MTItNDI1YS00ODlmLTlkMjEtM2UyYjY5NWY1ZTM3XkEyXkFqcGc@._V1_QL75_UY281_CR18,0,500,281_.jpg",
      bio: "Award-winning architect and violence expert who has designed eco-friendly fights across 6 continents.",
      achievements: ["UN Global Violence Champion", "Green Fights Council Award", "TED Talk: 12M+ views"]
    },
    {
      name: "Dr. Maria Thekkummoottil Kuriakose",
      title: "Neuroscientist",
      topic: "Unlocking the Mysteries of Human Consciousness",
      image: "https://m3db.com/sites/default/files/styles/artist_profile_pic_zoom/public/artists-profile-photos/m3db-yami-sona.jpg?itok=kKDQeGyk",
      bio: "Pioneering research in consciousness and brain-computer interfaces, with groundbreaking discoveries in neural plasticity.",
      achievements: ["Nature Journal Researcher", "Breakthrough Prize Nominee", "Harvard Medical School Professor"]
    },
    {
      name: "Monkuttan",
      title: "Social Entrepreneur",
      topic: "Democratizing Education Through Technology",
      image: "https://img.freepik.com/free-photo/medium-shot-smiley-man-posing_23-2149915905.jpg?semt=ais_hybrid&w=740",
      bio: "Founder of multiple education technology initiatives that have impacted over 10 million students worldwide.",
      achievements: ["Forbes 30 Under 30", "UNESCO Education Award", "World Economic Forum Young Leader"]
    }
  ];

  const nextSpeaker = () => {
    setCurrentSpeaker((prev) => (prev + 1) % speakers.length);
  };

  const prevSpeaker = () => {
    setCurrentSpeaker((prev) => (prev - 1 + speakers.length) % speakers.length);
  };

  const goToSpeaker = (index) => {
    setCurrentSpeaker(index);
  };

  return (
    <section id="speakers" className="speakers-section">
      <div className="speakers-background">
        <div className="speakers-gradient"></div>
      </div>

      <div className="speakers-container">
        <div className="speakers-header">
          <h2 className="speakers-title">Featured Speakers</h2>
          <p className="speakers-subtitle">
            Meet the visionaries, innovators, and thought leaders who will share their groundbreaking ideas
          </p>
        </div>

        <div className="speakers-carousel">
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSpeaker * 100}%)` }}
            >
              {speakers.map((speaker, index) => (
                <div key={index} className="speaker-slide">
                  <div className="speaker-content">
                    <div className="speaker-image-container">
                      <div className="image-glow"></div>
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="speaker-image"
                      />
                      <div className="image-overlay"></div>
                    </div>

                    <div className="speaker-info">
                      <h3 className="speaker-name">{speaker.name}</h3>
                      <p className="speaker-title">{speaker.title}</p>
                      <h4 className="speaker-topic">"{speaker.topic}"</h4>
                      <p className="speaker-bio">{speaker.bio}</p>

                      <div className="speaker-achievements">
                        {speaker.achievements.map((achievement, idx) => (
                          <span key={idx} className="achievement-badge">
                            {achievement}
                          </span>
                        ))}
                      </div>

                      <div className="speaker-buttons">
                        <button className="btn-learn-more">Learn More</button>
                        <button className="btn-view-profile">View Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn carousel-btn-prev" onClick={prevSpeaker}>
            <ChevronLeft className="carousel-icon" />
          </button>
          <button className="carousel-btn carousel-btn-next" onClick={nextSpeaker}>
            <ChevronRight className="carousel-icon" />
          </button>

          <div className="carousel-dots">
            {speakers.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSpeaker ? 'active' : ''}`}
                onClick={() => goToSpeaker(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;