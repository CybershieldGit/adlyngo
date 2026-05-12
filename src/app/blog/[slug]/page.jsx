import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import * as blogService from "@/services/blog.service";
import connectDB from "@/lib/mongodb";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  try {
    const blog = await blogService.getBlogBySlug(slug);
    return {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
    };
  } catch (error) {
    return { title: "Blog Not Found" };
  }
}

export default async function SingleBlogPage({ params }) {
  await connectDB();
  const { slug } = await params;
  
  let blog;
  try {
    blog = await blogService.getBlogBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-5 mt-5">
        <section className="py-5">
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="text-center mb-5">
                  <span className="text-uppercase fw-600 text-base-color mb-10px d-block">
                    {blog.category?.name || "Uncategorized"}
                  </span>
                  <h1 className="text-dark-gray fw-700 ls-minus-2px mb-20px">
                    {blog.title}
                  </h1>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="fw-500 text-dark-gray border-end border-color-extra-medium-gray pe-15px me-15px">
                      By {blog.author?.name || "Adlyngo Team"}
                    </div>
                    <div className="text-medium-gray">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                {blog.thumbnail?.url && (
                  <div className="mb-5 position-relative w-100 h-500px rounded-4 overflow-hidden shadow-lg">
                    <Image 
                      src={blog.thumbnail.url} 
                      alt={blog.title} 
                      fill 
                      className="object-fit-cover"
                    />
                  </div>
                )}

                <div className="blog-content tiptap-content fs-18 lh-32 text-medium-gray" 
                     dangerouslySetInnerHTML={{ __html: blog.content }}>
                </div>

                <div className="mt-5 pt-5 border-top border-color-extra-light-gray">
                  <div className="d-flex flex-wrap gap-2">
                    {blog.tags?.map(tag => (
                      <span key={tag} className="bg-light-gray px-3 py-1 rounded-pill fs-14 text-dark-gray">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
