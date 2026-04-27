import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/sections/Services";
import Image from "next/image";

export const metadata = {
  title: "Our Services",
  description: "Explore the wide range of digital services offered by Adlyngo, including branding, performance ads, and website design.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Page Title Section */}
        <section className="pb-0 top-space-margin position-relative">
          <div className="container page-title-extra-large position-relative">
            <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-xxl-9 col-xl-10 text-center text-lg-start">
                <h2 className="text-dark-gray mb-6">Offering digital services with aesthetic precision.</h2>
              </div>
            </div>
            <div className="row align-items-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-md-5 text-center text-md-end md-mb-15px">
                <h1 className="text-uppercase text-white bg-base-color border-radius-30px ps-25px pe-25px pt-10px pb-10px d-inline-block mb-0">Our services</h1>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5 last-paragraph-no-margin text-center text-md-start">
                <p className="lh-26 w-90 sm-w-100">Partnering for powerful and effective brand solutions.</p>
              </div>
            </div>
          </div>
          <Image 
            className="position-absolute left-30px top-130px z-index-minus-2 w-25 h-auto" 
            src="/images/demo-branding-studio-bg-01.jpg" 
            alt="Background Pattern" 
            width={400} 
            height={400} 
          />
        </section>

        {/* Hero Image Section */}
        <section className="pt-0 position-relative overflow-hidden">
          <div className="one-third-screen lg-h-600px sm-h-350px skrollr-parallax magic-cursor round-cursor mx-auto border-radius-15px lg-no-border-radius" data-bottom-top="width: 54%" data-center-top="width: 92%;" data-parallax-background-ratio="0.5" style={{ backgroundImage: "url('/images/generic-1920x1100.jpg')" }}></div>
        </section>

        {/* Main Services Grid */}
        <section className="py-5">
           <Services />
        </section>

        {/* Process Section */}
        <section className="pt-30px">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 md-mb-50px">
                <div className="position-sticky top-50px" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                  <div className="fs-11 lh-26 fw-500 text-uppercase text-white bg-base-color border-radius-30px ps-15px pe-15px mb-20px d-inline-block">Discover our process</div>
                  <h2 className="fw-500 text-dark-gray mb-40px">We craft indelible digital <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">experience<span><Image src="/images/highlight-separator-11.svg" alt="Highlight" width={200} height={20} /></span></span> via best services.</h2>
                  <a href="/contact" className="btn border-1 btn-transparent-light-gray btn-box-shadow btn-large fw-500 btn-rounded left-icon btn-switch-text mt-auto">
                    <span>
                      <span><i className="feather icon-feather-mail"></i></span>
                      <span className="btn-double-text" data-text="Let's talk - Send a message">Let's talk - Send a message</span>
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-lg-6 offset-lg-1 pe-70px lg-pe-15px">
                <div className="feature-box feature-box-left-icon last-paragraph-no-margin border-bottom border-color-extra-medium-gray pb-40px mb-40px">
                  <div className="feature-box-icon">
                    <Image src="/images/demo-branding-studio-services-icon-01.svg" alt="Research Icon" width={50} height={50} />
                  </div>
                  <div className="feature-box-content">
                    <span className="fs-20 fw-500 d-inline-block text-dark-gray mb-5px">Research and strategy</span>
                    <p className="w-90 lg-w-100">We dive deep into market insights to shape effective strategies tailored to your goals.</p>
                  </div>
                </div>
                <div className="feature-box feature-box-left-icon last-paragraph-no-margin border-bottom border-color-extra-medium-gray pb-40px mb-40px">
                  <div className="feature-box-icon">
                    <Image src="/images/demo-branding-studio-services-icon-02.svg" alt="Wireframe Icon" width={50} height={50} />
                  </div>
                  <div className="feature-box-content">
                    <span className="fs-20 fw-500 d-inline-block text-dark-gray mb-5px">Create wireframe</span>
                    <p className="w-90 lg-w-100">Wireframes map the user journey and layout before development begins.</p>
                  </div>
                </div>
                <div className="feature-box feature-box-left-icon last-paragraph-no-margin border-bottom border-color-extra-medium-gray pb-40px mb-40px">
                  <div className="feature-box-icon">
                    <Image src="/images/demo-branding-studio-services-icon-03.svg" alt="Scale Icon" width={50} height={50} />
                  </div>
                  <div className="feature-box-content">
                    <span className="fs-20 fw-500 d-inline-block text-dark-gray mb-5px">Development and scale</span>
                    <p className="w-90 lg-w-100">We build robust digital solutions designed to scale with your business.</p>
                  </div>
                </div>
                <div className="feature-box feature-box-left-icon last-paragraph-no-margin">
                  <div className="feature-box-icon">
                    <Image src="/images/demo-branding-studio-services-icon-04.svg" alt="Launch Icon" width={50} height={50} />
                  </div>
                  <div className="feature-box-content">
                    <span className="fs-20 fw-500 d-inline-block text-dark-gray mb-5px">Launch and go-live</span>
                    <p className="w-90 lg-w-100">We ensure a smooth launch and a successful go-live experience.</p>
                  </div>
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
