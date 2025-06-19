import React, { useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Heart,
  ArrowUp
} from 'lucide-react';
import './footer.css';

const Footer = () => {
  const sectionRef = useRef(null);
  const backToTopRef = useRef(null);

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

    const handleScroll = () => {
      if (window.scrollY > 500) {
        backToTopRef.current?.classList.add('visible');
      } else {
        backToTopRef.current?.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerLinks = {
    event: [
      { title: 'About TEDxCUSAT', href: '#about' },
      { title: 'Speakers', href: '#speakers' },
      { title: 'Schedule', href: '#schedule' },
      { title: 'Venue', href: '#venue' },
      { title: 'Sponsors', href: '#sponsors' }
    ],
    resources: [
      { title: 'Watch TED Talks', href: 'https://ted.com/talks', external: true },
      { title: 'TED Guidelines', href: '#guidelines' },
      { title: 'Media Kit', href: '#media' },
      { title: 'Code of Conduct', href: '#conduct' },
      { title: 'Accessibility', href: '#accessibility' }
    ],
    support: [
      { title: 'Contact Us', href: '#contact' },
      { title: 'Volunteer', href: '#volunteer' },
      { title: 'Partnerships', href: '#partnerships' },
      { title: 'FAQ', href: '#faq' },
      { title: 'Support', href: '#support' }
    ]
  };

  const socialLinks = [
    {
      icon: <Facebook className="social-icon" />,
      href: 'https://www.facebook.com/tedxcusat21',
      name: 'Facebook',
      color: '#1877f2'
    },
    {
      icon: <Twitter className="social-icon" />,
      href: 'https://x.com/tedx_cusat',
      name: 'Twitter',
      color: '#1da1f2'
    },
    {
      icon: <Instagram className="social-icon" />,
      href: 'https://www.instagram.com/tedxcusat/?hl=en',
      name: 'Instagram',
      color: '#e4405f'
    },
    {
      icon: <Linkedin className="social-icon" />,
      href: 'https://www.linkedin.com/company/tedxcusat2024',
      name: 'LinkedIn',
      color: '#0077b5'
    },
    {
      icon: <Youtube className="social-icon" />,
      href: 'https://www.youtube.com/playlist?list=PLsRNoUx8w3rORgMOjfmy7pNx0Nfbv8bpn',
      name: 'YouTube',
      color: '#ff0000'
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="contact-icon" />,
      label: 'Email',
      value: 'soorajmurugaraj@gmail.com',
      href: 'mailto:soorajmurugaraj@gmail.com'
    },
    {
      icon: <Phone className="contact-icon" />,
      label: 'Phone',
      value: '+91 9846249930',
      href: 'tel:+919846249930'
    },
    {
      icon: <MapPin className="contact-icon" />,
      label: 'Location',
      value: 'CUSAT Campus, Kochi, Kerala',
      href: 'https://maps.google.com'
    }
  ];

  return (
    <footer id="footer" ref={sectionRef} className="footer-section">
      <div className="footer-background">
        <div className="footer-gradient"></div>
        <div className="footer-pattern">
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
          <div className="pattern-dot"></div>
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand animate-on-scroll">
            <div className="footer-logo">
              <span className="footer-ted">TED</span>
              <span className="footer-x">x</span>
              <span className="footer-cusat">CUSAT</span>
            </div>
            <p className="footer-tagline">
              Ideas Worth Spreading
            </p>
            <p className="footer-description">
              TEDxCUSAT is an independently organized TED event that brings together
              brilliant minds, innovative ideas, and passionate individuals to explore
              groundbreaking concepts that shape our future.
            </p>

            <div className="social-section">
              <h4 className="social-title">Follow Our Journey</h4>
              <div className="social-grid">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    style={{ '--social-color': social.color }}
                    aria-label={social.name}
                    target="_blank"
                  >
                    {social.icon}
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column animate-on-scroll">
              <h3 className="footer-column-title">Event</h3>
              <ul className="footer-links">
                {footerLinks.event.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.title}
                      {link.external && <ExternalLink className="external-icon" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column animate-on-scroll">
              <h3 className="footer-column-title">Resources</h3>
              <ul className="footer-links">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="footer-link"
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : ''}
                    >
                      {link.title}
                      {link.external && <ExternalLink className="external-icon" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column animate-on-scroll">
              <h3 className="footer-column-title">Support</h3>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-contact animate-on-scroll">
            <h3 className="footer-column-title">Get in Touch</h3>
            <div className="contact-grid">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="contact-item"
                  target={contact.label === 'Location' ? '_blank' : '_self'}
                  rel={contact.label === 'Location' ? 'noopener noreferrer' : ''}
                >
                  <div className="contact-icon-wrapper">
                    {contact.icon}
                  </div>
                  <div className="contact-content">
                    <span className="contact-label">{contact.label}</span>
                    <span className="contact-value">{contact.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p className="copyright">
              &copy; 2025 TED<sup>x </sup>CUSAT.
            </p>
          </div>

          <div className="footer-credits">
            <p className="credits">
              Made with <Heart className="heart-icon" /> by Sooraj Murugaraj.
            </p>
          </div>
        </div>
      </div>

      <button
        ref={backToTopRef}
        onClick={scrollToTop}
        className="back-to-top"
        aria-label="Back to top"
      >
        <ArrowUp className="arrow-icon" />
      </button>
    </footer>
  );
};

export default Footer;