import Image from "next/image";

export default function AboutSection() {
  return (
    <section>
      <div className="container">
        <div className="row justify-content-center justify-content-xl-start">
          <div className="col-xl-4 col-lg-10 d-flex align-items-xl-start align-items-center flex-column lg-mb-50px text-center text-xl-start">
            <div className="fs-11 lh-26 fw-500 text-uppercase text-white bg-base-color border-radius-30px ps-15px pe-15px mb-20px d-inline-block" data-anime='{"translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>who we are</div>
            <h2 className="fw-500 text-dark-gray mb-25px" data-anime='{"translateY": [30, 0], "perspective": [400,400], "scale": [1.1, 1], "rotateX": [-80, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              We're a creative digital <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">agency.<span><Image src="/images/highlight-separator-02.svg" alt="Highlight" width={200} height={20} /></span></span>
            </h2>
            <p data-anime='{"el": "lines", "translateY": [30, 0], "perspective": [400,400], "scale": [1.1, 1], "rotateX": [-80, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
              We are excited for our work and how it positively impacts clients. With over 12 years of experience have been constantly providing excellent.
            </p>
            <div className="mt-auto" data-anime='{"translateY": [30, 0], "opacity": [0,1], "duration": 1200, "delay": 800, "staggervalue": 300, "bounce": "easeOutQuad" }'>
              <Image className="mb-5px" src="/images/logo-awwards.svg" alt="Awards Logo" width={100} height={30} />
              <p className="mb-0"><span className="text-dark-gray">Awards</span> - Site of the day 2025</p>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 offset-xl-1 sm-mb-30px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <Image 
              className="border-radius-15px w-100 h-auto" 
              src="/images/generic-224x360.jpg" 
              alt="About Showcase" 
              width={224} 
              height={360} 
            />
            <div className="d-block bg-base-color ps-15 pt-16 pb-13 sm-p-10 border-radius-15px mt-30px text-center text-md-start">
              <span className="fs-80 lh-80 fw-500 text-white ls-minus-3px">28<sup className="top-minus-40px fs-40">+</sup></span>
              <span className="text-white lh-20 d-inline-block sm-w-100">Years of trusted experience.</span>
            </div>
          </div>
          <div className="col-xl-5 col-md-8" data-anime='{ "el": "childs", "translateY": [100, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>  
            <figure className="position-relative m-0">
              <Image 
                className="border-radius-15px w-100 h-auto" 
                src="/images/generic-600x600.jpg" 
                alt="About Hero" 
                width={600} 
                height={600} 
              />
              <figcaption className="position-absolute text-center border-radius-15px right-30px bottom-30px ps-30px pe-30px blur-box bg-white-transparent">
                <h2 className="fs-60 mx-auto mb-0 fw-600 text-dark-gray mt-20px">4.9</h2>
                <div className="text-base-color ls-2px lh-20">
                  <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                </div>
                <span className="text-dark-gray mb-20px d-inline-block">Verified score</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
