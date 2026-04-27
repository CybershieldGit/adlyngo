'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="ps-4 pe-4 xxl-pe-2 xxl-ps-2 lg-pe-0 lg-ps-0 cover-background sm-pt-50px sm-pb-50px" style={{ backgroundImage: "url('/images/demo-branding-studio-footer-bg-img.jpg')" }}>
      <div className="container-fluid">
        <div className="row mb-5">
          <div className="col-12 text-center">
            {/* Reduced from fs-275 to fs-170 for a bold but professional watermark look */}
            <div className="fs-170 fw-300 ls-minus-5px text-white opacity-1"><span className="text-base-color">©</span> 2026 Adlyngo</div>
          </div>
        </div>
        <div className="row justify-content-center pt-4 sm-pt-35px text-center text-md-start">
          <div className="col-xl-3 col-md-12 lg-mb-30px d-flex justify-content-center justify-content-xl-start">
            <Link href="/" className="footer-logo d-inline-block" aria-label="Adlyngo Logo">
              <Image 
                src="/images/footer-logo.svg" 
                alt="Adlyngo Footer Logo" 
                width={150} 
                height={100} 
                style={{ height: 'auto', display: 'block' }} 
                className="transition-03" 
              />
            </Link>
          </div>
          <div className="col-xl-3 col-md-4 last-paragraph-no-margin lg-mb-30px">
            <p className="w-100 text-white opacity-8">
              <span className="text-white mb-10px fw-600 fs-18 border-bottom border-2 border-color-base-color d-inline-block pb-5px">Adlyngo - India</span><br />
              T3, B1603, NXOne, Tech Zone 4,<br />Opposite Gaur City Mall, <br />Greater Noida, UP, 201306
            </p>
          </div>
          <div className="col-xl-2 col-md-4 lg-mb-30px">
            <ul className="p-0 m-0 list-style-none">
              <li><Link href="/about" className="text-white-hover transition-02">About</Link></li>
              <li><Link href="/services" className="text-white-hover transition-02">Services</Link></li>
              <li><Link href="/projects" className="text-white-hover transition-02">Projects</Link></li>
              <li><Link href="/blog" className="text-white-hover transition-02">Blog</Link></li>
              <li><Link href="/contact" className="text-white-hover transition-02">Contact</Link></li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6 last-paragraph-no-margin lg-mb-30px">
            <span className="text-white mb-15px d-block fw-600 fs-18">Stay Updated</span>
            <p className="mb-20px text-white opacity-8 w-90">Get growth insights, trends, and updates from Adlyngo.</p>
            <form className="position-relative w-100" onSubmit={(e) => e.preventDefault()}>
              <input 
                className="bg-transparent text-white w-100 pb-15px fs-15 border-bottom border-color-transparent-white-light" 
                type="email" 
                placeholder="Enter your email" 
                style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', outline: 'none', borderRadius: 0 }} 
                required
              />
              <button className="btn p-0 text-white position-absolute top-0 right-0 h-100" type="submit" aria-label="Subscribe to newsletter">
                <i className="feather icon-feather-arrow-right fs-20 text-base-color"></i>
              </button>
            </form>
          </div>
          <div className="col-xl-1 col-md-2 text-md-end text-center pt-2">
            <a className="scroll-top text-base-color fs-13 text-uppercase fw-600 ls-1px" aria-label="Scroll to top" href="#">
              Top <i className="feather icon-feather-arrow-up text-base-color ms-2px align-middle fs-16"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
