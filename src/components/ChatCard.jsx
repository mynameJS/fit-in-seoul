export default function ChatCard({
  data,
  commentEditStates,
  editContent,
  setEditContent,
  editCommentContentHandler,
  setCommentEditStates,
  deleteCommentHandler,
  isEdit,
  date,
}) {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="UserPhoto" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <div className="chat-header text-xs">{data.commentNickName}</div>
      {!commentEditStates[data.commentTime.seconds] && (
        <div className="chat-bubble flex items-center text-sm">{data.commentContent}</div>
      )}

      {commentEditStates[data.commentTime.seconds] && (
        <div className="flex gap-1 items-center">
          <input
            className="input input-bordered input-xs w-full max-w-xs"
            type="text"
            value={editContent}
            onChange={e => {
              setEditContent(e.target.value);
            }}
          />
          <div className="text-xs flex gap-1 whitespace-nowrap">
            <button onClick={() => editCommentContentHandler(data.commentTime.seconds)}>확인</button>
            <button onClick={() => setCommentEditStates({})}>취소</button>
          </div>
        </div>
      )}
      <div className="chat-footer opacity-50 text-xs">{date.toLocaleString()}</div>
      {isEdit && (
        <div className="text-xs flex gap-1">
          <button
            onClick={() => {
              setCommentEditStates({ [data.commentTime.seconds]: true });
            }}>
            수정
          </button>
          <button onClick={() => deleteCommentHandler(data.commentTime.seconds)}>삭제</button>
        </div>
      )}
    </div>
  );
}
