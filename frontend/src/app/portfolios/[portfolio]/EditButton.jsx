
export default function ({edit, setEdit}) {
  return (
    <div>
      <button onClick={() => setEdit(!edit)} className="btn">Edit assets:</button>
    </div>
  )
}
