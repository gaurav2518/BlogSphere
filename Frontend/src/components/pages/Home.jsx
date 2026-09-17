import React, { useEffect, useState } from 'react'
import { Container, PostCard, HandLoaderCSS } from '../index'
import { Link } from 'react-router-dom'
import appwriteService from '../../appwrite/config'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        setIsLoading(true)
        if (authStatus) {
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents.filter(p => p.status === 'active'));
                }
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
        } else {
            setPosts([])
            setIsLoading(false)
        }
    }, [authStatus])

    if (isLoading) {
        return (
            <div className="w-full py-16">
                <Container>
                    <HandLoaderCSS text="Loading posts..." size="large" />
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-12 mt-8">
                <Container>
                    <div className="flex flex-wrap justify-center">
                        <div className="p-4 w-full max-w-2xl">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20">
                                {authStatus ? (
                                    <>
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                            ✍️
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-3">
                                            No Posts Found
                                        </h1>
                                        <p className="text-base text-gray-600 mb-6">
                                            There are no active posts yet. Be the first to share your thoughts and stories!
                                        </p>
                                        <Link 
                                            to="/add-post"
                                            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                        >
                                            Create First Post
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                            Welcome to BlogSphere
                                        </h1>
                                        <p className="text-lg text-gray-600 mb-6">
                                            Discover amazing stories and insights from our community
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <Link 
                                                to="/login"
                                                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Login to read posts
                                            </Link>
                                            <Link 
                                                to="/signup"
                                                className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg shadow transition-all duration-300 transform hover:scale-105"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                        Latest Posts
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
                </div>
                <div className='flex flex-wrap -m-3'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-3 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4'>
                            <div className="transform hover:scale-105 transition-all duration-300">
                                <PostCard {...post} />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home