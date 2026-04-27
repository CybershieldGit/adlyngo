export default function Hero() {
  return (
    <section className="p-0 top-space-margin pe-4 ps-4 xxl-pe-2 xxl-ps-2 lg-pe-0 lg-ps-0 lg-pt-70px md-pt-50px overflow-hidden">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-xxl-4 col-xl-5 col-lg-8 text-center text-xl-start" data-anime='{ "el": "childs", "opacity": [0, 1], "translateY": [100, 0], "staggervalue": 300, "duration": 1200, "easing": "easeOutCubic" }'>
            <h1 className="text-dark-gray ls-minus-3px mb-50px sm-mb-30px smooth-reveal">
              Where creativity meets <br />
              <span className="fw-700">
                measurable <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">
                  growth.
                  <span style={{ bottom: '-10px' }}>
                    <img src="/images/highlight-separator-02.svg" alt="" style={{ transform: 'scaleY(-1)' }} />
                  </span>
                </span>
              </span>
            </h1>
            <div className="d-flex align-items-center justify-content-center justify-content-xl-start flex-sm-row flex-column">
              <a href="/services" className="btn btn-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text left-icon xs-mb-30px">
                <span>
                  <span><i className="feather icon-feather-briefcase"></i></span>
                  <span className="btn-double-text" data-text="Explore services">Explore services</span>
                </span>
              </a>
              <a href="https://www.youtube.com/watch?v=cfXHhfNy7tU" className="position-relative d-inline-block text-center rounded-circle video-icon-box video-icon-medium popup-youtube ms-15px xs-ms-0" aria-label="video-link">
                <span className="video-icon border border-1 border-color-transparent-dark-very-light me-10px">
                  <i className="bi bi-play-fill text-base-color fs-24"></i>
                </span>
                <span className="fs-18 fw-500 text-dark-gray">View showreel</span>
              </a>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-3 col-md-7 position-relative text-center d-flex justify-content-center align-items-center lg-pt-50px" data-anime='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
            <img className="position-absolute top-25px z-index-minus-2 animation-rotation-slow sm-w-80" src="/images/demo-branding-studio-bg-01.jpg" alt="" />
            <img className="anti-gravity" src="/images/hero.png" alt="" />
            <div className="position-absolute right-30px xl-right-minus-50px md-right-0px bottom-150px d-md-flex flex-column align-items-center justify-content-center anti-gravity-slow">
              <img src="/images/demo-branding-studio-circle-01.png" className="position-absolute" alt="" />
              <img src="/images/demo-branding-studio-circle-02.png" className="animation-rotation" alt="" />
            </div>
          </div>
          <div className="col-xxl-3 col-xl-4 col-md-5 xl-pt-50px d-flex flex-column align-items-end" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
            <div className="d-flex align-items-end p-25px cover-background border-radius-15px h-200px w-300px sm-w-100 mb-20px" style={{ backgroundImage: "url('/images/generic-330x220.jpg')" }}>
              <div className="d-flex align-items-center">
                <a href="https://www.youtube.com/watch?v=cfXHhfNy7tU" className="position-relative d-inline-block text-center bg-white border border-2 border-color-white rounded-circle video-icon-box video-icon-medium popup-youtube" aria-label="video-link">
                  <span>
                    <span className="video-icon">
                      <i className="bi bi-play-fill text-base-color fs-24"></i>
                      <span className="video-icon-sonar">
                        <span className="video-icon-sonar-bfr bg-white opacity-9"></span>
                      </span>
                    </span>
                  </span>
                </a>
                <span className="fs-18 lh-22 fw-500 text-white ms-10px">Scaling your brand to new heights.</span>
              </div>
            </div>
            <div className="border-radius-15px bg-white w-300px sm-w-100 bg-white box-shadow-extra-large">
              <div className="d-flex align-items-center ps-25px pe-25px pt-20px pb-20px">
                <div>
                  <span className="d-block lh-18">Trusted by</span>
                  <span className="fs-18 fw-500 text-dark-gray d-block">Client review</span>
                </div>
                <div className="border-radius-30px text-white bg-base-color ps-15px pe-15px pt-2px pb-2px fs-18 lh-32 fw-500 ls-minus-1px d-inline-flex align-items-center ms-auto">
                  <i className="bi bi-star-fill fs-14 me-5px"></i>
                  <span className="flex-shrink-0">4.9</span>
                </div>
              </div>
              <div className="d-flex align-items-center pt-10px pb-10px ps-5px pe-5px border-top border-color-transparent-dark-very-light">
                <img src="/images/generic-170x90.jpg" alt="" />
                <div className="ms-5px">
                  <h5 className="fw-700 text-dark-gray mb-0">20K<sup>+</sup></h5>
                  <div className="fs-14 lh-16 text-dark-gray">Happy clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
