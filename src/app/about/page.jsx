import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Stats from "@/components/sections/Stats";
import Image from "next/image";

export const metadata = {
  title: "About Adlyngo - Premium Digital Creative Agency",
  description: "Learn more about Adlyngo, a premium digital creative agency based in Greater Noida. We empower brands through strategic design, performance ads, and digital marketing excellence.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="pb-0 top-space-margin position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-10" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 200, "easing": "easeOutQuad" }'>
                <span className="fs-14 fw-600 text-base-color text-uppercase ls-2px d-block mb-10px">The Adlyngo Story</span>
                <h1 className="text-dark-gray fw-700 ls-minus-2px mb-0 w-90 xl-w-100">We build <span className="text-base-color">brands</span> that <span className="text-base-color">matter</span> in the digital age.</h1>
              </div>
            </div>

            <div className="row g-0 border-radius-20px overflow-hidden box-shadow-extra-large mb-5" data-anime='{ "opacity": [0,1], "duration": 1000, "delay": 400, "easing": "easeOutQuad" }'>
              <div className="col-12">
                <div className="position-relative h-600px lg-h-450px sm-h-300px">
                  <Image
                    src="/images/about_hero_image_1778242953770.png"
                    alt="Adlyngo Studio"
                    fill
                    className="object-fit-cover"
                    priority
                  />
                  <div className="position-absolute bottom-0 left-0 w-100 p-5 bg-gradient-transparent-dark-70">
                    <div className="row align-items-end">
                      <div className="col-md-8 text-white">
                        <h3 className="fw-600 mb-0">Based in Greater Noida, delivering globally.</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-5 bg-very-light-gray">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-10 text-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 200, "easing": "easeOutQuad" }'>
                <h2 className="fw-700 text-dark-gray mb-30px">Our Mission</h2>
                <p className="fs-22 lh-40 text-dark-gray opacity-7 w-80 mx-auto">
                  At Adlyngo, our mission is to empower startups and modern brands by bridging the gap between innovative design and performance marketing. We don't just create visuals; we craft experiences that drive growth and build lasting brand equity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Services/Values Section */}
        <section className="pb-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 md-mb-50px" data-anime='{ "opacity": [0,1], "duration": 800, "delay": 200, "easing": "easeOutQuad" }'>
                <div className="position-relative">
                  <Image
                    src="/images/creative_process_image_1778242973318.png"
                    alt="Creative Process"
                    width={600}
                    height={600}
                    className="border-radius-20px box-shadow-extra-large"
                  />
                  <div className="position-absolute -right-30px -bottom-30px d-none d-md-block" data-anime='{ "translateY": [-30, 0], "opacity": [0,1], "duration": 1000, "delay": 800, "easing": "easeOutQuad" }'>
                    <div className="bg-white p-4 border-radius-15px box-shadow-large">
                      <h4 className="fw-700 text-dark-gray mb-0 ls-minus-1px">4.9/5</h4>
                      <p className="mb-0 fs-14 text-muted">Customer Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 offset-lg-1" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 400, "staggervalue": 200, "easing": "easeOutQuad" }'>
                <h2 className="fw-700 text-dark-gray ls-minus-1px mb-35px">Why Adlyngo?</h2>

                <ul className="ps-0">
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Results-focused marketing approach
                  </li>
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Creative + performance under one roof
                  </li>
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Premium visuals that increase trust
                  </li>
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Growth strategies tailored for your niche
                  </li>
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Affordable startup-friendly plans
                  </li>
                  <li className="d-flex align-items-center mb-15px text-dark-gray fw-500">
                    <i className="bi bi-check-circle-fill text-base-color me-10px fs-18"></i>
                    Fast communication & execution
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="bg-dark-gray py-5 text-white overflow-hidden">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-7 mb-4 mb-lg-0" data-anime='{ "opacity": [0,1], "duration": 800, "delay": 200, "easing": "easeOutQuad" }'>
                <div className="mb-30px">
                  <h2 className="fw-700 mb-0 ls-minus-1px text-uppercase">What Makes Us <br />Different?</h2>
                </div>

                <ul className="ps-0">
                  <li className="d-flex align-items-center mb-20px fw-500 fs-18">
                    <i className="bi bi-check-circle-fill text-base-color me-15px fs-20"></i>
                    Demo website options available
                  </li>
                  <li className="d-flex align-items-center mb-20px fw-500 fs-18">
                    <i className="bi bi-check-circle-fill text-base-color me-15px fs-20"></i>
                    Affordable first creative/video offers
                  </li>
                  <li className="d-flex align-items-center mb-20px fw-500 fs-18">
                    <i className="bi bi-check-circle-fill text-base-color me-15px fs-20"></i>
                    Performance-driven marketing approach
                  </li>
                  <li className="d-flex align-items-center mb-20px fw-500 fs-18">
                    <i className="bi bi-check-circle-fill text-base-color me-15px fs-20"></i>
                    Focus on quality leads, not random traffic
                  </li>
                  <li className="d-flex align-items-center mb-20px fw-500 fs-18">
                    <i className="bi bi-check-circle-fill text-base-color me-15px fs-20"></i>
                    Strategy + content + ads under one roof
                  </li>
                </ul>
              </div>
              <div className="col-lg-4 offset-lg-1 d-none d-lg-block" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 400, "easing": "easeOutQuad" }'>
                <div className="position-relative">
                  <Image
                    src="/images/different_section_image_1778244663487.png"
                    alt="What Makes Us Different"
                    width={400}
                    height={600}
                    className="border-radius-20px box-shadow-extra-large"
                  />
                </div>
              </div>
            </div>

            <div className="row" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 600, "easing": "easeOutQuad" }'>
              <div className="col-12">
                <div className="p-4 p-md-5 border-radius-20px bg-white-transparent-1 border border-color-transparent-white-light position-relative text-center">
                  <i className="bi bi-quote fs-60 text-base-color opacity-3 position-absolute top-20px left-20px d-none d-md-block"></i>
                  <h4 className="fw-600 mb-0 lh-45 d-inline-block ls-minus-1px">
                    We don't bring you more leads. We bring you the <span className="text-base-color fw-700 text-decoration-line-bottom border-2 border-color-base-color">right ones.</span>
                  </h4>
                  <i className="bi bi-quote fs-60 text-base-color opacity-3 position-absolute bottom-20px right-20px rotate-180 d-none d-md-block"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <Stats />

        {/* Process Section */}
        <section className="bg-dark-gray py-5 text-white overflow-hidden">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-7 text-center">
                <h2 className="fw-700 mb-0">Our Creative Process</h2>
              </div>
            </div>
            <div className="row g-4">
              {[
                { step: "01", title: "Discovery", desc: "We deep dive into your brand, audience, and goals." },
                { step: "02", title: "Strategy", desc: "Crafting a roadmap for success based on research." },
                { step: "03", title: "Execution", desc: "Bringing the vision to life with world-class design." },
                { step: "04", title: "Optimization", desc: "Testing and refining for the best possible results." }
              ].map((item, idx) => (
                <div key={idx} className="col-lg-3 col-md-6" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 200, "easing": "easeOutQuad" }'>
                  <div className="p-4 border border-color-transparent-white-light border-radius-15px h-100 transition-all hover-bg-base-color group">
                    <span className="fs-40 fw-700 opacity-2 group-hover-opacity-5 mb-20px d-block">{item.step}</span>
                    <h4 className="fw-600 mb-10px">{item.title}</h4>
                    <p className="opacity-7 mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5">
          <div className="container text-center">
            <h2 className="fw-700 text-dark-gray mb-30px">Ready to scale your brand?</h2>
            <a href="/contact" className="btn btn-dark-gray btn-large btn-rounded btn-box-shadow px-5">Get Started with Adlyngo</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
