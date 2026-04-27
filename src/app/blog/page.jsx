import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Latest Blogs",
  description: "Read the latest articles and industry insights from Adlyngo, your premium digital creative agency.",
};

const blogs = [
  {
    category: "Creative",
    title: "Creativity is nothing but a mind set free.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Den viliamson",
    image: "/images/blog-img-01.jpg"
  },
  {
    category: "Creative",
    title: "Simplicity, wit, and good typography.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Walton smith",
    image: "/images/blog-img-02.jpg"
  },
  {
    category: "Meetup",
    title: "What works good is that good different.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Rosald smith",
    image: "/images/blog-img-03.jpg"
  },
  {
    category: "Meetup",
    title: "Look at usual things with unusual.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Maya angelou",
    image: "/images/blog-img-04.jpg"
  },
  {
    category: "Creative",
    title: "Make it simple, but significant.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Andy glamer",
    image: "/images/blog-img-05.jpg"
  },
  {
    category: "Business",
    title: "Do not seek praise seek criticism.",
    excerpt: "Lorem ipsum is simply text of the printing and typesetting industry.",
    author: "Den viliamson",
    image: "/images/blog-img-06.jpg"
  }
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Page Title Section */}
        <section className="pb-0 top-space-margin position-relative">
          <div className="container page-title-extra-large position-relative">
            <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-xxl-9 col-xl-10 text-center text-lg-start">
                <h2 className="text-dark-gray mb-6">Explore fresh articles and industry insights here.</h2>
              </div>
            </div>
            <div className="row align-items-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-md-5 text-center text-md-end md-mb-15px">
                <h1 className="text-uppercase text-white bg-base-color border-radius-30px ps-25px pe-25px pt-10px pb-10px d-inline-block mb-0">Latest blogs</h1>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5 last-paragraph-no-margin text-center text-md-start">
                <p className="lh-26 w-90 sm-w-100">Collaborate to create stronger, smarter branding strategies.</p>
              </div>
            </div>
          </div>
          <Image 
            className="position-absolute left-30px top-130px z-index-minus-2 w-25 h-auto" 
            src="/images/demo-branding-studio-bg-01.jpg" 
            alt="Background Pattern" 
            width={400} 
            height={400} 
          />
        </section>

        {/* Marquee Section */}
        <section className="pt-50px overflow-hidden">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 text-center opacity-8">
                <div 
                  className="fs-200 lh-200 lg-fs-200 sm-w-100 ls-minus-3px text-gradient-light-gray-white text-white-space-nowrap" 
                  data-bottom-top="transform: translate3d(-50px, 0px, 0px);" 
                  data-top-bottom="transform: translate3d(50px, 0px, 0px);"
                >
                  creative digital agency
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="ps-4 pe-4 xxl-ps-2 xxl-pe-2 lg-ps-0 lg-pe-0 pt-0 pb-5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <ul className="blog-side-image blog-wrapper grid grid-2col xl-grid-2col lg-grid-2col md-grid-1col sm-grid-1col xs-grid-1col gutter-extra-large list-style-none p-0">
                  {blogs.map((blog, index) => (
                    <li key={index} className="grid-item mb-4">
                      <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-15px overflow-hidden box-shadow-bottom border border-color-transparent-dark-very-light h-100">
                        <div className="blog-image w-50 sm-w-100 position-relative min-h-300px">
                          <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill 
                            className="object-fit-cover" 
                          />
                          <Link href="/blog" className="blog-post-image-overlay position-absolute top-0 start-0 w-100 h-100 z-index-1" aria-label={`Read ${blog.title}`}></Link>
                        </div>
                        <div className="blog-content w-50 sm-w-100 pt-50px pb-40px ps-40px pe-40px xl-p-30px bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                          <Link href="/blog" className="categories-btn bg-dark-gray text-white text-uppercase fw-500 mb-30px text-decoration-none">{blog.category}</Link>
                          <Link href="/blog" className="card-title text-dark-gray text-dark-gray-hover mb-5px fw-600 fs-18 lh-26 text-decoration-none">{blog.title}</Link>
                          <p>{blog.excerpt}</p>
                          <div className="mt-15px">
                            <span className="separator bg-dark-gray"></span>
                            <Link href="/blog" className="text-dark-gray text-dark-gray-hover d-inline-block fs-15 fw-500 text-decoration-none">{blog.author}</Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Pagination Mock */}
            <div className="col-12 mt-5 d-flex justify-content-center">
              <ul className="pagination pagination-style-01 fs-13 fw-500 mb-0 list-style-none p-0 d-flex gap-2">
                <li className="page-item"><Link className="page-link text-decoration-none" href="/blog"><i className="feather icon-feather-arrow-left fs-18 d-xs-none"></i></Link></li>
                <li className="page-item"><Link className="page-link text-decoration-none" href="/blog">01</Link></li>
                <li className="page-item active"><Link className="page-link text-decoration-none active" href="/blog">02</Link></li>
                <li className="page-item"><Link className="page-link text-decoration-none" href="/blog">03</Link></li>
                <li className="page-item"><Link className="page-link text-decoration-none" href="/blog"><i className="feather icon-feather-arrow-right fs-18 d-xs-none"></i></Link></li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
