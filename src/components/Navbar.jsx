import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg header-light bg-white border-bottom border-color-transparent-dark-very-light disable-fixed">
        <div className="container-fluid">
          <div className="col-auto">
            <Link className="navbar-brand" href="/" aria-label="Adlyngo Logo">
              <Image 
                src="/images/logo.svg" 
                alt="Adlyngo Logo" 
                width={150} 
                height={40} 
                className="default-logo" 
                priority
              />
              <Image 
                src="/images/logo.svg" 
                alt="Adlyngo Logo" 
                width={150} 
                height={40} 
                className="alt-logo" 
                priority
              />
              <Image 
                src="/images/logo.svg" 
                alt="Adlyngo Logo" 
                width={150} 
                height={40} 
                className="mobile-logo" 
                priority
              />
            </Link>
          </div>
          <div className="col-auto menu-order left-nav">
            <button
              className="navbar-toggler float-start"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
                <li className="nav-item"><Link href="/about" className="nav-link">About</Link></li>
                <li className="nav-item"><Link href="/services" className="nav-link">Services</Link></li>
                <li className="nav-item"><Link href="/projects" className="nav-link">Projects</Link></li>
                <li className="nav-item"><Link href="/blog" className="nav-link">Blog</Link></li>
                <li className="nav-item"><Link href="/contact" className="nav-link">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-auto ms-auto d-none d-lg-flex">
            <div className="header-icon">
              <span className="text-dark-gray d-none d-xl-block">
                High quality <span className="text-decoration-line-bottom fw-600">digital experience.</span>
              </span>
              <div className="header-button ms-25px">
                <Link href="/contact" className="btn border-1 btn-transparent-light-gray btn-medium btn-rounded left-icon btn-switch-text">
                  <span>
                    <span><i className="feather icon-feather-mail"></i></span>
                    <span className="btn-double-text" data-text="Get in touch">Get in touch</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
