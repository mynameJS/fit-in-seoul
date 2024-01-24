export default function PostingTableList({ children }) {
  return (
    <div className="overflow-x-auto mx-auto">
      <table className="table">
        <thead>
          <tr>
            <th>작성자</th>
            <th className="text-center">모집 종목</th>
            <th className="text-center">모집 인원</th>
            <th className="text-center">일시</th>
            <th className="text-center">위치</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
