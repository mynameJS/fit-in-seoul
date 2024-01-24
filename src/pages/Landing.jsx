import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-sky-100 h-screen text-slate-700 font-bold flex flex-col items-center justify-center gap-10">
      <p className="text-xl">언제 어디서든 다양한 경험을 즐겨보세요!</p>
      <img className="size-2/3" src="/Fitinseoul_logo.jpg" alt="main_logo" />
      <Link to={'/login'}>
        <button className="btn btn-active btn-neutral">운동 친구 만나러 가기</button>
      </Link>
    </div>
  );
}
