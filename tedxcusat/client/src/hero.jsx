import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, Play, Clock, Star, Volume2, VolumeX } from 'lucide-react';
import './hero.css';

const Hero = () => {
  const videoRef = useRef(null);
  const panelVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStatus, setVideoStatus] = useState({
    mainVideo: 'loading',
    panelVideo: 'loading'
  });

  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (!particlesContainer) return;

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${2 + Math.random() * 3}s`;
        particlesContainer.appendChild(particle);
      }
    };
    createParticles();

    // Enhanced video debugging
    const setupVideo = (videoElement, videoName) => {
      if (!videoElement) return;

      const handleLoadStart = () => {
        console.log(`✅ ${videoName} loading started`);
        setVideoStatus(prev => ({ ...prev, [videoName]: 'loading' }));
      };

      const handleCanPlay = () => {
        console.log(`✅ ${videoName} can play`);
        setVideoStatus(prev => ({ ...prev, [videoName]: 'canplay' }));
      };

      const handleError = (e) => {
        console.error(`❌ ${videoName} error:`, e.target.error);
        console.error(`Error details:`, {
          code: e.target.error?.code,
          message: e.target.error?.message,
          src: e.target.src,
          currentSrc: e.target.currentSrc
        });
        setVideoStatus(prev => ({ ...prev, [videoName]: 'error' }));
      };

      const handleLoadedData = () => {
        console.log(`✅ ${videoName} data loaded`);
        setVideoStatus(prev => ({ ...prev, [videoName]: 'loaded' }));
      };

      const handlePlay = () => {
        console.log(`✅ ${videoName} started playing`);
        setVideoStatus(prev => ({ ...prev, [videoName]: 'playing' }));
      };

      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('play', handlePlay);

      // Try to play
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log(`✅ ${videoName} playing successfully`))
          .catch(error => {
            console.error(`❌ ${videoName} play failed:`, error);
            setVideoStatus(prev => ({ ...prev, [videoName]: 'playError' }));
          });
      }

      return () => {
        videoElement.removeEventListener('loadstart', handleLoadStart);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('play', handlePlay);
      };
    };

    const mainVideoCleanup = setupVideo(videoRef.current, 'mainVideo');
    const panelVideoCleanup = setupVideo(panelVideoRef.current, 'panelVideo');

    return () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
      mainVideoCleanup && mainVideoCleanup();
      panelVideoCleanup && panelVideoCleanup();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Debug function to test video URL
  const testVideoUrl = () => {
    const testUrl = '/tedx-event-vid.mp4';
    window.open(testUrl, '_blank');
  };

  return (
    <section id="home" className="hero">
      {/* Debug Panel - Remove this in production */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <div>Main Video: {videoStatus.mainVideo}</div>
        <div>Panel Video: {videoStatus.panelVideo}</div>
        <button onClick={testVideoUrl} style={{ marginTop: '5px', fontSize: '10px' }}>
          Test Video URL
        </button>
      </div>

      <div className="video-background">
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/tedx-event-vid.mp4" type="video/mp4" />
          <div style={{ color: 'white', padding: '20px' }}>
            Your browser does not support the video tag or the video failed to load.
          </div>
        </video>

        <div className="video-overlay-gradient"></div>
        <div className="video-overlay-pattern"></div>
      </div>

      <div className="hero-background">
        <div className="gradient-overlay-enhanced"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
        <div className="particles-container"></div>

        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="hero-content">
        <div className="event-main">
          <div className="event-left">
            <div className="content-glass-panel">
              <video
                ref={panelVideoRef}
                className="panel-background-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/tedx-event-vid.mp4" type="video/mp4" />
              </video>
              <div className="panel-content">
                <div className="event-header">
                  <h1 className="event-title">
                    <span className="title-line-1">Kaleidoscope:</span>
                    <span className="title-line-2">Alchemy of Voices</span>
                    <div className="title-underline"></div>
                  </h1>

                  <div className="event-date">
                    <div className="date-main">10</div>
                    <div className="date-month">MAR</div>
                    <div className="date-year">2025</div>
                    <div className="date-glow"></div>
                  </div>
                </div>

                <p className="event-description">
                  Experience an extraordinary fusion of diverse voices, transformative stories,
                  and groundbreaking ideas that will reshape your perspective on innovation and creativity.
                </p>

                <div className="event-details">
                  <div className="detail-item">
                    <div className="detail-icon-wrapper">
                      <Clock className="detail-icon" />
                    </div>
                    <span>6:00 PM - 9:00 PM</span>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon-wrapper">
                      <MapPin className="detail-icon" />
                    </div>
                    <span>CUSAT Auditorium</span>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon-wrapper">
                      <Users className="detail-icon" />
                    </div>
                    <span>Limited Seats</span>
                  </div>
                </div>

                <div className="event-buttons">
                  <button className="btn-primary">
                    <span className="btn-text">
                      Book Tickets
                      <ArrowRight className="btn-icon" />
                    </span>
                    <div className="btn-ripple"></div>
                  </button>
                  <button className="btn-secondary">
                    <span className="btn-text">
                      <Play className="btn-icon" />
                      Preview
                    </span>
                    <div className="btn-ripple"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="event-stats">
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <div className="stat-label">Speakers</div>
            <div className="stat-accent"></div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Attendees</div>
            <div className="stat-accent"></div>
          </div>
          <div className="stat-item">
            <div className="stat-number">8hrs</div>
            <div className="stat-label">Experience</div>
            <div className="stat-accent"></div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1st</div>
            <div className="stat-label">In Kerala</div>
            <div className="stat-accent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;