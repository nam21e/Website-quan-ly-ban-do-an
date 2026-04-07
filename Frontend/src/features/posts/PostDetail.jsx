import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/PostContent.css';
import {
    FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP, FaEnvelope,
    FaThumbsUp, FaThumbsDown, FaReply, FaHeart, FaEye
} from 'react-icons/fa';
import avatar from '../../assets/images/avatar.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import StarRatings from 'react-star-ratings';
import HotSidebar from '../../components/Post/HotSidebar';


const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [userReactions, setUserReactions] = useState({});
    const [isBanned, setIsBanned] = useState(false);
    const [violationNotice, setViolationNotice] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [rating, setRating] = useState(0);


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

    const checkBanStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.nameid;
            if (!userId) return;

            const res = await axios.get(`http://localhost:5094/api/User/${userId}/is-banned`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsBanned(res.data === true);
        } catch (err) {
            console.error("Lỗi kiểm tra trạng thái bị chặn:", err);
        }
    }, []);

    const checkBookmarkStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get(`http://localhost:5094/api/Bookmark/check/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookmarked(res.data === true);
        } catch (err) {
            console.error("Lỗi kiểm tra bookmark:", err);
        }
    }, [id]);

    const toggleBookmark = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Bạn cần đăng nhập.');

        await axios.post(`http://localhost:5094/api/Bookmark/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(!bookmarked);
    };

    useEffect(() => {
        axios.get(`http://localhost:5094/api/Post/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setPost(res.data));

        axios.get(`http://localhost:5094/api/Post`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            setRelatedPosts(res.data.filter(p => p.id !== parseInt(id)).slice(0, 5));
        });

        axios.post(`http://localhost:5094/api/Post/view/${id}`).catch(() => { });

        fetchComments();
        checkBanStatus();
        checkBookmarkStatus();
    }, [id, fetchComments, checkBanStatus, checkBookmarkStatus]);

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

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Bạn cần đăng nhập để bình luận.");
            return;
        }

        if (!newComment.trim()) return;

        try {
            const res = await axios.post(`http://localhost:5094/api/Comment`, {
                postId: id,
                content: newComment,
                parentId: replyTo,
                avatarUrl: "/images/avatar.png",
                rating: rating
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { hasViolation, badCommentCount, isBanned } = res.data;
            if (hasViolation && !isBanned) {
                setViolationNotice(`Bình luận của bạn có nội dung không phù hợp. Nếu vi phạm ${3 - badCommentCount} lần nữa, bạn sẽ bị cấm bình luận.`);
            } else {
                setViolationNotice(null);
            }

            setNewComment('');
            setRating(0);
            setReplyTo(null);
            fetchComments();
            checkBanStatus();
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
            alert(error?.response?.data || 'Lỗi khi gửi bình luận!');
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

    const getAverageRating = () => {
        const rated = comments.filter(c => c.rating > 0);
        const total = rated.reduce((sum, c) => sum + c.rating, 0);
        return rated.length ? total / rated.length : 0;
    };

    const shareUrl = window.location.href;

    const renderComment = (c, level = 0) => {
        const userReaction = userReactions[c.id];

        return (
            <div key={c.id} style={{ marginLeft: level * 20 }} className="border rounded p-2 mb-2">
                <div className="d-flex align-items-center mb-2">
                    <img src={c.avatarUrl || avatar} alt="avatar" className="rounded-circle me-2" style={{ width: 32, height: 32 }} />
                    <div>
                        <strong>{c.user?.userName || c.user?.fullName || 'Ẩn danh'}</strong>
                        <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                {c.rating > 0 && (
                    <div className="mb-1">
                        <StarRatings
                            rating={c.rating}
                            starRatedColor="gold"
                            numberOfStars={5}
                            name='display-rating'
                            starDimension="18px"
                            starSpacing="1px"
                        />
                    </div>
                )}
                <p>{c.content}</p>
                <div className="d-flex gap-2">
                    <button className={`btn btn-sm ${userReaction === 'like' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleLike(c.id, 'like')}>
                        <FaThumbsUp /> {c.reactions?.filter(r => r.type === 'like').length || 0}
                    </button>
                    <button className={`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleLike(c.id, 'dislike')}>
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
        <div className="container py-3">
            <div className="row">
                <div className="col-lg-8">
                    <nav className="mb-2 text-muted small">
                        <Link to="/">Trang chủ</Link> / {post.regionName} / Bài viết
                    </nav>
                    <div className="mb-3 d-flex flex-wrap align-items-center text-muted small gap-3">
                        <div>
                            Viết bởi <strong>{post.user?.userName || 'Ẩn danh'}</strong> - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                            <FaEye className="me-1" /> {post.viewCount} lượt xem
                        </div>
                        <button
                            className={`btn btn-sm ${bookmarked ? 'btn-danger' : 'btn-outline-danger'} ms-auto`}
                            onClick={toggleBookmark}
                        >
                            <FaHeart /> {bookmarked ? 'Đã lưu' : 'Lưu'}
                        </button>
                    </div>

                    <h1 className="fw-bold mb-3">
                        {post.title}
                    </h1>

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
                    <h5 className="fw-bold mt-4 mb-3">Bài viết liên quan</h5>
                    <Slider
                        dots={false}
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={1}
                        autoplay={true}              
                        autoplaySpeed={3000}
                        pauseOnHover={true} 
                        responsive={[
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                    >
                        {relatedPosts.map((p) => (
                            <div key={p.id} className="px-2">
                                <Link to={`/post/${p.id}`} className="text-decoration-none text-dark">
                                    <div className="card border-0 shadow-sm" style={{ width: '100%' }}>
                                        <img
                                            src={`http://localhost:5094/images/${p.imageUrl}`}
                                            alt={p.title}
                                            style={{ height: 140, objectFit: 'cover' }}
                                            className="card-img-top"
                                        />
                                        <div className="card-body px-3 py-2" style={{ minHeight: 50 }}>
                                            <h6 className="card-title fw-semibold mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.3em' }}>
                                                {p.title}
                                            </h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>

                    <h5 className="fw-bold text-secondary">Đánh giá trung bình:</h5>
                    <StarRatings
                        rating={getAverageRating()}
                        starRatedColor="gold"
                        numberOfStars={5}
                        name='avg-rating'
                        starDimension="20px"
                        starSpacing="2px"
                    />

                    <hr />

                    <h5>Bình luận</h5>
                    {isBanned ? (
                        <div className="alert alert-danger">Tài khoản của bạn đã bị chặn bình luận do vi phạm nội dung.</div>
                    ) : (
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            {violationNotice && <div className="alert alert-warning small">{violationNotice}</div>}
                            {replyTo && (() => {
                                const parentComment = comments.find(c => c.id === replyTo);
                                const replyName = parentComment?.user?.userName || parentComment?.user?.fullName || 'Ẩn danh';
                                return (
                                    <div className="small mb-2 text-primary">
                                        Trả lời <strong>@{replyName}</strong>
                                    </div>
                                );
                            })()}
                            <div className="mb-2">
                                <strong>Đánh giá bài viết:</strong>
                                <StarRatings
                                    rating={rating}             // Giá trị rating trung bình
                                    starRatedColor="gold"
                                    starHoverColor="orange"
                                    changeRating={handleRatingChange}  // Hàm xử lý khi user đánh giá
                                    numberOfStars={5}
                                    name='user-rating'
                                    starDimension="24px"
                                    starSpacing="2px"
                                />
                            </div>
                            <textarea className="form-control mb-2" rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Viết bình luận..." />
                            <button type="submit" className="btn btn-primary btn-sm">Gửi bình luận</button>
                        </form>
                    )}

                    {comments.filter(c => c.parentId === null).map(c => renderComment(c))}
                </div>

                <div className="col-lg-4">
                    <HotSidebar />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
