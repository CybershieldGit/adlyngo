"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CaseStudies() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cases = [
    { id: "tab_four1", title: "Bold Ecommerce Brand", img: "/images/case-study-1.jpg", active: true },
    { id: "tab_four2", title: "Tech Startup Identity", img: "/images/case-study-2.jpg", active: false },
    { id: "tab_four3", title: "Fintech Ad Campaign", img: "/images/case-study-3.jpg", active: false },
    { id: "tab_four4", title: "Real Estate Web Design", img: "/images/case-study-4.jpg", active: false },
  ];

  return (
    <section className="py-0 ps-6 pe-6 xl-ps-3 xl-pe-3 md-ps-0 md-pe-0 position-relative overflow-hidden" suppressHydrationWarning>
      <div 
        className="bg-base-color h-100 position-absolute top-0 start-0 z-index-minus-1 lg-w-100" 
        data-bottom-top="width:10%" 
        data-center-top="width:100%;"
      ></div>
      <div className="container-fluid">
        <div className="row justify-content-end g-0 flex-row-reverse">
          <div className="col-xl-5 col-lg-6 pt-7 pb-7 md-pb-5 sm-pt-50px sm-pb-50px tab-style-09 d-flex justify-content-between flex-column border-start md-border-start-0 border-color-transparent-white-very-light">
            <div className="ps-12 md-ps-4 sm-ps-0 pb-10 md-pb-5 position-relative z-index-9 text-center text-md-start">
              <span className="fs-24 lh-30 text-white">
                Crafting unique<br />
                <span className="highlight-separator pb-0" data-shadow-animation="true" data-animation-delay="1500">
                  digital success.
                  <span>
                    <Image 
                      src="/images/highlight-separator-05-white.svg" 
                      alt="Highlight" 
                      width={200} 
                      height={20} 
                    />
                  </span>
                </span>
              </span>
              <ul className="nav nav-tabs border-0 flex-column align-items-start justify-content-start fs-45 lg-fs-30 mt-9 md-mt-5" role="tablist">
                {cases.map((c) => (
                  <li key={c.id} className="nav-item p-0 mb-20px lg-mb-10px" role="presentation">
                    <a 
                      data-bs-toggle="tab" 
                      href={`#${c.id}`} 
                      className={`nav-link ${c.active ? 'active' : ''}`} 
                      role="tab" 
                      aria-selected={c.active ? "true" : "false"} 
                      tabIndex={c.active ? "0" : "-1"}
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-top border-color-transparent-white-very-light ps-12 md-ps-4 sm-ps-0 text-center text-md-start">
              <span className="fs-20 d-block fw-500 mb-10px text-white pt-10 md-pt-5 sm-pt-30px">Featured Case Studies</span>
              <p className="text-white opacity-6 w-70 xxl-w-100 mb-0">We blend strategy, creativity, and emotion to craft narratives that are uniquely yours - stories that spark engagement and leave a lasting impression.</p>
            </div>
          </div>
          <div className="col-12 col-lg-6 pe-7 pt-7 pb-7 md-pt-0 md-ps-4 md-pe-4 sm-ps-0 sm-pe-0 sm-pb-50px">
            <div className="tab-content">
              {cases.map((c) => (
                <div 
                  key={c.id} 
                  className={`tab-pane interactive-banner-style-01 fade in ${c.active ? 'active show' : ''}`} 
                  id={c.id} 
                  role="tabpanel"
                >
                  <figure className="m-0 position-relative hover-box border-radius-15px overflow-hidden parallax-hover">
                    <Image 
                      className="w-100" 
                      src={c.img} 
                      alt={c.title} 
                      width={800} 
                      height={600} 
                    />
                    <div className="position-absolute top-0px left-0px w-100 h-100 bg-gradient-dark-transparent opacity-2"></div>
                    <figcaption className="w-100 h-100 d-flex flex-column align-items-center p-40px">
                      <div className="position-relative d-flex flex-column h-100 z-index-1">
                        <Link href="/projects" className="d-flex justify-content-center align-items-center mx-auto mt-auto icon-box w-90px h-90px rounded-circle bg-white box-shadow-quadruple-large">
                          <i className="bi bi-arrow-right-short text-dark-gray icon-medium lh-0px"></i>
                        </Link>
                        <Link href="/projects" className="text-white d-block mt-auto text-decoration-none">Discover case study</Link>
                      </div>
                      <div className="box-overlay bg-gradient-black-bottom-transparent"></div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
