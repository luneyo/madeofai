import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Layout, Smartphone, PenTool, Code, MessageCircle } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="section-card hero">
                <div className="header-nav">
                    <div className="header-left">
                        <span>madeofai@gmail.com</span>
                        <button className="pill-btn">Copy</button>
                        <button className="pill-btn">CV</button>
                    </div>
                    <div className="header-right">
                        <span>LinkedIn</span>
                        <span>/</span>
                        <span>Dribbble</span>
                        <span>/</span>
                        <span>Instagram</span>
                    </div>
                </div>

                <div className="hero-content">
                    {/* Placeholder for profile image */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="profile-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👋</div>
                    </div>

                    <h1 className="hero-title">
                        Hi, I'm Saheel. I've built digital products for you content kings & queens.
                    </h1>

                    <Link to="/app" className="cta-btn">
                        Check em out<ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Logos Section - mimicking the strip */}
            <div className="section-card" style={{ padding: '2rem', borderRadius: '30px' }}>
                <div className="logos-section">
                    <span className="logo-item">RedditReader</span>
                    <span className="logo-item">Blawger</span>
                    <span className="logo-item">Neighbourhood</span>
                </div>
            </div>

            {/* Services Section */}
            <div className="section-card">
                <h2 className="services-title">
                    Collaborate with brands and agencies to create impactful results.
                </h2>

                <div className="services-grid">
                    <div className="service-item">
                        <div className="service-icon"><Layout /></div>
                        <h3 className="service-name">UX & UI</h3>
                        <p className="service-desc">Designing interfaces that are intuitive, efficient, and enjoyable to use.</p>
                    </div>
                    <div className="service-item">
                        <div className="service-icon"><Smartphone /></div>
                        <h3 className="service-name">Web & Mobile App</h3>
                        <p className="service-desc">Transforming ideas into exceptional web and mobile app experiences.</p>
                    </div>
                    <div className="service-item">
                        <div className="service-icon"><PenTool /></div>
                        <h3 className="service-name">Design & Creative</h3>
                        <p className="service-desc">Crafting visually stunning designs that connect with your audience.</p>
                    </div>
                    <div className="service-item">
                        <div className="service-icon"><Code /></div>
                        <h3 className="service-name">Development</h3>
                        <p className="service-desc">Bringing your vision to life with the latest technology and design trends.</p>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="section-card footer">
                <div style={{ marginBottom: '2rem' }}>
                    <MessageCircle size={40} />
                </div>
                <h2 className="footer-title">Tell me about your next project</h2>

                <div className="footer-actions">
                    <Link to="/app" className="cta-btn">
                        <Mail size={16} /> Email Me
                    </Link>
                    <button className="pill-btn" style={{ padding: '1rem 2rem', borderRadius: '30px' }}>WhatsApp</button>
                </div>

                <div className="footer-bottom">
                    <span>© 2024 All rights reserved.</span>
                    <div>
                        <span>LinkedIn</span> / <span>Dribbble</span> / <span>Instagram</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
