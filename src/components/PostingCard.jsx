import { Link } from 'react-router-dom';

export default function PostingCard({ data }) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="userAvatar" />
            </div>
          </div>
          <div>
            <div className="font-bold">{data.writerNickName}</div>
          </div>
        </div>
      </td>
      <td className="text-center">{data.category}</td>
      <td className="text-center">{data.count}</td>
      <td className="text-center">{data.date}</td>
      <td className="text-center">{data.location}</td>
      <th>
        <Link to={'/postingDetails'} state={{ selectedPostingId: data.id }}>
          <button className="btn btn-ghost btn-xs">상세정보</button>
        </Link>
      </th>
    </tr>
  );
}
