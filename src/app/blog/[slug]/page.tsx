// "use client";

// import React, { useState, useEffect } from "react";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import { PortableText } from "next-sanity";
// import Link from "next/link";

// const Page = ({ params: { slug } }: { params: { slug: string } }) => {
//   const [data, setData] = useState<any>(null);
//   const [comments, setComments] = useState<any[]>([]);
//   const [commentText, setCommentText] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const query = `*[_type == 'blog' && slug.current == "${slug}"][0]{
//         Title, Paragraph, image, block
//       }`;
//       const blogData = await client.fetch(query);
//       setData(blogData);

//       // Fetch Comments
//       const commentsQuery = `*[_type == "comment" && blogSlug == "${slug}"] | order(_createdAt desc)`;
//       const fetchedComments = await client.fetch(commentsQuery);
//       setComments(fetchedComments);
//     };

//     fetchData();
//   }, [slug]);

//   const handleCommentSubmit = async () => {
//     if (!commentText.trim()) return;

//     const newComment = {
//       _type: "comment",
//       blogSlug: slug,
//       text: commentText,
//     };

//     try {
//       await client.create(newComment);
//       setComments([newComment, ...comments]);
//       setCommentText("");
//     } catch (error) {
//       console.error("Failed to submit comment:", error);
//     }
//   };

//   if (!data) {
//     return <div>Blog post not found.</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold text-center mb-6">{data.Title}</h1>
//       <div className="relative mb-6">
//         <Image
//           className="object-cover object-center"
//           src={urlFor(data.image).url()}
//           alt="Blog Image"
//           width={1200}
//           height={600}
//         />
//       </div>
//       <p className="text-lg text-gray-700 mb-6">{data.Paragraph}</p>
//       <section className="mb-8">
//         <PortableText value={data.block} />
//       </section>

//       {/* Comment Section */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Comments</h2>
//         <textarea
//           className="w-full p-2 border rounded-lg mb-2"
//           rows={3}
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           placeholder="Write a comment..."
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           onClick={handleCommentSubmit}
//         >
//           Submit Comment
//         </button>

//         {/* Display Comments */}
//         <div className="mt-6">
//           {comments.length > 0 ? (
//             comments.map((comment, index) => (
//               <div key={index} className="border p-2 rounded-lg mb-2">
//                 {comment.text}
//               </div>
//             ))
//           ) : (
//             <p>No comments yet.</p>
//           )}
//         </div>
//       </div>

//       <div className="text-center mt-8">
//         <Link href="/" passHref>
//           <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
//             Back to Home
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Link from "next/link";

const Page = ({ params }: { params: { slug: string } }) => {
  const [data, setData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == 'blog' && slug.current == "${params.slug}"][0]{
        Title, Paragraph, image, block
      }`;
      const blogData = await client.fetch(query);
      setData(blogData);

      const commentsQuery = `*[_type == "comment" && blogSlug == "${params.slug}"] | order(_createdAt desc)`;
      const fetchedComments = await client.fetch(commentsQuery);
      setComments(fetchedComments);
    };

    fetchData();
  }, [params.slug]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch("/api/post-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogSlug: params.slug,
          text: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      setCommentText("");
      setComments([{ text: commentText }, ...comments]); // Update locally
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!data) {
    return <div>Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">{data.Title}</h1>
      <div className="relative mb-6">
        <Image
          className="object-cover object-center"
          src={urlFor(data.image).url()}
          alt="Blog Image"
          width={1200}
          height={600}
        />
      </div>
      <p className="text-lg text-gray-700 mb-6">{data.Paragraph}</p>
      <section className="mb-8">
        <PortableText value={data.block} />
      </section>

      {/* Comment Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <textarea
          className="w-full p-2 border rounded-lg mb-2"
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleCommentSubmit}
        >
          Submit Comment
        </button>

        {/* Display Comments */}
        <div className="mt-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="border p-2 rounded-lg mb-2">
                {comment.text}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" passHref>
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
