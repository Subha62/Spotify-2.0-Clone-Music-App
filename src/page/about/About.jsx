import React, { useEffect } from "react";
import "./About.css";
import { FaGithub } from "react-icons/fa";

const About = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.title = "About • SB Music";
  }, []);

  return (
    <section className="container about-container">
      <div className="about-wrapper">
        <div className="about-header-wrapper">
          <img src="/image.png" alt="SB-music" />
        </div>
        <div className="about-content-wrapper">
          <p>
            SB-Music is a Progressive Web App that enables users to discover
            and enjoy new music and songs. It utilizes JavaScript, React.js, and
            YouTube API to build a user-friendly application with a powerful
            YouTube search feature. SB-Music is an open-source project and can
            be found on GitHub
          </p>
          <a
            href=""
            target="_blank"
            rel="noreferrer"
            className="absolute-center"
          >
            <FaGithub size={25} />
            /SB-music
          </a>
          <p>
            If you appreciate my work, kindly consider giving the repository a
            star ⭐ on GitHub. Your support is greatly valued! ❤️
          </p>
        </div>

        <div className="about-footer">
          <small>
            Copyright © 2025-{currentYear} SB-Music. All Rights Reserved.
          </small>
          <small>
            Made with ❤️ by{" "}
            <a href="https://my-portfolio6296.netlify.app/" target="_blank">
                   Subhadip Bera
            </a>
          </small>
        </div>
      </div>
    </section>
  );
};

export default About;
