
export default function ({edit, setEdit}) {
  return (
    <div>
      <button onClick={() => setEdit(!edit)} className="btn w-full">Edit assets:</button>
    </div>
  )
}
