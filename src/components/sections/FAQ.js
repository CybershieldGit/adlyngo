export default function FAQ() {
  const faqs = [
    {
      q: "How long does a typical web design project take?",
      a: "Most of our custom website projects take between 4 to 8 weeks, depending on the complexity, number of pages, and how quickly we receive feedback and content from your team."
    },
    {
      q: "Do you work with startups or only established brands?",
      a: "We work with businesses of all sizes! From ambitious startups looking for their first brand identity to established enterprises needing a complete digital overhaul, our strategies are tailored to your specific scale and goals."
    },
    {
      q: "How do you measure the success of a marketing campaign?",
      a: "We believe in data-driven results. We set clear KPIs at the start of any campaign, such as conversion rate, cost per acquisition (CPA), and return on ad spend (ROAS). We provide regular, transparent reporting so you always know how your investment is performing."
    },
    {
      q: "Do you offer ongoing support after a website launches?",
      a: "Absolutely. We offer maintenance and support retainers to ensure your website remains secure, updated, and optimized. We also provide training so your team can manage basic content updates if desired."
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <span className="fs-18 text-base-color fw-600 mb-5px d-block text-uppercase">Got Questions?</span>
            <h2 className="text-dark-gray fw-600 ls-minus-1px">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion accordion-style-02" id="accordion-faq" data-active-icon="icon-feather-minus" data-inactive-icon="icon-feather-plus">
              {faqs.map((faq, index) => (
                <div key={index} className={`accordion-item ${index === 0 ? 'active-accordion' : ''} mb-15px border-radius-5px box-shadow-small border-0`}>
                  <div className="accordion-header bg-white border-radius-5px">
                    <a href="#" data-bs-toggle="collapse" data-bs-target={`#accordion-faq-0${index + 1}`} aria-expanded={index === 0 ? "true" : "false"} data-bs-parent="#accordion-faq">
                      <div className="accordion-title mb-0 position-relative text-dark-gray fw-600 pe-30px p-20px">
                        <span>{faq.q}</span>
                        <i className={`feather ${index === 0 ? 'icon-feather-minus' : 'icon-feather-plus'} fs-20 position-absolute right-20px top-50 translate-middle-y`}></i>
                      </div>
                    </a>
                  </div>
                  <div id={`accordion-faq-0${index + 1}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#accordion-faq">
                    <div className="accordion-body last-paragraph-no-margin bg-white border-radius-bottom-5px p-20px pt-0">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
