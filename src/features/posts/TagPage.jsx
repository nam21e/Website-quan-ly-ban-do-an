import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TagPage = () => {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5094/api/Post/search?keyword=${tag}`)
            .then(res => setPosts(res.data.items))
            .catch(err => console.error(err));
    }, [tag]);

    return (
        <div className="container py-5">
            <h3 className="mb-4 fw-bold">Bài viết với tag: <span className="text-success">"{tag}"</span></h3>
            <div className="row g-4">
                {posts.map(post => (
                    <div key={post.id} className="col-md-4">
                        <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                            <img src={`http://localhost:5094/images/${post.imageUrl}`} alt={post.title} className="w-100" style={{ height: '180px', objectFit: 'cover' }} />
                            <h6 className="mt-2 fw-bold">{post.title}</h6>
                            <small className="text-muted">{post.authorName} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}</small>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagPage;
