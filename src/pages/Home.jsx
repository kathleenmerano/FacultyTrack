import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import schoolBg from "../assets/school-bg.jpg";
import logo from "../assets/Logo (3).png";

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="hero" style={{ backgroundImage: `url(${schoolBg})` }}>
        <div className="hero__overlay" />

        <div className="container hero__container">
          <div className="hero__grid">
            {/* LEFT */}
            <div className="hero__left">
              <h1 className="hero__title">
                Faculty Evaluation <br /> System
              </h1>

              <p className="hero__desc">
                Evaluate instructors honestly and help build a <br />
                stronger academic community.
              </p>

              <Link className="hero__btn" to="/login">
                Evaluate Now
              </Link>
            </div>

            {/* RIGHT */}
            <div className="hero__right">
              <div className="hero__logoWrap">
                <img className="hero__logo" src={logo} alt="School Logo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </>
  );
}
