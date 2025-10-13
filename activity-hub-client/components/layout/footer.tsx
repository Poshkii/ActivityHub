export function Footer() {
    return (
        <footer style={{backgroundColor: "color-mix(in oklab, var(--primary) 90%, transparent"}} className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className=" flex h-16 justify-center items-center" style={{width: "100%", paddingLeft: "2rem", paddingRight: "2rem" }}>
                <span style={{color: "#fff"}} className="text-sm text-gray-500">© donrac@ktu.lt</span>
            </div>
        </footer>
    )
}