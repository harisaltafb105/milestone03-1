"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

const CommentSection = ({ blogSlug }: { blogSlug: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const query = `*[_type == "comment" && blogSlug == $slug] | order(_createdAt desc)`;
        const fetchedComments = await client.fetch(query, { slug: blogSlug });
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogSlug]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      await fetch("/api/post-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, text: commentText }),
      });

      setComments([{ text: commentText }, ...comments]); // Update UI instantly
      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
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
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
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
  );
};

export default CommentSection;
