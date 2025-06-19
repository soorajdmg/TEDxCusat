import React, { useEffect, useRef } from 'react';
import { Star, Users, Clock, Lightbulb, Globe, Heart } from 'lucide-react';
import './about.css';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Lightbulb className="feature-icon" />,
      title: "Innovation",
      description: "Cutting-edge ideas that challenge conventional thinking and push boundaries into unexplored territories of human potential."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Community",
      description: "Building connections between diverse minds and fostering collaborative growth across disciplines and cultures."
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Impact",
      description: "Creating lasting change through powerful ideas and meaningful conversations that resonate beyond the event."
    }
  ];

  const stats = [
    { number: "500+", label: "Attendees" },
    { number: "12", label: "Speakers" },
    { number: "8", label: "Hours of Content" },
    { number: "50+", label: "Countries Represented" }
  ];

  const values = [
    {
      icon: <Globe className="value-icon" />,
      title: "Global Perspective",
      description: "Bringing together voices from around the world to share diverse viewpoints and experiences."
    },
    {
      icon: <Heart className="value-icon" />,
      title: "Human Connection",
      description: "Fostering genuine connections and meaningful dialogue between participants and speakers."
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-background">
        <div className="about-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="about-container">
        {/* Header */}
        <div className="about-header animate-on-scroll">
          <h2 className="about-title">About TEDxCUSAT</h2>
          <p className="about-subtitle">
            TEDxCUSAT is an independently organized TED event that brings together brilliant minds, 
            innovative ideas, and passionate individuals to explore the theme of "Ideas Worth Spreading" 
            in our vibrant local community.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mission-statement animate-on-scroll">
          <div className="mission-content">
            <h3 className="mission-title">Our Mission</h3>
            <p className="mission-text">
              To create a platform where groundbreaking ideas meet passionate minds, where innovation 
              sparks conversation, and where the future is shaped by the power of human curiosity and collaboration.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="features-grid animate-on-scroll">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="feature-icon-container">
                {feature.icon}
                <div className="icon-glow"></div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="stats-section animate-on-scroll">
          <h3 className="stats-title">Event at a Glance</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="values-section animate-on-scroll">
          <h3 className="values-title">What We Stand For</h3>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="value-icon-container">
                  {value.icon}
                </div>
                <div className="value-content">
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEDx License */}
        <div className="license-section animate-on-scroll">
          <div className="license-content">
            <div className="tedx-logo">
              <span className="about-ted">TED</span>
              <span className="about-x">x</span>
            </div>
            <p className="license-text">
              This independent TEDx event is operated under license from TED, following the same 
              format and high standards that have made TED talks a global phenomenon for spreading ideas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;