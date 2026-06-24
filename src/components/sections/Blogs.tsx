"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { blogs } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-headings/SectionHeading";

export default function Blogs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="blogs" className="relative py-24 md:py-32 bg-[#050B17]/90 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <SectionHeading
          className="text-3xl md:text-4xl font-black tracking-[3px] uppercase mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          MY BLOGS
        </SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.a
              key={blog.id}
              href={blog.url}
              className="group relative rounded-xl glass border border-white/[0.06] hover:border-accent/30 overflow-hidden transition-all duration-300 block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ y: -8, boxShadow: "0 0 40px rgba(255,43,77,0.12)" }}
            >
              {/* Image */}
              <div className="relative h-[170px] overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,11,23,0.9)] to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 text-[0.6rem] font-bold tracking-wider uppercase bg-accent/90 text-white rounded-full">
                  {blog.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-sm font-bold mb-3 leading-snug group-hover:text-accent transition-colors duration-200">
                  {blog.title}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed mb-5 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="inline-flex items-center gap-2 text-[0.7rem] font-semibold text-accent border border-accent/20 px-4 py-2 rounded hover:bg-accent/10 transition-colors duration-200">
                  Read full post
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Read latest posts */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <button
            className="interactive inline-flex items-center gap-2 px-7 py-3 border border-white/10 text-white text-[0.7rem] font-bold tracking-[2px] uppercase rounded hover:border-accent/50 hover:shadow-[0_0_25px_rgba(255,43,77,0.15)] transition-all duration-300"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Read Latest Posts
          </button>
        </motion.div>
      </div>
    </section>
  );
}
