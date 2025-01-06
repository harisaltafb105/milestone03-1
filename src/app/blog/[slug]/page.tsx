import React from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Link from "next/link";

const page = async ({ params: { slug } }: { params: { slug: string } }) => {
  // Fetch data from Sanity using the slug
  const query = `*[_type == 'blog' && slug.current == "${slug}"]{
    Title, Paragraph, image, block
  }[0]`;

  const data = await client.fetch(query);

  if (!data) {
    return <div>Blog post not found.</div>; // Handle case where no data is found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Title */}
      <h1 className="text-4xl font-bold text-center mb-6">{data.Title}</h1>

      {/* Blog Image */}
      <div className="relative mb-6">
        <Image
          className="object-cover object-center"
          src={urlFor(data.image).url()}
          alt="Blog Image"
          width={1200}
          height={600}
        />
      </div>

      {/* Blog Paragraph */}
      <p className="text-lg text-gray-700 mb-6">{data.Paragraph}</p>

      {/* Portable Text (Rich Text content) */}
      <section className="mb-8">
        <PortableText value={data.block} />
      </section>

      {/* Back Button */}
      <div className="text-center">
        <Link href="/" passHref>
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default page;
