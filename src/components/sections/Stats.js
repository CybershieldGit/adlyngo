export default function Stats() {
  return (
    <section className="p-0 pe-4 ps-4 xxl-pe-2 xxl-ps-2 lg-pe-0 lg-ps-0 mt-8 sm-mt-50px border-bottom border-top border-color-transparent-dark-very-light overflow-hidden">
      <div className="container-fluid" data-anime='{ "perspective": [1200,1200], "scale": [1.1, 1], "rotateX": [-90, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 600, "easing": "easeOutQuad" }'>
        <div className="row row-cols-1 row-cols-xxl-4 row-cols-md-2">
          <div className="col pt-40px pb-40px ps-60px pe-60px xxl-ps-20px xxl-pe-20px border-end xs-border-end-0 xl-border-bottom border-color-transparent-dark-very-light">
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <h2 className="h1 fw-500 ls-minus-3px text-dark-gray flex-shrink-0 mb-0 me-15px md-me-0">92<sup className="top-minus-20px text-base-color">^</sup></h2>
              <span className="fs-20 fw-500 text-dark-gray d-block">93% Growth from last year 2024.</span>
            </div>
          </div>
          <div className="col pt-40px pb-40px ps-60px pe-60px xxl-ps-20px xxl-pe-20px border-end xl-border-end-0 xl-border-bottom border-color-transparent-dark-very-light">
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <h2 className="h1 fw-500 ls-minus-3px text-dark-gray flex-shrink-0 mb-0 me-15px md-me-0">98<sup className="top-minus-20px text-base-color">%</sup></h2>
              <span className="fs-20 fw-500 text-dark-gray d-block">Boost successful client call rates.</span>
            </div>
          </div>
          <div className="col pt-40px pb-40px ps-60px pe-60px xxl-ps-20px xxl-pe-20px border-end xs-border-end-0 xs-border-bottom border-color-transparent-dark-very-light">
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <h2 className="h1 fw-500 ls-minus-3px text-dark-gray flex-shrink-0 mb-0 me-15px md-me-0">3M<sup className="top-minus-20px text-base-color">+</sup></h2>
              <span className="fs-20 fw-500 text-dark-gray d-block">Active registered happy clients.</span>
            </div>
          </div>
          <div className="col pt-40px pb-40px ps-60px pe-60px xxl-ps-20px xxl-pe-20px">
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <h2 className="h1 fw-500 ls-minus-3px text-dark-gray flex-shrink-0 mb-0 me-15px md-me-0">12<sup className="top-minus-20px text-base-color">+</sup></h2>
              <span className="fs-20 fw-500 text-dark-gray d-block">We create top worldwide brands.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
