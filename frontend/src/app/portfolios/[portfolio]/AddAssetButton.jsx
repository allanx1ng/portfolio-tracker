export default function ({ visibility, toggleVisiblity }) {
  return (
    <button
      onClick={() => document.getElementById("my_modal_2").showModal()}
      className={visibility ? "btn-primary btn btn-outline" : "btn btn-primary text-white"}
    >
      Add Assets
    </button>
  )
}
