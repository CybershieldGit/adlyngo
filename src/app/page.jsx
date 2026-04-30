import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import InfiniteHorizontalCarousel from "@/components/InfiniteHorizontalCarousel";
import AboutSection from "@/components/sections/About";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        <Hero />
        <Stats />
        <AboutSection />
        
        <section className="pt-0 pb-15px lg-pb-50px overflow-hidden">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 text-center opacity-8">
                <div 
                  className="fs-200 lh-200 lg-fs-200 sm-w-100 ls-minus-3px text-gradient-light-gray-white text-white-space-nowrap" 
                  data-bottom-top="transform: translate3d(-150px, 0px, 0px);" 
                  data-top-bottom="transform: translate3d(50px, 0px, 0px);"
                >
                  creative digital agency
                </div>
              </div>
            </div>
          </div>
        </section>

        <Services />
        <CaseStudies />
        
        {/* Reels Section */}
        <section className="p-0 overflow-hidden" style={{ background: '#262626' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center pt-5">
                <h2 className="fs-65 fw-500 text-white mb-0">Featured Work</h2>
              </div>
            </div>
          </div>
          <InfiniteHorizontalCarousel />
        </section>

        {/* Brands Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center mb-35px">
              <div className="col-xl-9 col-lg-12 text-center">
                <h2 className="fs-65 fw-500 text-dark-gray">Helping brands grow through smart digital marketing.</h2>
              </div>
            </div>
            <div className="row border-top border-bottom border-color-transparent-dark-very-light row-cols-1 row-cols-lg-3">
              <div className="col text-center p-70px xl-p-50px lg-p-40px sm-p-30px last-paragraph-no-margin border-end md-border-end-0 md-border-bottom border-color-transparent-dark-very-light">
                <h2 className="h1 fw-500 ls-minus-3px text-dark-gray mb-50px lg-mb-30px">2X</h2>
                <span className="fs-20 fw-500 d-block mb-5px text-dark-gray">Boosting revenue growth</span>
                <p>Empowering businesses by boosting consistent revenue growth.</p>
              </div>
              <div className="col text-center p-70px xl-p-50px lg-p-40px sm-p-30px last-paragraph-no-margin border-end md-border-end-0 md-border-bottom border-color-transparent-dark-very-light position-relative">
                <span className="position-absolute top-25px right-25px bg-base-color border-radius-18px text-white fs-11 lh-24 fw-600 text-uppercase ps-15px pe-15px">Hot</span>
                <h2 className="h1 fw-500 ls-minus-3px text-dark-gray mb-50px lg-mb-30px">85%</h2>
                <span className="fs-20 fw-500 d-block mb-5px text-dark-gray">Empowering startup success</span>
                <p>We help startups turn bold ideas into scalable and market success.</p>
              </div>
              <div className="col text-center p-70px xl-p-50px lg-p-40px sm-p-30px last-paragraph-no-margin">
                <h2 className="h1 fw-500 ls-minus-3px text-dark-gray mb-50px lg-mb-30px">25+</h2>
                <span className="fs-20 fw-500 d-block mb-5px text-dark-gray">Winning formula for startups</span>
                <p>Empowering early-stage businesses with tools that drive real success.</p>
              </div>
            </div>
          </div>
        </section>

        <Pricing />
        <FAQ />

        {/* Social Icons Section */}
        <section className="p-0">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 elements-social social-icon-style-11">
                <ul className="fs-18 dark border-top border-color-transparent-dark-very-light" data-anime='{ "el": "childs", "translateX": [-30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                  <li><a className="facebook" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><span className="fw-500">Facebook</span><i className="feather icon-feather-arrow-up-right text-base-color ms-5px"></i></a></li>
                  <li><a className="twitter" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><span className="fw-500">Twitter</span><i className="feather icon-feather-arrow-up-right text-base-color ms-5px"></i></a></li>
                  <li><a className="dribbble" href="http://www.dribbble.com" target="_blank" rel="noopener noreferrer"><span className="fw-500">Dribbble</span><i className="feather icon-feather-arrow-up-right text-base-color ms-5px"></i></a></li>
                  <li><a className="instagram" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><span className="fw-500">Instagram</span><i className="feather icon-feather-arrow-up-right text-base-color ms-5px"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

