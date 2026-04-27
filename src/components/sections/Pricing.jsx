export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$999",
      desc: "Perfect for new brands looking to establish a digital presence.",
      features: ["Brand Identity Basics", "5 Pages Website Design", "Basic SEO Setup", "1 Month Support"],
      dark: false
    },
    {
      name: "Growth",
      price: "$2,499",
      desc: "Ideal for growing businesses needing comprehensive marketing.",
      features: ["Complete Brand Strategy", "E-commerce/Custom Website", "Advanced SEO & Content", "Performance Ads Setup"],
      dark: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$4,999",
      desc: "For large organizations requiring a full dedicated team.",
      features: ["Full Service Agency Access", "Custom Web Application", "Dedicated Account Manager", "Omnichannel Marketing"],
      dark: false
    }
  ];

  return (
    <section className="bg-very-light-gray py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-6 text-center">
            <span className="fs-18 text-base-color fw-600 mb-5px d-block text-uppercase">Transparent Pricing</span>
            <h2 className="text-dark-gray fw-600 ls-minus-1px">Choose your growth plan</h2>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 justify-content-center">
          {plans.map((plan, index) => (
            <div key={index} className="col md-mb-30px parallax-hover">
              <div className={`pricing-table ${plan.dark ? 'bg-dark-gray' : 'bg-white'} border-radius-15px box-shadow-large p-40px lg-p-30px text-center h-100 d-flex flex-column position-relative overflow-hidden`}>
                {plan.popular && (
                  <div className="position-absolute top-0 right-0 bg-base-color text-white fs-12 fw-600 text-uppercase ps-15px pe-15px py-5px border-bottom-left-radius">Popular</div>
                )}
                <span className={`fs-22 ${plan.dark ? 'text-white' : 'text-dark-gray'} fw-600 mb-15px d-block`}>{plan.name}</span>
                <h3 className={`${plan.dark ? 'text-white' : 'text-dark-gray'} mb-15px fw-700`}>{plan.price}<span className={`fs-16 fw-400 ${plan.dark ? 'opacity-6' : ''}`}>/mo</span></h3>
                <p className={`mb-30px ${plan.dark ? 'text-white opacity-7' : ''}`}>{plan.desc}</p>
                <ul className={`list-style-01 text-start mb-40px mt-auto ${plan.dark ? 'text-white' : ''}`}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className={`${fIndex !== plan.features.length - 1 ? (plan.dark ? 'border-bottom border-color-transparent-white-light' : 'border-bottom border-color-extra-light-gray') : ''} py-10px`}>
                      <i className="bi bi-check-circle-fill text-base-color me-10px"></i> {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`btn btn-medium ${plan.dark ? 'btn-white text-dark-gray' : 'btn-dark-gray'} btn-rounded btn-box-shadow mt-auto`}>
                  {plan.name === 'Enterprise' ? "Let's Talk" : "Get Started"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
