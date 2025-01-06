import { client } from "@/sanity/lib/client";
import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default async function Home() {
  const query = `*[_type == 'blog'] {Title, Paragraph, image, "slug": slug.current}`;
  const data: Blog[] = await client.fetch(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Haris Altaf Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((blog) => (
          <div
            key={blog.slug}
            className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-48">
              <Image
                className="object-cover object-center rounded-t-lg"
                src={urlFor(blog.image).url()}
                alt={blog.Title}
                fill
              />
            </div>

            <h2 className="text-xl font-semibold mt-4">{blog.Title}</h2>
            <p className="text-gray-600 mt-2">{blog.Paragraph}</p>
            <a
              href={`/blog/${blog.slug}`}
              className="text-indigo-500 hover:underline mt-4 inline-block"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
