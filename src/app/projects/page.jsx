import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProjectsPage() {
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
                <h1 className="text-uppercase text-white bg-base-color border-radius-30px ps-25px pe-25px pt-10px pb-10px d-inline-block mb-0">Latest projects</h1>
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

        {/* Marquee Section */}
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

        {/* Projects Grid Section */}
        <section className="ps-4 pe-4 xxl-ps-2 xxl-pe-2 lg-ps-15px lg-pe-15px md-ps-0 md-pe-0 pt-0 position-relative overflow-hidden mb-5">
          <div className="container-fluid">
            <div className="position-relative z-index-2">
              <div className="row mb-30px md-mb-0">
                <div className="col-lg-5 col-md-4">
                  <ul className="portfolio-transform portfolio-wrapper grid-loading grid grid-4col xxl-grid-4col xl-grid-4col lg-grid-4col md-grid-2col sm-grid-2col xs-grid-1col gutter-large">
                    <li className="grid-sizer"></li>
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 0 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x920.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Studio cascade</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-3 col-md-4 align-self-end">
                   <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 200 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x735.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Velvet frame</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-4">
                  <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 400 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x735.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Echo house</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row mb-30px md-mb-0">
                <div className="col-lg-7 offset-lg-2">
                  <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 100 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-1410x850.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Urban nest</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row">
                 <div className="col-lg-3 col-md-4">
                  <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 0 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x850.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Atlas house</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-4 align-self-end">
                   <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 200 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x735.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Horizon edge</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-5 col-md-4">
                  <ul className="portfolio-transform portfolio-wrapper grid-loading grid gutter-large">
                    <li className="grid-item grid-item-single selected" data-anime='{ "effect": "slide", "direction": "tb", "color": "#151515", "duration": 1000, "delay": 400 }'>
                      <div className="portfolio-box mousetip-wrapper">
                        <a href="#">
                          <div className="portfolio-image overflow-hidden">
                            <img src="/images/generic-735x920.jpg" alt="" />
                          </div>
                          <div className="caption bg-white border-radius-100px">
                            <span className="text-dark-gray fs-24 px-4 py-2 d-inline-block">Timber palette</span>
                          </div>
                        </a>             
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
