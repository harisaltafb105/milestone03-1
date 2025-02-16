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
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Link from "next/link";

export async function generateStaticParams() {
  const query = `*[_type == 'blog']{ slug }`;
  const blogs = await client.fetch(query);
  return blogs.map((blog: any) => ({ slug: blog.slug.current }));
}

const fetchBlogData = async (slug: string) => {
  const query = `*[_type == 'blog' && slug.current == "${slug}"][0]{
    Title, Paragraph, image, block, slug
  }`;
  return await client.fetch(query);
};

const fetchComments = async (slug: string) => {
  const commentsQuery = `*[_type == "comment" && blogSlug == "${slug}"] | order(_createdAt desc)`;
  return await client.fetch(commentsQuery);
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const blogData = await fetchBlogData(params.slug);
  const commentsData = await fetchComments(params.slug);

  if (!blogData) {
    return <div className="text-center text-red-500">Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">{blogData.Title}</h1>
      <div className="relative mb-6">
        <Image
          className="object-cover object-center"
          src={urlFor(blogData.image).url()}
          alt="Blog Image"
          width={1200}
          height={600}
        />
      </div>
      <p className="text-lg text-gray-700 mb-6">{blogData.Paragraph}</p>
      <section className="mb-8">
        <PortableText value={blogData.block} />
      </section>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mt-6">
          {commentsData.length > 0 ? (
            commentsData.map((comment: any, index: number) => (
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
