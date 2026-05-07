import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import * as projectService from "@/services/project.service";
import connectDB from "@/lib/mongodb";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  try {
    const project = await projectService.getProjectBySlug(slug);
    return {
      title: `${project.title} | Adlyngo Projects`,
      description: project.description?.substring(0, 160),
    };
  } catch (error) {
    return { title: "Project Not Found" };
  }
}

export default async function SingleProjectPage({ params }) {
  await connectDB();
  const { slug } = await params;
  
  let project;
  try {
    project = await projectService.getProjectBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-5 mt-5 bg-dark-gray text-white min-vh-100">
        <section className="py-5">
          <div className="container mt-5">
            <div className="row mb-5">
              <div className="col-lg-6">
                <span className="text-uppercase fw-600 text-base-color mb-10px d-block ls-1px">
                  {project.category?.name || "Premium Project"}
                </span>
                <h1 className="text-white fw-700 ls-minus-2px mb-0 fs-80 lg-fs-60">
                  {project.title}
                </h1>
              </div>
              <div className="col-lg-5 offset-lg-1 d-flex flex-column justify-content-end">
                <p className="fs-18 lh-32 opacity-7 mb-0">
                  {project.description || "A showcase of creative excellence and digital innovation crafted by Adlyngo."}
                </p>
              </div>
            </div>

            {project.coverImage?.url && (
              <div className="mb-4 position-relative w-100 h-600px rounded-4 overflow-hidden shadow-2xl">
                <Image 
                  src={project.coverImage.url} 
                  alt={project.title} 
                  fill 
                  className="object-fit-cover"
                  priority
                />
              </div>
            )}

            <div className="row g-4 mt-2">
              <div className="col-md-4">
                <div className="p-4 bg-white-transparent-1 rounded-3 border border-white-transparent-1">
                  <span className="d-block fs-14 text-uppercase opacity-5 mb-1">Client</span>
                  <span className="fs-18 fw-500">{project.clientName || "Confidential"}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-4 bg-white-transparent-1 rounded-3 border border-white-transparent-1">
                  <span className="d-block fs-14 text-uppercase opacity-5 mb-1">Technology</span>
                  <span className="fs-18 fw-500">{project.technologies?.join(", ") || "Fullstack"}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-4 bg-white-transparent-1 rounded-3 border border-white-transparent-1">
                  <span className="d-block fs-14 text-uppercase opacity-5 mb-1">Year</span>
                  <span className="fs-18 fw-500">{project.completionDate ? new Date(project.completionDate).getFullYear() : "2024"}</span>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {project.gallery?.length > 0 && (
              <div className="row g-4 mt-5">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className={idx % 3 === 0 ? "col-12" : "col-md-6"}>
                    <div className="position-relative w-100 h-500px rounded-4 overflow-hidden hover-box">
                      <Image 
                        src={img.url} 
                        alt={`${project.title} gallery ${idx}`} 
                        fill 
                        className="object-fit-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
