import Image from "next/image";
import Link from "next/link";

export default function Services() {
  const serviceList = [
    { title: "Branding", desc: "We create iconic brand identities that capture your vision and resonate with your audience." },
    { title: "Social Media Marketing", desc: "Data-driven social strategies that build community, engagement, and lasting brand loyalty." },
    { title: "Performance Ads", desc: "Highly targeted advertising campaigns designed to maximize ROI and scale your growth." },
    { title: "Website Design", desc: "Premium, high-converting websites optimized for speed, performance, and user experience." },
    { title: "Content Creation", desc: "Compelling written and visual content that tells your brand story and engages audiences." },
    { title: "Video Editing", desc: "High-end video production and editing to bring your campaigns and content to life." },
    { title: "Creative Strategy", desc: "Innovative approaches to position your brand effectively within competitive markets." },
    { title: "Lead Generation", desc: "Strategies designed to attract, nurture, and convert high-quality leads for your business." }
  ];

  return (
    <section className="pt-0">
      <div className="container">
        <div className="row justify-content-center mb-45px md-mb-30px">
          <div className="col-xl-7 col-lg-8 text-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="fs-11 lh-26 fw-500 text-uppercase text-white bg-base-color border-radius-30px ps-15px pe-15px mb-20px d-inline-block">Agency services</div>
            <h2 className="fw-500 text-dark-gray">
              We help you to go online and <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">increase your sales.<span><Image src="/images/highlight-separator-03.svg" alt="Highlight" width={200} height={20} /></span></span>
            </h2>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 justify-content-center" data-anime='{ "el": "childs", "translateY": [20, 0], "opacity": [0,1], "duration": 600, "delay": 300, "staggervalue": 300, "easing": "easeOutQuad" }'>
          {serviceList.map((service, index) => (
            <div key={index} className="col services-box-style-08 premium-service-card md-mb-30px mb-30px">
              <div className="bg-gradient-misty-rose border-radius-15px position-relative overflow-hidden pe-40px ps-40px pt-40px pb-40px h-350px d-flex">
                <span className="bg-bright-turquoise h-400px w-400px border-radius-100 opacity-2 d-inline-block position-absolute left-minus-50px top-minus-70px z-index-0"></span>
                <div className="position-relative z-index-1 d-flex flex-column">
                  <Link href="/services" className="fs-22 fw-500 text-dark-gray d-block mb-10px text-decoration-none">{service.title}</Link>
                  <p className="w-100">{service.desc}</p>
                  <Link href="/services" className="mt-auto h-50px w-50px rounded-circle bg-base-color d-flex align-items-center justify-content-center box-shadow-large" aria-label={`Learn more about ${service.title}`}><i className="feather icon-feather-arrow-up-right fs-20 text-white"></i></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4 md-mt-50px">
          <div className="col-12 text-center" data-anime='{ "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
            <span className="fs-20 text-dark-gray">
              Let's make something great work together. <Link href="/contact" className="text-dark-gray text-dark-gray-hover text-decoration-line-bottom border-2 border-color-dark-gray fw-500">Got a project in mind?</Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
