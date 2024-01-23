export default function TableList({ children }) {
  return (
    <div className="overflow-x-auto mx-auto">
      <table className="table ">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>관심사</th>
            <th>사는 곳</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
