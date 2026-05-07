'use client';

import { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

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

  const toggleAccordion = (e, index) => {
    e.preventDefault();
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-100px lg-py-80px sm-py-50px bg-very-light-gray">
      <div className="container">
        <div className="row justify-content-center mb-50px">
          <div className="col-lg-7 text-center">
            <span className="fs-18 text-base-color fw-600 mb-10px d-block text-uppercase">Got Questions?</span>
            <h2 className="text-dark-gray fw-700 ls-minus-2px mb-0">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion accordion-style-02" id="accordion-faq">
              {faqs.map((faq, index) => {
                const isActive = activeIndex === index;
                return (
                  <div key={index} className={`accordion-item ${isActive ? 'active-accordion' : ''} mb-20px border-radius-10px box-shadow-small border-0 overflow-hidden`}>
                    <div className="accordion-header bg-white p-0">
                      <a href="#" onClick={(e) => toggleAccordion(e, index)} aria-expanded={isActive} className="d-block text-decoration-none">
                        <div className="accordion-title mb-0 position-relative text-dark-gray fw-600 ps-40px pe-100px py-25px fs-19">
                          <span>{faq.q}</span>
                          <i 
                            className={`feather ${isActive ? 'icon-feather-minus' : 'icon-feather-plus'} fs-20 position-absolute top-50 translate-middle-y text-base-color`}
                            style={{ right: '50px' }}
                          ></i>
                        </div>
                      </a>
                    </div>
                    <div className={`accordion-collapse collapse ${isActive ? 'show' : ''}`}>
                      <div className="accordion-body last-paragraph-no-margin bg-white ps-40px pe-40px pb-30px pt-0">
                        <p className="opacity-8">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
