export default function ({ edit, setEdit }) {
  return (
    <button
      onClick={() => setEdit(!edit)}
      className={edit ? " btn-primary btn btn-outline" : "btn btn-primary text-white"}
    >
      Edit assets:
    </button>
  )
}
