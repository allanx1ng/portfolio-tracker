export default function ({ edit, setEdit }) {
  return (
    <button
      onClick={() => setEdit(!edit)}
      className={edit ? " btn-primary btn" : "btn btn-outline btn-primary"}
    >
      Edit assets:
    </button>
  )
}
