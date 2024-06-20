export default function ({ visibility, toggleVisiblity }) {
  return (
    <button
      onClick={() => document.getElementById("my_modal_2").showModal()}
      className={visibility ? " btn-primary btn" : "btn btn-outline btn-primary"}
    >
      Add Assets
    </button>
  )
}
