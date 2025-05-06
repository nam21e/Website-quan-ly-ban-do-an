import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/PostContent.css';
import {
    FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP, FaEnvelope,
    FaThumbsUp, FaThumbsDown, FaReply
} from 'react-icons/fa';
import avatar from '../../assets/images/avatar.png';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [userReactions, setUserReactions] = useState({});

    const fetchComments = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5094/api/Comment/post/${id}`);
            setComments(res.data);
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.nameid;

                const reactionMap = {};
                for (let c of res.data) {
                    const reaction = c.reactions?.find(r => r.userId === userId);
                    if (reaction) {
                        reactionMap[c.id] = reaction.type;
                    }
                }
                setUserReactions(reactionMap);
            }
        } catch (error) {
            console.error("Lỗi tải bình luận:", error);
        }
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:5094/api/Post/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setPost(res.data));

        axios.get(`http://localhost:5094/api/Post`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setRelatedPosts(res.data.filter(p => p.id !== parseInt(id)).slice(0, 5));
        });

        fetchComments();
    }, [id, fetchComments]);

    useEffect(() => {
        const convertOembedToIframe = () => {
            const embeds = document.querySelectorAll("oembed[url]");
            embeds.forEach(el => {
                const url = el.getAttribute("url");
                const iframe = document.createElement("iframe");
                iframe.setAttribute("width", "100%");
                iframe.setAttribute("height", "400");
                iframe.setAttribute("src", url.replace("watch?v=", "embed/"));
                iframe.setAttribute("frameBorder", "0");
                iframe.setAttribute("allowfullscreen", "true");

                el.parentNode.replaceWith(iframe);
            });
        };

        convertOembedToIframe();
    }, [post]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Bạn cần đăng nhập để bình luận.");
            return;
        }

        if (!newComment.trim()) return;

        try {
            await axios.post(`http://localhost:5094/api/Comment`, {
                postId: id,
                content: newComment,
                parentId: replyTo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewComment('');
            setReplyTo(null);
            fetchComments();
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
            alert('Lỗi khi gửi bình luận!');
        }
    };

    const handleLike = async (commentId, type) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.post(`http://localhost:5094/api/Comment/${type}/${commentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (error) {
            console.error("Lỗi cập nhật like/dislike:", error);
        }
    };

    const shareUrl = window.location.href;

    const renderComment = (c, level = 0) => {
        const userReaction = userReactions[c.id];

        return (
            <div key={c.id} style={{ marginLeft: level * 20 }} className="border rounded p-2 mb-2">
                <div className="d-flex align-items-center mb-2">
                    <img src={c.avatarUrl || avatar} alt="avatar" className="rounded-circle me-2"
                         style={{ width: 32, height: 32 }} />
                    <div>
                        <strong>{c.user?.fullName || c.user?.userName || 'Ẩn danh'}</strong>
                        <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <p>{c.content}</p>
                <div className="d-flex gap-2">
                    <button
                        className={`btn btn-sm ${userReaction === 'like' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleLike(c.id, 'like')}
                    >
                        <FaThumbsUp /> {c.reactions?.filter(r => r.type === 'like').length || 0}
                    </button>
                    <button
                        className={`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => handleLike(c.id, 'dislike')}
                    >
                        <FaThumbsDown /> {c.reactions?.filter(r => r.type === 'dislike').length || 0}
                    </button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setReplyTo(c.id)}><FaReply /> Trả lời</button>
                </div>
                {comments.filter(reply => reply.parentId === c.id).map(r => renderComment(r, level + 1))}
            </div>
        );
    };

    if (!post) return <p className="text-center mt-5">Đang tải bài viết...</p>;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <nav className="mb-2 text-muted small">
                        <Link to="/">Trang chủ</Link> / {post.regionName} / Bài viết
                    </nav>
                    <h1 className="fw-bold mb-2">{post.title}</h1>
                    <div className="mb-3 text-muted small">
                        Viết bởi <strong>{post.user?.fullName || post.user?.userName || 'Ẩn danh'}</strong> - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>

                    <div className="mb-4 d-flex gap-2 flex-wrap">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="btn btn-sm btn-primary"><FaFacebookF /> Facebook</a>
                        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="btn btn-sm btn-info text-white"><FaTwitter /> Twitter</a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} className="btn btn-sm btn-secondary"><FaLinkedinIn /> LinkedIn</a>
                        <a href={`https://pinterest.com/pin/create/button/?url=${shareUrl}`} className="btn btn-sm btn-danger"><FaPinterestP /> Pinterest</a>
                        <a href={`mailto:?subject=${post.title}&body=${shareUrl}`} className="btn btn-sm btn-dark"><FaEnvelope /> Email</a>
                    </div>

                    <div className="mb-4 post-body-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                    {post.postTags && post.postTags.length > 0 && (
                        <div className="mb-4 post-tags-section">
                            <strong className="me-2">TAGS:</strong>
                            {post.postTags.map((pt, i) => (
                                <span key={i} className="badge bg-secondary text-white me-2 mb-2" style={{ padding: '5px 10px', fontSize: '0.85rem', fontWeight: '500' }}>
                                    #{pt.tag.name.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    )}

                    <hr />
                    <h5>Bình luận</h5>
                    <form onSubmit={handleCommentSubmit} className="mb-4">
                        {replyTo && (() => {
                            const parentComment = comments.find(c => c.id === replyTo);
                            const replyName = parentComment?.user?.fullName || parentComment?.user?.userName || 'Ẩn danh';
                            return (
                                <div className="small mb-2 text-primary">
                                    Trả lời <strong>@{replyName}</strong>
                                </div>
                            );
                        })()}
                        <textarea className="form-control mb-2" rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Viết bình luận..." />
                        <button type="submit" className="btn btn-primary btn-sm">Gửi bình luận</button>
                    </form>

                    {comments.filter(c => c.parentId === null).map(c => renderComment(c))}
                </div>

                <div className="col-lg-4">
                    <h5 className="fw-bold mb-3">Bài viết phổ biến</h5>
                    {relatedPosts.map(p => (
                        <div key={p.id} className="d-flex mb-3">
                            <img src={`http://localhost:5094/images/${p.imageUrl}`} alt={p.title} style={{ width: 80, height: 60, objectFit: 'cover' }} className="rounded me-2" />
                            <div>
                                <Link to={`/post/${p.id}`} className="text-decoration-none text-dark fw-semibold">
                                    <small>{p.title}</small>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
