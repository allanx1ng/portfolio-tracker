// import { useRouter } from "next/navigation"

export default function({url}) {
    // const router = useRouter()

    // onClick={() => {
    //     url ? router.push(url) : router.push('/')
    // }}

    return (
        <a className="w-10 h-10 bg-orange-400 rounded-xl absolute bottom-20 left-20 hover:cursor-pointer flex justify-center items-center" href={url}>
            {"<"}
        </a>
    )
}