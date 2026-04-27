import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Adlyngo for branding, performance ads, and website design. Start a conversation about your next project today.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Page Title Section */}
        <section className="pb-0 top-space-margin position-relative">
          <div className="container page-title-extra-large position-relative">
            <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-xxl-9 col-xl-10 text-center text-lg-start">
                <h2 className="text-dark-gray mb-6">We'd love to hear from you, start a conversation.</h2>
              </div>
            </div>
            <div className="row align-items-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-md-5 text-center text-md-end md-mb-15px">
                <h1 className="text-uppercase text-white bg-base-color border-radius-30px ps-25px pe-25px pt-10px pb-10px d-inline-block mb-0">Contact studio</h1>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5 last-paragraph-no-margin text-center text-md-start">
                <p className="lh-26 w-90 sm-w-100">Collaborate to create stronger, smarter branding strategies.</p>
              </div>
            </div>
            <div className="position-absolute right-minus-120px xxl-right-0px xl-right-30px bottom-minus-180px z-index-1 d-none d-md-flex flex-column align-items-center justify-content-center">
              <Image 
                src="/images/demo-branding-studio-about-01.png" 
                className="position-absolute" 
                alt="About Icon 1" 
                width={100} 
                height={100} 
              />
              <Image 
                src="/images/demo-branding-studio-about-02.png" 
                className="animation-rotation" 
                alt="About Icon 2" 
                width={100} 
                height={100} 
              />
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

        {/* Start a Conversation Tagline */}
        <section className="pt-50px overflow-hidden">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 text-center opacity-8">
                <div 
                  className="fs-200 lh-200 lg-fs-200 sm-w-100 ls-minus-3px text-gradient-light-gray-white text-white-space-nowrap" 
                  data-bottom-top="transform: translate3d(-50px, 0px, 0px);" 
                  data-top-bottom="transform: translate3d(50px, 0px, 0px);"
                >
                  start a conversation
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image Parallax */}
        <section className="pt-0 position-relative overflow-hidden">
          <div className="one-third-screen lg-h-600px sm-h-350px skrollr-parallax magic-cursor round-cursor mx-auto border-radius-15px lg-no-border-radius" data-bottom-top="width: 54%" data-center-top="width: 92%;" data-parallax-background-ratio="0.5" style={{ backgroundImage: "url('/images/generic-1920x1100.jpg')" }}></div>
        </section>

        {/* Contact Info Pills */}
        <section className="p-0">
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 justify-content-center" data-anime='{ "el": "childs", "translateY": [0, 0], "opacity": [0,1], "duration": 300, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col sm-mb-30px text-center text-sm-start">
                <span className="fs-14 fw-500 text-uppercase d-block">Have questions?</span>
                <a href="mailto:info@adlyngo.com" className="fs-22 fw-500 text-dark-gray btn btn-link-gradient expand text-transform-none">info@adlyngo.com<span className="bg-dark-gray"></span></a>
              </div>
              <div className="col sm-mb-30px text-center text-sm-start">
                <span className="fs-14 fw-500 text-uppercase d-block">Join our team?</span>
                <a href="mailto:careers@adlyngo.com" className="fs-22 fw-500 text-dark-gray btn btn-link-gradient expand text-transform-none">careers@adlyngo.com<span className="bg-dark-gray"></span></a>
              </div>
              <div className="col text-center text-sm-start">
                <span className="fs-14 fw-500 text-uppercase d-block">Business inquiries?</span>
                <a href="mailto:hello@adlyngo.com" className="fs-22 fw-500 text-dark-gray btn btn-link-gradient expand text-transform-none">hello@adlyngo.com<span className="bg-dark-gray"></span></a>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="pt-4 lg-pt-65px pb-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-10" data-bottom-top="transform: translateY(50px)" data-top-bottom="transform: translateY(-50px)">
                <div>
                  <Image 
                    src="/images/generic-600x440.jpg" 
                    className="border-radius-4px w-100 h-auto" 
                    alt="Office Location" 
                    width={600} 
                    height={440} 
                  /> 
                </div>
                <div className="position-relative ps-40px pe-40px pt-50px lg-ps-25px lg-pe-25px sm-pt-35px">
                  <div className="fs-80 fw-700 text-uppercase text-dark-gray position-absolute top-minus-40px left-40px lg-left-25px">In</div>
                  <p className="mt-10px mb-15px lh-28 text-center text-lg-start">T3, B1603, NXOne, Tech Zone 4, Greater Noida, Uttar Pradesh, 201306</p>
                  <div className="d-block text-center text-lg-start">
                    <span className="text-dark-gray fw-500">Email:</span> 
                    <a href="mailto:info@adlyngo.com" className="text-decoration-line-bottom text-dark-gray text-dark-gray-hover">info@adlyngo.com</a>
                  </div>
                  <div className="d-block text-center text-lg-start">
                    <span className="text-dark-gray fw-500">Phone:</span> 
                    <a href="tel:+911234567890" className="text-dark-gray-hover">+91 123 456 7890</a>
                  </div>
                  <div className="text-dark-gray mt-20px text-center text-lg-start">
                    <a href="https://maps.google.com" target="_blank" className="btn border-1 btn-transparent-light-gray btn-medium btn-box-shadow btn-rounded btn-switch-text left-icon mt-auto">
                      <span>
                        <span><i className="feather icon-feather-map-pin"></i></span>
                        <span className="btn-double-text" data-text="View on google map">View on google map</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="ms-4 me-4 xxl-ms-2 xxl-me-2 xl-ms-0 xl-me-0 border-radius-15px lg-no-border-radius bg-seashell mb-6">
          <div className="container">
            <div className="row">
              <div className="col-xxl-4 col-lg-5 md-mb-50px sm-mb-30px" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                <div className="fs-11 lh-26 fw-500 text-uppercase text-white bg-base-color border-radius-30px ps-15px pe-15px mb-20px d-inline-block">Get in touch with us</div>
                <h2 className="fw-500 text-dark-gray mb-0">Let us help you get your project <span className="highlight-separator mb-0 pb-0 z-index-1" data-shadow-animation="true" data-animation-delay="500">started.<span><Image src="/images/highlight-separator-08.svg" alt="Highlight" width={200} height={20} /></span></span></h2>
              </div>
              <div className="col-md-7 offset-xxl-1">
                <form action="#" method="post" className="contact-form-style-07" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
                  <div className="position-relative form-group mb-30px d-flex flex-md-row flex-column">
                    <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">My name is</label>
                    <div className="position-relative col">
                      <span className="form-icon"><i className="bi bi-person icon-small"></i></span>
                      <input className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control required" type="text" name="name" placeholder="Enter your name here*" />
                    </div>
                  </div>
                  <div className="position-relative form-group mb-30px d-flex flex-md-row flex-column">
                    <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">Here is my email</label>
                    <div className="position-relative col">
                      <span className="form-icon"><i className="bi bi-envelope icon-small"></i></span>
                      <input className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control required" type="email" name="email" placeholder="Enter your email here*" />
                    </div>
                  </div>
                  <div className="position-relative form-group form-textarea d-flex flex-md-row flex-column"> 
                    <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">I need a</label>
                    <div className="position-relative col">
                      <textarea className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control" name="comment" placeholder="Enter your project details here" rows="3"></textarea>
                      <span className="form-icon"><i className="bi bi-chat-square-dots icon-small"></i></span>
                    </div>
                  </div>
                  <div className="row mt-40px align-items-center">
                    <div className="col-md-7 col-sm-7 lg-mb-30px md-mb-0">
                      <p className="fs-14 lh-22 text-center text-sm-start mb-0 ">We are committed to protecting your privacy. We will never collect information about you without your explicit consent.</p>
                    </div>
                    <div className="col-md-5 col-sm-5 text-center text-sm-end xs-mt-25px">
                      <button className="btn btn-dark-gray btn-medium btn-rounded btn-box-shadow d-inline-flex align-items-center submit" type="submit">Send message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
