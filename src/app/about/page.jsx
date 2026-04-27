import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Stats from "@/components/sections/Stats";

export const metadata = {
  title: "About Us",
  description: "Learn more about Adlyngo, a premium digital creative agency based in Greater Noida. We empower brands through strategic design and digital marketing.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Page Title Section */}
        <section className="pb-0 top-space-margin position-relative">
          <div className="container page-title-extra-large position-relative">
            <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-xxl-9 col-xl-10 text-center text-lg-start">
                <h2 className="text-dark-gray mb-6">Empowering brands through creative thinking.</h2>
              </div>
            </div>
            <div className="row align-items-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-md-5 text-center text-md-end md-mb-15px">
                <h1 className="text-uppercase text-white bg-base-color border-radius-30px ps-25px pe-25px pt-10px pb-10px d-inline-block mb-0">About studio</h1>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5 last-paragraph-no-margin text-center text-md-start">
                <p className="lh-26 w-90 sm-w-100">Collaborate to create stronger, smarter branding strategies.</p>
              </div>
            </div>
            <div className="position-absolute right-minus-120px xxl-right-0px xl-right-30px bottom-minus-180px z-index-1 d-none d-md-flex flex-column align-items-center justify-content-center">
              <img src="/images/demo-branding-studio-about-01.png" className="position-absolute" alt="" />
              <img src="/images/demo-branding-studio-about-02.png" className="animation-rotation" alt="" />
            </div>
          </div>
          <img className="position-absolute left-30px top-130px z-index-minus-2 w-25" src="/images/demo-branding-studio-bg-01.jpg" alt="" data-bottom-top="transform:scale(0.5, 0.5)" data-top-bottom="transform:scale(1.2, 1.2)" />
        </section>

        {/* Branding Slogan Section */}
        <section className="pt-50px overflow-hidden">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 text-center opacity-8">
                <div 
                  className="fs-200 lh-200 lg-fs-200 sm-w-100 ls-minus-3px text-gradient-light-gray-white text-white-space-nowrap" 
                  data-bottom-top="transform: translate3d(-50px, 0px, 0px);" 
                  data-top-bottom="transform: translate3d(50px, 0px, 0px);"
                >
                  creative digital agency
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image Parallax */}
        <section className="pt-0 position-relative overflow-hidden">
          <div className="one-third-screen lg-h-600px sm-h-350px skrollr-parallax magic-cursor round-cursor mx-auto border-radius-15px lg-no-border-radius" data-bottom-top="width: 54%" data-center-top="width: 92%;" data-parallax-background-ratio="0.5" style={{ backgroundImage: "url('/images/generic-1920x1100.jpg')" }}></div>
        </section>

        {/* About Experience Section */}
        <section className="py-0">
          <div className="container">
            <div className="row align-items-center mb-6 sm-mb-50px">
              <div className="col-xl-5 col-lg-5 md-mb-50px sm-mb-30px text-center text-md-start">
                <h2 className="fw-500 text-dark-gray mb-0">We are a creative bold digital agency based in <span className="highlight-separator mb-0 pb-0" data-shadow-animation="true" data-animation-delay="500">Greater Noida.<span><img src="/images/highlight-separator-08.svg" alt="" /></span></span></h2>
              </div>
              <div className="col-xl-6 col-lg-7 offset-xl-1 last-paragraph-no-margin">
                <div className="row align-items-center">
                  <div className="col-xl-6 col-lg-6 col-md-5 position-relative atropos transform-3d sm-mb-30px text-center text-md-start text-lg-center" data-anime='{ "el": "childs", "translateY": [0, 0],"scale": [1.1, 1],"opacity": [0,1], "duration": 500, "delay": 200, "staggervalue": 300, "easing": "easeInSine" }'>
                    <div className="atropos d-inline-block" data-atropos data-atropos-perspective="500">
                      <div className="atropos-scale">
                        <div className="atropos-rotate">
                          <div className="atropos-inner text-center overflow-visible">
                            <div data-atropos-offset="-5" className="position-relative">
                              <span className="w-250px h-250px rounded-circle d-flex align-items-center justify-content-center bg-dark-gray bg-sliding-line-dark-gray">
                                <span className="fs-130 fw-600 ls-minus-6px text-white d-flex w-100 justify-content-center">12<sub className="fs-50">+</sub></span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-7 text-center text-md-start" data-anime='{ "el": "childs", "translateY": [-15, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
                    <span className="fs-18 lh-32 fw-500 text-dark-gray d-block mb-5px">12+ years of experience.</span>
                    <p>We are dedicated to providing outstanding digital and design services that meet your functional needs and aesthetic desires.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Stats />

            <div className="row mt-4 md-mt-50px pb-5">
              <div className="col-12 text-center">
                <span className="fs-20 text-dark-gray">Let's make something great work together. <a href="/contact" className="text-dark-gray text-dark-gray-hover text-decoration-line-bottom border-2 border-color-dark-gray fw-500">Got a project in mind?</a></span>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="position-relative overflow-hidden py-0">
          <div className="container-fluid p-0">
            <div className="row g-0 position-relative">
              <div className="col-12 marquee-rotate-down">
                <div className="swiper swiper-width-auto text-center bg-base-color pt-10px pb-10px outside-box-right-1 outside-box-left-1" data-slider-options='{ "slidesPerView": "auto", "spaceBetween":40, "centeredSlides": true, "speed": 20000, "loop": true, "pagination": { "el": ".slider-four-slide-pagination-2", "clickable": false }, "allowTouchMove": false, "autoplay": { "delay":1, "disableOnInteraction": false }, "navigation": { "nextEl": ".slider-four-slide-next-2", "prevEl": ".slider-four-slide-prev-2" }, "keyboard": { "enabled": true, "onlyInViewport": true }, "effect": "slide" }'>
                  <div className="swiper-wrapper marquee-slide">
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-white pt-10px pb-10px">Building brands with soul and strategy.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-white pt-10px pb-10px">Designing memorable brands that connect.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-white pt-10px pb-10px">Branding solutions that drive growth.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-white pt-10px pb-10px">Smart branding for the modern world.</div></div>
                  </div> 
                </div>
              </div>                    
              <div className="col-12 marquee-rotate-up z-index-minus-1">
                <div className="swiper swiper-width-auto text-center bg-extra-medium-gray pt-10px pb-10px outside-box-right-1 outside-box-left-1" data-slider-options='{ "slidesPerView": "auto", "spaceBetween":40, "centeredSlides": true, "speed": 20000, "loop": true, "pagination": { "el": ".slider-four-slide-pagination-2", "clickable": false }, "allowTouchMove": false, "autoplay": { "delay":1, "disableOnInteraction": false, "reverseDirection": true }, "navigation": { "nextEl": ".slider-four-slide-next-2", "prevEl": ".slider-four-slide-prev-2" }, "keyboard": { "enabled": true, "onlyInViewport": true }, "effect": "slide" }'>
                  <div className="swiper-wrapper marquee-slide">
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-dark-gray pt-10px pb-10px">Elevating brands through design thinking.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-dark-gray pt-10px pb-10px">Crafting identities that stand out.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-dark-gray pt-10px pb-10px">Where ideas become iconic brands.</div></div>
                    <div className="swiper-slide"><div className="fs-60 fw-300 text-dark-gray pt-10px pb-10px">Creating cohesive brand experiences.</div></div>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center mb-35px sm-mb-0">
              <div className="col-lg-7 text-center">
                <div className="fs-11 lh-26 fw-500 text-uppercase text-white bg-base-color border-radius-30px ps-15px pe-15px mb-20px d-inline-block">Valuable clients</div>
                <h2 className="fw-500 text-dark-gray">Trusted by leading <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">reputed companies.<span><img src="/images/highlight-separator-05.svg" alt="" /></span></span></h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-lg-4 row-cols-md-4 row-cols-sm-2 clients-style-04">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="col text-center border-end border-bottom border-color-transparent-dark-very-light pt-8 pb-8">
                  <div className="client-box">
                    <img src={`/images/demo-branding-studio-client-0${i}.svg`} className="h-40px" alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
