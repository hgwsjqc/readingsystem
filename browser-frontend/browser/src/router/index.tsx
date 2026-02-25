import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import { AliveScope } from 'react-activation';

const Home = lazy(() => import('@/components/KeepAliveHome'));
const Mine = lazy(() => import('@/pages/Mine'));
const Login = lazy(() => import('@/pages/Login'));
const Reading = lazy(() => import('@/pages/Reading'));
const ReadingSearch = lazy(() => import('@/pages/ReadingSearch'));
const BookDetail = lazy(() => import('@/pages/reading/detail'));
const Chat = lazy(() => import('@/pages/Chat'));
const PostLayout = lazy(() => import('@/layouts/PostLayout'));
const PostDetail = lazy(() => import('@/pages/post'));
const CreatePost = lazy(() => import('@/pages/post/create'));
const Search = lazy(() => import('@/pages/Search'));
const RAG = lazy(() => import('@/pages/RAG'));
const Git = lazy(() => import('@/pages/Git'));
const MyArticles = lazy(() => import('@/pages/my/articles'));
const MyComments = lazy(() => import('@/pages/my/comments'));
const MyLikes = lazy(() => import('@/pages/my/likes'));
const RoleWorkshop = lazy(() => import('@/pages/RoleWorkshop'));
const SmartReading = lazy(() => import('@/pages/SmartReading'));

export default function RouterConfig({children}: {children?: React.ReactNode}) {
  return (
    <Router>
      {/* 拥有了keep alive 能力  */}
      <AliveScope>
        <Suspense fallback={<Loading/>}>
          <Routes>
            <Route path="/login" element={<Login />}/>
           
            <Route path="/search" element={<Search />} />
            <Route path="/rag" element={<RAG />} />
            <Route path="/git" element={
              <ProtectedRoute>
                <Git />
              </ProtectedRoute>
            } />
            <Route path="/role-workshop" element={
              <ProtectedRoute>
                <RoleWorkshop />
              </ProtectedRoute>
            } />
            <Route path="/smart-reading" element={
              <ProtectedRoute>
                <SmartReading />
              </ProtectedRoute>
            } />
            {/* Post 模块 */}
            <Route path="/post" element={<PostLayout />}>
              <Route path=":id" element={<PostDetail />}/>
              <Route path="create" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }/>
            </Route>
            {/* 用户相关页面 - 都需要登录 */}
            <Route path="/my">
              <Route path="articles" element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              } />
              <Route path="comments" element={
                <ProtectedRoute>
                  <MyComments />
                </ProtectedRoute>
              } />
              <Route path="likes" element={
                <ProtectedRoute>
                  <MyLikes />
                </ProtectedRoute>
              } />
            </Route>
            {/* 布局组件 */}
            <Route path="/" element={<MainLayout/>}>
              <Route path="" element={<Home />} />
              <Route path="reading" element={
                <ProtectedRoute>
                  <Reading />
                </ProtectedRoute>
              } />
              <Route path="reading/search" element={
                <ProtectedRoute>
                  <ReadingSearch />
                </ProtectedRoute>
              } />
              <Route path="reading/:id" element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              } />
              <Route path="chat" element={<Chat />} />
              <Route path="mine" element={
                <ProtectedRoute>
                  <Mine />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </AliveScope>
      {children}
    </Router>
  )
}