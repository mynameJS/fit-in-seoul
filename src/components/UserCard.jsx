import { Link } from 'react-router-dom';

export default function UserCard({ filterUser }) {
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
            <div className="font-bold">{filterUser.userNickName}</div>
          </div>
        </div>
      </td>
      <td>{filterUser.interest.map(int => `${int} `)}</td>
      <td>{filterUser.residence}</td>
      <th>
        <Link to={'/yourInfo'} state={{ selectedUser: filterUser }}>
          <button className="btn btn-ghost btn-xs">상세정보</button>
        </Link>
      </th>
    </tr>
  );
}
